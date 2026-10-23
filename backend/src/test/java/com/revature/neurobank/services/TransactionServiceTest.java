package com.revature.neurobank.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Pageable;

import com.revature.neurobank.dto.ExternalTransferDestinationDTO;
import com.revature.neurobank.dto.InternalTransferDestinationDTO;
import com.revature.neurobank.dto.TransferRequestDTO;
import com.revature.neurobank.dto.TransferResponseDTO;
import com.revature.neurobank.exceptions.AccountNotFoundException;
import com.revature.neurobank.exceptions.InsufficientFundsException;
import com.revature.neurobank.exceptions.InvalidTransferException;
import com.revature.neurobank.models.Account;
import com.revature.neurobank.models.Bank;
import com.revature.neurobank.models.Transaction;
import com.revature.neurobank.models.TransactionStatus;
import com.revature.neurobank.models.TransactionType;
import com.revature.neurobank.models.User;
import com.revature.neurobank.repositories.AccountDAO;
import com.revature.neurobank.repositories.TransactionDAO;

@ExtendWith(MockitoExtension.class)
class TransactionServiceTest {
    private static final ZoneId APPLICATION_ZONE = ZoneId.of("America/Los_Angeles");

    @Mock
    private TransactionDAO transactionDAO;

    @Mock
    private AccountDAO accountDAO;

    private TransactionService transactionService;

    @BeforeEach
    void setUp() {
        transactionService = new TransactionService(
            transactionDAO,
            accountDAO,
            APPLICATION_ZONE.getId()
        );
    }

    @Test
    void transferCompletesImmediateInternalTransfer() {
        Account source = account(101, 500.0, "alice", 111111111);
        Account destination = account(102, 100.0, "alice", 111111111);
        TransferRequestDTO request = new TransferRequestDTO(
            source.getAccountId(),
            new InternalTransferDestinationDTO(destination.getAccountId()),
            125.0,
            "Rent",
            null
        );

        when(accountDAO.findAllByAccountIdInForUpdate(List.of(101, 102)))
            .thenReturn(List.of(source, destination));
        stubSavedTransaction();

        TransferResponseDTO response = transactionService.transfer("alice", request);

        assertThat(source.getBalance()).isEqualTo(375.0);
        assertThat(destination.getBalance()).isEqualTo(225.0);
        assertThat(response.status()).isEqualTo(TransactionStatus.COMPLETED);
        assertThat(response.transactionId()).isEqualTo(9001);
    }

    @Test
    void transferCompletesImmediateExternalTransfer() {
        Account source = account(101, 500.0, "alice", 111111111);
        Account destination = account(202, 80.0, "bob", 222222222);
        TransferRequestDTO request = new TransferRequestDTO(
            source.getAccountId(),
            new ExternalTransferDestinationDTO(destination.getAccountId(), 222222222),
            75.0,
            null,
            null
        );

        when(accountDAO.findExternalTransferAccountsForUpdate(101, 202, 222222222))
            .thenReturn(List.of(source, destination));
        stubSavedTransaction();

        TransferResponseDTO response = transactionService.transfer("alice", request);

        assertThat(source.getBalance()).isEqualTo(425.0);
        assertThat(destination.getBalance()).isEqualTo(155.0);
        assertThat(response.status()).isEqualTo(TransactionStatus.COMPLETED);
    }

    @Test
    void transferCreatesScheduledTransferWithoutChangingBalances() {
        Account source = account(101, 500.0, "alice", 111111111);
        Account destination = account(102, 100.0, "alice", 111111111);
        LocalDate scheduledFor = LocalDate.now(APPLICATION_ZONE).plusDays(2);
        TransferRequestDTO request = new TransferRequestDTO(
            source.getAccountId(),
            new InternalTransferDestinationDTO(destination.getAccountId()),
            125.0,
            "Later",
            scheduledFor
        );

        when(accountDAO.findAllByAccountIdInForUpdate(List.of(101, 102)))
            .thenReturn(List.of(source, destination));
        when(transactionDAO.sumScheduledOutgoingAmount(101)).thenReturn(50.0);
        stubSavedTransaction();

        TransferResponseDTO response = transactionService.transfer("alice", request);

        assertThat(source.getBalance()).isEqualTo(500.0);
        assertThat(destination.getBalance()).isEqualTo(100.0);
        assertThat(response.status()).isEqualTo(TransactionStatus.SCHEDULED);
        assertThat(response.scheduledFor()).isEqualTo(scheduledFor);
    }

