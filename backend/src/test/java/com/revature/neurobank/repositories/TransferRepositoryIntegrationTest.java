package com.revature.neurobank.repositories;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionTemplate;

import com.revature.neurobank.PostgresIntegrationTest;
import com.revature.neurobank.models.Account;
import com.revature.neurobank.models.AccountType;
import com.revature.neurobank.models.Bank;
import com.revature.neurobank.models.Transaction;
import com.revature.neurobank.models.TransactionStatus;
import com.revature.neurobank.models.TransactionType;
import com.revature.neurobank.models.User;
import com.revature.neurobank.services.TransactionService;

class TransferRepositoryIntegrationTest extends PostgresIntegrationTest {
    private static final AtomicInteger FIXTURE_SEQUENCE = new AtomicInteger();

    @Autowired
    private TransactionDAO transactionDAO;

    @Autowired
    private AccountDAO accountDAO;

    @Autowired
    private UserDAO userDAO;

    @Autowired
    private BankDAO bankDAO;

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private TransactionTemplate transactionTemplate;

    @Test
    @Transactional
    void findHistoryReturnsOutgoingAndCompletedIncomingTransfers() {
        AccountFixture fixture = createAccountFixture();
        Transaction outgoing = saveTransfer(
            fixture.source(), fixture.internalDestination(), 20.0,
            TransactionStatus.SCHEDULED, LocalDate.now().plusDays(1)
        );
        Transaction incoming = saveTransfer(
            fixture.externalDestination(), fixture.source(), 30.0,
            TransactionStatus.COMPLETED, null
        );

        Page<Transaction> history = transactionDAO.findHistory(
            fixture.source().getAccountId(),
            PageRequest.of(0, 20)
        );

        assertThat(history.getContent())
            .extracting(Transaction::getTransactionId)
            .contains(outgoing.getTransactionId(), incoming.getTransactionId());
    }

    @Test
    @Transactional
    void findHistoryExcludesUnrelatedAndUncompletedIncomingTransfers() {
        AccountFixture fixture = createAccountFixture();
        saveTransfer(
            fixture.source(), fixture.externalDestination(), 20.0,
            TransactionStatus.SCHEDULED, LocalDate.now().plusDays(1)
        );

        Page<Transaction> destinationHistory = transactionDAO.findHistory(
            fixture.externalDestination().getAccountId(),
            PageRequest.of(0, 20)
        );
        Page<Transaction> unrelatedHistory = transactionDAO.findHistory(
            fixture.internalDestination().getAccountId(),
            PageRequest.of(0, 20)
        );

        assertThat(destinationHistory).isEmpty();
        assertThat(unrelatedHistory).isEmpty();
    }

    @Test
    @Transactional
    void findHistoryByTypeReturnsOnlyRequestedTransactionType() {
        AccountFixture fixture = createAccountFixture();
        Transaction transfer = saveTransfer(
            fixture.source(), fixture.internalDestination(), 20.0,
            TransactionStatus.COMPLETED, null
        );
        saveNonTransfer(fixture.source(), TransactionType.DEPOSIT, 50.0);

        Page<Transaction> history = transactionDAO.findHistoryByType(
            fixture.source().getAccountId(),
            TransactionType.TRANSFER,
            PageRequest.of(0, 20)
        );

        assertThat(history.getContent())
            .extracting(Transaction::getTransactionId)
            .containsExactly(transfer.getTransactionId());
    }

    @Test
    @Transactional
    void findHistoryByTypeReturnsEmptyPageWhenTypeDoesNotMatch() {
        AccountFixture fixture = createAccountFixture();
        saveTransfer(
            fixture.source(), fixture.internalDestination(), 20.0,
            TransactionStatus.COMPLETED, null
        );

        Page<Transaction> history = transactionDAO.findHistoryByType(
            fixture.source().getAccountId(),
            TransactionType.WITHDRAW,
            PageRequest.of(0, 20)
        );

        assertThat(history).isEmpty();
    }

    @Test
    @Transactional
    void findScheduledOutgoingTotalsAggregatesScheduledTransfersPerSource() {
        AccountFixture fixture = createAccountFixture();
        saveTransfer(
            fixture.source(), fixture.internalDestination(), 20.0,
            TransactionStatus.SCHEDULED, LocalDate.now().plusDays(1)
        );
        saveTransfer(
            fixture.source(), fixture.externalDestination(), 30.0,
            TransactionStatus.SCHEDULED, LocalDate.now().plusDays(2)
        );
        saveTransfer(
            fixture.source(), fixture.internalDestination(), 40.0,
            TransactionStatus.COMPLETED, null
        );

        List<TransactionDAO.ScheduledOutgoingTotal> totals =
            transactionDAO.findScheduledOutgoingTotals(List.of(fixture.source().getAccountId()));

        assertThat(totals).hasSize(1);
        assertThat(totals.getFirst().getAccountId()).isEqualTo(fixture.source().getAccountId());
        assertThat(totals.getFirst().getTotal()).isEqualTo(50.0);
    }

    @Test
    @Transactional
    void findScheduledOutgoingTotalsReturnsEmptyForAccountsWithoutScheduledTransfers() {
        AccountFixture fixture = createAccountFixture();

        List<TransactionDAO.ScheduledOutgoingTotal> totals =
            transactionDAO.findScheduledOutgoingTotals(
                List.of(fixture.internalDestination().getAccountId())
            );

        assertThat(totals).isEmpty();
    }

    @Test
    @Transactional
    void sumScheduledOutgoingAmountReturnsScheduledTotal() {
        AccountFixture fixture = createAccountFixture();
        saveTransfer(
            fixture.source(), fixture.internalDestination(), 20.0,
            TransactionStatus.SCHEDULED, LocalDate.now().plusDays(1)
        );
        saveTransfer(
            fixture.source(), fixture.externalDestination(), 30.0,
            TransactionStatus.SCHEDULED, LocalDate.now().plusDays(2)
        );

        assertThat(transactionDAO.sumScheduledOutgoingAmount(fixture.source().getAccountId()))
            .isEqualTo(50.0);
    }

    @Test
    @Transactional
    void sumScheduledOutgoingAmountReturnsZeroWithoutScheduledTransfers() {
        AccountFixture fixture = createAccountFixture();

        assertThat(
            transactionDAO.sumScheduledOutgoingAmount(fixture.source().getAccountId())
        ).isZero();
    }

    @Test
    @Transactional
    void findDueScheduledTransferIdsReturnsDueTransfersOldestFirst() {
        AccountFixture fixture = createAccountFixture();
        LocalDate today = LocalDate.now();
        Transaction oldest = saveTransfer(
            fixture.source(), fixture.internalDestination(), 10.0,
            TransactionStatus.SCHEDULED, today.minusDays(2)
        );
        Transaction dueToday = saveTransfer(
            fixture.source(), fixture.externalDestination(), 20.0,
            TransactionStatus.SCHEDULED, today
        );
        saveTransfer(
            fixture.source(), fixture.internalDestination(), 30.0,
            TransactionStatus.SCHEDULED, today.plusDays(1)
        );
        saveTransfer(
            fixture.source(), fixture.externalDestination(), 40.0,
            TransactionStatus.COMPLETED, today.minusDays(1)
        );

        List<Integer> dueIds = transactionDAO.findDueScheduledTransferIds(
            today,
            PageRequest.of(0, 100)
        );

        assertThat(dueIds).containsExactly(oldest.getTransactionId(), dueToday.getTransactionId());
    }

    @Test
    @Transactional
    void findDueScheduledTransferIdsReturnsEmptyWhenNothingIsDue() {
        AccountFixture fixture = createAccountFixture();
        saveTransfer(
            fixture.source(), fixture.internalDestination(), 20.0,
            TransactionStatus.SCHEDULED, LocalDate.now().plusDays(1)
        );

        assertThat(transactionDAO.findDueScheduledTransferIds(
            LocalDate.now(),
            PageRequest.of(0, 100)
        )).isEmpty();
    }