    @Test
    void transferRejectsScheduledAmountAboveEffectiveBalance() {
        Account source = account(101, 500.0, "alice", 111111111);
        Account destination = account(102, 100.0, "alice", 111111111);
        TransferRequestDTO request = new TransferRequestDTO(
            source.getAccountId(),
            new InternalTransferDestinationDTO(destination.getAccountId()),
            100.0,
            null,
            LocalDate.now(APPLICATION_ZONE).plusDays(1)
        );

        when(accountDAO.findAllByAccountIdInForUpdate(List.of(101, 102)))
            .thenReturn(List.of(source, destination));
        when(transactionDAO.sumScheduledOutgoingAmount(101)).thenReturn(450.0);

        assertThatThrownBy(() -> transactionService.transfer("alice", request))
            .isInstanceOf(InsufficientFundsException.class)
            .hasMessageContaining("available balance");

        verify(transactionDAO, never()).save(any());
    }

    @Test
    void transferRejectsIdenticalAccountIdsBeforeLocking() {
        TransferRequestDTO request = new TransferRequestDTO(
            101,
            new InternalTransferDestinationDTO(101),
            10.0,
            null,
            null
        );

        assertThatThrownBy(() -> transactionService.transfer("alice", request))
            .isInstanceOf(InvalidTransferException.class)
            .hasMessageContaining("must be different");

        verifyNoInteractions(accountDAO, transactionDAO);
    }

    @Test
    void transferRejectsInvalidAmountBeforeAccountLookup() {
        TransferRequestDTO request = new TransferRequestDTO(
            101,
            new InternalTransferDestinationDTO(102),
            Double.NaN,
            null,
            null
        );

        assertThatThrownBy(() -> transactionService.transfer("alice", request))
            .isInstanceOf(InvalidTransferException.class)
            .hasMessageContaining("finite");

        verifyNoInteractions(accountDAO, transactionDAO);
    }

    @Test
    void transferRejectsAmountWithMoreThanTwoDecimalPlaces() {
        TransferRequestDTO request = new TransferRequestDTO(
            101,
            new InternalTransferDestinationDTO(102),
            10.001,
            null,
            null
        );

        assertThatThrownBy(() -> transactionService.transfer("alice", request))
            .isInstanceOf(InvalidTransferException.class)
            .hasMessageContaining("two decimal places");

        verifyNoInteractions(accountDAO, transactionDAO);
    }

    @Test
    void transferRejectsAmountAtMaximumLimit() {
        TransferRequestDTO request = new TransferRequestDTO(
            101,
            new InternalTransferDestinationDTO(102),
            1_000_000.0,
            null,
            null
        );

        assertThatThrownBy(() -> transactionService.transfer("alice", request))
            .isInstanceOf(InvalidTransferException.class)
            .hasMessageContaining("less than $1,000,000");

        verifyNoInteractions(accountDAO, transactionDAO);
    }

    @Test
    void transferRejectsImmediateTransferWithInsufficientFunds() {
        Account source = account(101, 50.0, "alice", 111111111);
        Account destination = account(102, 100.0, "alice", 111111111);
        TransferRequestDTO request = new TransferRequestDTO(
            101,
            new InternalTransferDestinationDTO(102),
            75.0,
            null,
            null
        );

        when(accountDAO.findAllByAccountIdInForUpdate(List.of(101, 102)))
            .thenReturn(List.of(source, destination));

        assertThatThrownBy(() -> transactionService.transfer("alice", request))
            .isInstanceOf(InsufficientFundsException.class);

        assertThat(source.getBalance()).isEqualTo(50.0);
        assertThat(destination.getBalance()).isEqualTo(100.0);
        verify(transactionDAO, never()).save(any());
    }