    @Test
    @Transactional
    void findByIdForUpdateReturnsExistingTransaction() {
        AccountFixture fixture = createAccountFixture();
        Transaction transfer = saveTransfer(
            fixture.source(), fixture.internalDestination(), 20.0,
            TransactionStatus.SCHEDULED, LocalDate.now()
        );

        Optional<Transaction> locked = transactionDAO.findByIdForUpdate(
            transfer.getTransactionId()
        );

        assertThat(locked).isPresent();
        assertThat(locked.orElseThrow().getTransactionId()).isEqualTo(transfer.getTransactionId());
    }

    @Test
    @Transactional
    void findByIdForUpdateReturnsEmptyForMissingTransaction() {
        assertThat(transactionDAO.findByIdForUpdate(Integer.MAX_VALUE)).isEmpty();
    }

    @Test
    @Transactional
    void findAllByAccountIdInForUpdateReturnsAccountsInIdOrder() {
        AccountFixture fixture = createAccountFixture();
        List<Integer> reversedIds = List.of(
            fixture.internalDestination().getAccountId(),
            fixture.source().getAccountId()
        );

        List<Account> locked = accountDAO.findAllByAccountIdInForUpdate(reversedIds);

        assertThat(locked)
            .extracting(Account::getAccountId)
            .isSorted()
            .containsExactlyElementsOf(reversedIds.stream().sorted().toList());
    }

    @Test
    @Transactional
    void findAllByAccountIdInForUpdateReturnsEmptyForMissingAccounts() {
        assertThat(accountDAO.findAllByAccountIdInForUpdate(List.of(Integer.MAX_VALUE)))
            .isEmpty();
    }

    @Test
    @Transactional
    void findExternalTransferAccountsForUpdateReturnsMatchingAccountPair() {
        AccountFixture fixture = createAccountFixture();

        List<Account> locked = accountDAO.findExternalTransferAccountsForUpdate(
            fixture.source().getAccountId(),
            fixture.externalDestination().getAccountId(),
            fixture.externalDestination().getBankRoutingNum().getRoutingNumber()
        );

        List<Integer> expectedIds = new ArrayList<>(List.of(
            fixture.source().getAccountId(),
            fixture.externalDestination().getAccountId()
        ));
        expectedIds.sort(Comparator.naturalOrder());
        assertThat(locked).extracting(Account::getAccountId).containsExactlyElementsOf(expectedIds);
    }

    @Test
    @Transactional
    void findExternalTransferAccountsForUpdateExcludesDestinationWithWrongRoutingNumber() {
        AccountFixture fixture = createAccountFixture();

        List<Account> locked = accountDAO.findExternalTransferAccountsForUpdate(
            fixture.source().getAccountId(),
            fixture.externalDestination().getAccountId(),
            fixture.internalDestination().getBankRoutingNum().getRoutingNumber()
        );

        assertThat(locked).extracting(Account::getAccountId)
            .containsExactly(fixture.source().getAccountId());
    }

    @Test
    void concurrentScheduledExecutionMovesMoneyOnlyOnce() throws Exception {
        ScheduledFixture fixture = transactionTemplate.execute(status -> {
            AccountFixture accounts = createAccountFixture();
            Transaction transfer = saveTransfer(
                accounts.source(), accounts.externalDestination(), 125.0,
                TransactionStatus.SCHEDULED, LocalDate.now()
            );
            return new ScheduledFixture(
                accounts.source().getAccountId(),
                accounts.externalDestination().getAccountId(),
                transfer.getTransactionId()
            );
        });
        assertThat(fixture).isNotNull();

        CountDownLatch ready = new CountDownLatch(2);
        CountDownLatch start = new CountDownLatch(1);
        ExecutorService executor = Executors.newFixedThreadPool(2);

        try {
            Future<?> first = executor.submit(() -> executeAfterSignal(fixture.transactionId(), ready, start));
            Future<?> second = executor.submit(() -> executeAfterSignal(fixture.transactionId(), ready, start));

            assertThat(ready.await(5, TimeUnit.SECONDS)).isTrue();
            start.countDown();
            first.get(10, TimeUnit.SECONDS);
            second.get(10, TimeUnit.SECONDS);
        } finally {
            executor.shutdownNow();
        }

        transactionTemplate.executeWithoutResult(status -> {
            Account source = accountDAO.findById(fixture.sourceAccountId()).orElseThrow();
            Account destination = accountDAO.findById(fixture.destinationAccountId()).orElseThrow();
            Transaction transfer = transactionDAO.findById(fixture.transactionId()).orElseThrow();

            assertThat(source.getBalance()).isEqualTo(875.0);
            assertThat(destination.getBalance()).isEqualTo(225.0);
            assertThat(transfer.getStatus()).isEqualTo(TransactionStatus.COMPLETED);
        });
    }