    @Test
    void transferRejectsInternalDestinationOwnedByAnotherUser() {
        Account source = account(101, 500.0, "alice", 111111111);
        Account destination = account(202, 100.0, "bob", 111111111);
        TransferRequestDTO request = new TransferRequestDTO(
            101,
            new InternalTransferDestinationDTO(202),
            10.0,
            null,
            null
        );

        when(accountDAO.findAllByAccountIdInForUpdate(List.of(101, 202)))
            .thenReturn(List.of(source, destination));

        assertThatThrownBy(() -> transactionService.transfer("alice", request))
            .isInstanceOf(InvalidTransferException.class)
            .hasMessageContaining("same");
    }

    @Test
    void transferRejectsExternalDestinationWhenRoutingNumberDoesNotMatch() {
        Account source = account(101, 500.0, "alice", 111111111);
        TransferRequestDTO request = new TransferRequestDTO(
            101,
            new ExternalTransferDestinationDTO(202, 999999999),
            10.0,
            null,
            null
        );

        when(accountDAO.findExternalTransferAccountsForUpdate(101, 202, 999999999))
            .thenReturn(List.of(source));

        assertThatThrownBy(() -> transactionService.transfer("alice", request))
            .isInstanceOf(AccountNotFoundException.class)
            .hasMessageContaining("Destination");
    }

    @Test
    void transferRejectsSourceAccountOwnedByAnotherUser() {
        Account source = account(101, 500.0, "mallory", 111111111);
        Account destination = account(102, 100.0, "mallory", 111111111);
        TransferRequestDTO request = new TransferRequestDTO(
            101,
            new InternalTransferDestinationDTO(102),
            10.0,
            null,
            null
        );

        when(accountDAO.findAllByAccountIdInForUpdate(List.of(101, 102)))
            .thenReturn(List.of(source, destination));

        assertThatThrownBy(() -> transactionService.transfer("alice", request))
            .isInstanceOf(AccountNotFoundException.class)
            .hasMessageContaining("Source");
    }

    @Test
    void findDueScheduledTransferIdsReturnsRepositoryBatch() {
        when(transactionDAO.findDueScheduledTransferIds(any(LocalDate.class), any(Pageable.class)))
            .thenReturn(List.of(7, 8));

        List<Integer> result = transactionService.findDueScheduledTransferIds(25);

        ArgumentCaptor<Pageable> pageableCaptor = ArgumentCaptor.forClass(Pageable.class);
        verify(transactionDAO).findDueScheduledTransferIds(any(LocalDate.class), pageableCaptor.capture());
        assertThat(result).containsExactly(7, 8);
        assertThat(pageableCaptor.getValue().getPageSize()).isEqualTo(25);
    }

    @Test
    void findDueScheduledTransferIdsRejectsNonPositiveBatchSize() {
        assertThatThrownBy(() -> transactionService.findDueScheduledTransferIds(0))
            .isInstanceOf(IllegalArgumentException.class);

        verifyNoInteractions(transactionDAO);
    }

    @Test
    void findDueScheduledTransferIdsReturnsEmptyListWhenNothingIsDue() {
        when(transactionDAO.findDueScheduledTransferIds(any(LocalDate.class), any(Pageable.class)))
            .thenReturn(List.of());

        assertThat(transactionService.findDueScheduledTransferIds(100)).isEmpty();
    }

    @Test
    void executeScheduledTransferCompletesDueTransfer() {
        Account source = account(101, 500.0, "alice", 111111111);
        Account destination = account(202, 100.0, "bob", 222222222);
        Transaction transfer = scheduledTransfer(77, source, destination, 125.0);

        when(transactionDAO.findByIdForUpdate(77)).thenReturn(Optional.of(transfer));
        when(accountDAO.findAllByAccountIdInForUpdate(List.of(101, 202)))
            .thenReturn(List.of(source, destination));

        transactionService.executeScheduledTransfer(77);

        assertThat(source.getBalance()).isEqualTo(375.0);
        assertThat(destination.getBalance()).isEqualTo(225.0);
        assertThat(transfer.getStatus()).isEqualTo(TransactionStatus.COMPLETED);
    }