    private void executeAfterSignal(
        Integer transactionId,
        CountDownLatch ready,
        CountDownLatch start
    ) {
        ready.countDown();
        try {
            if (!start.await(5, TimeUnit.SECONDS)) {
                throw new IllegalStateException("Timed out waiting to start concurrent execution.");
            }
            transactionService.executeScheduledTransfer(transactionId);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("Concurrent execution was interrupted.", e);
        }
    }

    private AccountFixture createAccountFixture() {
        int fixtureId = FIXTURE_SEQUENCE.incrementAndGet();
        Bank internalBank = bank(300_000_000 + fixtureId, "Internal Bank " + fixtureId);
        Bank externalBank = bank(400_000_000 + fixtureId, "External Bank " + fixtureId);
        internalBank = bankDAO.save(internalBank);
        externalBank = bankDAO.save(externalBank);

        User alice = user("alice_" + fixtureId);
        User bob = user("bob_" + fixtureId);
        alice = userDAO.save(alice);
        bob = userDAO.save(bob);

        Account source = account(1_000.0, alice, internalBank, AccountType.CHECKING);
        Account internalDestination = account(100.0, alice, internalBank, AccountType.SAVINGS);
        Account externalDestination = account(100.0, bob, externalBank, AccountType.CHECKING);
        accountDAO.saveAllAndFlush(List.of(source, internalDestination, externalDestination));

        return new AccountFixture(source, internalDestination, externalDestination);
    }

    private Transaction saveTransfer(
        Account source,
        Account destination,
        double amount,
        TransactionStatus status,
        LocalDate scheduledFor
    ) {
        Transaction transaction = new Transaction(
            null,
            Instant.now(),
            TransactionType.TRANSFER,
            amount,
            source,
            destination
        );
        transaction.setStatus(status);
        transaction.setScheduledFor(scheduledFor);
        return transactionDAO.saveAndFlush(transaction);
    }

    private Transaction saveNonTransfer(
        Account account,
        TransactionType type,
        double amount
    ) {
        Transaction transaction = new Transaction(null, Instant.now(), type, amount, account);
        transaction.setStatus(TransactionStatus.COMPLETED);
        return transactionDAO.saveAndFlush(transaction);
    }

    private Bank bank(Integer routingNumber, String name) {
        Bank bank = new Bank();
        bank.setRoutingNumber(routingNumber);
        bank.setBankName(name);
        return bank;
    }

    private User user(String username) {
        User user = new User();
        user.setUsername(username);
        user.setPassword("test-password");
        return user;
    }

    private Account account(
        double balance,
        User owner,
        Bank bank,
        AccountType accountType
    ) {
        Account account = new Account();
        account.setBalance(balance);
        account.setPin("1234");
        account.setUsername(owner);
        account.setBankRoutingNum(bank);
        account.setAccountType(accountType);
        return account;
    }

    private record AccountFixture(
        Account source,
        Account internalDestination,
        Account externalDestination
    ) {}

    private record ScheduledFixture(
        Integer sourceAccountId,
        Integer destinationAccountId,
        Integer transactionId
    ) {}
}