    @Test
    void executeScheduledTransferMarksInsufficientFundsAsFailed() {
        Account source = account(101, 50.0, "alice", 111111111);
        Account destination = account(202, 100.0, "bob", 222222222);
        Transaction transfer = scheduledTransfer(77, source, destination, 125.0);

        when(transactionDAO.findByIdForUpdate(77)).thenReturn(Optional.of(transfer));
        when(accountDAO.findAllByAccountIdInForUpdate(List.of(101, 202)))
            .thenReturn(List.of(source, destination));

        transactionService.executeScheduledTransfer(77);

        assertThat(source.getBalance()).isEqualTo(50.0);
        assertThat(destination.getBalance()).isEqualTo(100.0);
        assertThat(transfer.getStatus()).isEqualTo(TransactionStatus.FAILED);
    }

    @Test
    void executeScheduledTransferSkipsMissingTransaction() {
        when(transactionDAO.findByIdForUpdate(404)).thenReturn(Optional.empty());

        transactionService.executeScheduledTransfer(404);

        verifyNoInteractions(accountDAO);
    }

    @Test
    void executeScheduledTransferMarksInvalidPersistedTransferAsFailed() {
        Account source = account(101, 500.0, "alice", 111111111);
        Account destination = account(202, 100.0, "bob", 222222222);
        Transaction transfer = scheduledTransfer(77, source, destination, -5.0);

        when(transactionDAO.findByIdForUpdate(77)).thenReturn(Optional.of(transfer));

        transactionService.executeScheduledTransfer(77);

        assertThat(transfer.getStatus()).isEqualTo(TransactionStatus.FAILED);
        verifyNoInteractions(accountDAO);
    }

    @Test
    void executeScheduledTransferMarksMissingDestinationAsFailed() {
        Account source = account(101, 500.0, "alice", 111111111);
        Account destination = account(202, 100.0, "bob", 222222222);
        Transaction transfer = scheduledTransfer(77, source, destination, 25.0);

        when(transactionDAO.findByIdForUpdate(77)).thenReturn(Optional.of(transfer));
        when(accountDAO.findAllByAccountIdInForUpdate(List.of(101, 202)))
            .thenReturn(List.of(source));

        transactionService.executeScheduledTransfer(77);

        assertThat(transfer.getStatus()).isEqualTo(TransactionStatus.FAILED);
        assertThat(source.getBalance()).isEqualTo(500.0);
    }

    @Test
    void executeScheduledTransferSkipsTransferThatIsNotDue() {
        Account source = account(101, 500.0, "alice", 111111111);
        Account destination = account(202, 100.0, "bob", 222222222);
        Transaction transfer = scheduledTransfer(77, source, destination, 25.0);
        transfer.setScheduledFor(LocalDate.now(APPLICATION_ZONE).plusDays(1));

        when(transactionDAO.findByIdForUpdate(77)).thenReturn(Optional.of(transfer));

        transactionService.executeScheduledTransfer(77);

        assertThat(transfer.getStatus()).isEqualTo(TransactionStatus.SCHEDULED);
        verifyNoInteractions(accountDAO);
    }

    private void stubSavedTransaction() {
        when(transactionDAO.save(any(Transaction.class))).thenAnswer(invocation -> {
            Transaction transaction = invocation.getArgument(0);
            transaction.setTransactionId(9001);
            return transaction;
        });
    }

    private Account account(Integer id, double balance, String username, Integer routingNumber) {
        User user = new User();
        user.setUsername(username);

        Bank bank = new Bank();
        bank.setRoutingNumber(routingNumber);

        Account account = new Account();
        account.setAccountId(id);
        account.setBalance(balance);
        account.setUsername(user);
        account.setBankRoutingNum(bank);
        return account;
    }

    private Transaction scheduledTransfer(
        Integer id,
        Account source,
        Account destination,
        double amount
    ) {
        Transaction transaction = new Transaction(
            id,
            java.time.Instant.now(),
            TransactionType.TRANSFER,
            amount,
            source,
            destination
        );
        transaction.setScheduledFor(LocalDate.now(APPLICATION_ZONE));
        transaction.setStatus(TransactionStatus.SCHEDULED);
        return transaction;
    }
}
