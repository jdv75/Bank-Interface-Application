package com.revature.neurobank.services;


import com.revature.neurobank.dto.ExternalTransferDestinationDTO;
import com.revature.neurobank.dto.InternalTransferDestinationDTO;
import com.revature.neurobank.dto.TransferRequestDTO;
import com.revature.neurobank.dto.TransferResponseDTO;
import com.revature.neurobank.exceptions.AccountNotFoundException;
import com.revature.neurobank.exceptions.InsufficientFundsException;
import com.revature.neurobank.exceptions.InvalidTransferException;
import com.revature.neurobank.models.Account;
import com.revature.neurobank.models.Transaction;
import com.revature.neurobank.models.TransactionStatus;
import com.revature.neurobank.models.TransactionType;
import com.revature.neurobank.repositories.AccountDAO;
import com.revature.neurobank.repositories.TransactionDAO;

import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class TransactionService {
    private static final BigDecimal MAX_TRANSFER_AMOUNT = new BigDecimal("1000000");

    private final TransactionDAO transactionDAO;
    private final AccountDAO accountDAO;
    private final ZoneId applicationTimeZone;

    @Autowired
    public TransactionService(
        TransactionDAO transactionDAO,
        AccountDAO accountDAO,

        @Value("${app.time-zone}")
        String applicationTimeZone
    ) {
        this.transactionDAO = transactionDAO;
        this.accountDAO = accountDAO;
        this.applicationTimeZone = ZoneId.of(applicationTimeZone);
    }

    @Transactional
    public Transaction insertTransaction(String username, Transaction transaction) {

        Integer originAccountId = transaction.getOriginAccountId().getAccountId();
        Double amount = transaction.getAmount();
        TransactionType type = transaction.getTransactionType();

        // Verify account exists
        Account account = accountDAO.findByIdForUpdate(originAccountId)
                .orElseThrow(() -> new AccountNotFoundException("Account not found"));
        if (!account.getUsername().getUsername().equals(username)) {
            throw new AccountNotFoundException("Account not found");
        }
        switch (type) {
            case DEPOSIT -> deposit(account, amount);
            case WITHDRAW -> withdraw(account, amount);
            case TRANSFER -> throw new InvalidTransferException(
                "Transfers must be submitted through the transfer endpoint."
            );
        }

        transaction.setDate(Instant.now());
        return transactionDAO.save(transaction);
    }

    @Transactional
    public void withdraw(Account account, Double amount) {
        if (account.getBalance() < amount) {
            throw new InsufficientFundsException("Insufficient funds for a withdrawal.");
        }

        account.setBalance(account.getBalance() - amount);
    }

    @Transactional
    public void deposit(Account account, Double amount) {
        account.setBalance(account.getBalance() + amount);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW, rollbackFor = InsufficientFundsException.class)
    public TransferResponseDTO transfer(String username, TransferRequestDTO requestDTO) {
        double amount = requestDTO.amount();
        if (!Double.isFinite(amount)) {
            throw new InvalidTransferException("Transfer amount must be a finite number.");
        }

        BigDecimal decimalAmount = BigDecimal.valueOf(amount);
        if (decimalAmount.stripTrailingZeros().scale() > 2) {
            throw new InvalidTransferException(
                "Transfer amount cannot have more than two decimal places."
            );
        }

        if (decimalAmount.compareTo(MAX_TRANSFER_AMOUNT) >= 0) {
            throw new InvalidTransferException("Transfer amount must be less than $1,000,000.");
        }

        return switch(requestDTO.destination()) {
            case InternalTransferDestinationDTO internal ->
                transferInternal(username, internal, requestDTO);
            case ExternalTransferDestinationDTO external ->
                transferExternal(username, external, requestDTO);
        };
    }

    @Transactional(readOnly = true)
    public List<Integer> findDueScheduledTransferIds(int batchSize) {
        return this.transactionDAO.findDueScheduledTransferIds(
            LocalDate.now(applicationTimeZone),
            PageRequest.of(0, batchSize)
        );
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void executeScheduledTransfer(Integer transactionId) {
        Transaction transfer = this.transactionDAO.findByIdForUpdate(transactionId)
            .orElse(null);

        if (transfer == null
            || transfer.getStatus() != TransactionStatus.SCHEDULED
            || transfer.getTransactionType() != TransactionType.TRANSFER
            || transfer.getScheduledFor() == null
            || transfer.getScheduledFor().isAfter(LocalDate.now(applicationTimeZone))) {
            return;
        }

        Account sourceReference = transfer.getOriginAccountId();
        Account destinationReference = transfer.getDestinationAccountId();
        Double amount = transfer.getAmount();

        if (sourceReference == null
            || destinationReference == null
            || sourceReference.getAccountId() == null
            || destinationReference.getAccountId() == null
            || sourceReference.getAccountId().equals(destinationReference.getAccountId())
            || amount == null
            || !Double.isFinite(amount)
            || amount <= 0) {

            transfer.setStatus(TransactionStatus.FAILED);
            return;
        }

        Integer sourceAccountId = sourceReference.getAccountId();
        Integer destinationAccountId = destinationReference.getAccountId();
        List<Account> lockedAccounts = this.accountDAO.findAllByAccountIdInForUpdate(
            List.of(sourceAccountId, destinationAccountId)
        );

        Account source = findLockedAccount(lockedAccounts, sourceAccountId).orElse(null);
        Account destination = findLockedAccount(lockedAccounts, destinationAccountId).orElse(null);

        if (source == null
            || destination == null
            || source.getBalance() == null
            || !Double.isFinite(source.getBalance())
            || destination.getBalance() == null
            || !Double.isFinite(destination.getBalance())
            || source.getBalance() < amount) {
                
            transfer.setStatus(TransactionStatus.FAILED);
            return;
        }

        source.setBalance(source.getBalance() - amount);
        destination.setBalance(destination.getBalance() + amount);
        transfer.setStatus(TransactionStatus.COMPLETED);
    }

    private TransferResponseDTO transferInternal(
        String username,
        InternalTransferDestinationDTO destinationDTO,
        TransferRequestDTO requestDTO) {

        Integer sourceAccountId = requestDTO.originAccountId();
        Integer destinationAccountId = destinationDTO.destinationAccountId();

        if (sourceAccountId.equals(destinationAccountId)) {
            throw new InvalidTransferException(
                "Source account ID and destination account ID must be different."
            );
        }

        List<Account> lockedAccounts = this.accountDAO.findAllByAccountIdInForUpdate(
            List.of(sourceAccountId, destinationAccountId)
        );

        Account source = getLockedSourceAccount(lockedAccounts, sourceAccountId, username);
        Account destination = getLockedDestinationAccount(lockedAccounts, destinationAccountId);

        if (!source.getUsername().getUsername().equals(destination.getUsername().getUsername())) {
            throw new InvalidTransferException(
                "Source account and destination account must be the same for an internal transfer");
        }

        return this.sharedTransfer(source, destination, requestDTO);
    }

    private TransferResponseDTO transferExternal(
        String username,
        ExternalTransferDestinationDTO destinationDTO,
        TransferRequestDTO requestDTO) {

        Integer sourceAccountId = requestDTO.originAccountId();
        Integer destinationAccountId = destinationDTO.destinationAccountId();

        if (sourceAccountId.equals(destinationAccountId)) {
            throw new InvalidTransferException(
                "Source account ID and destination account ID must be different."
            );
        }

        List<Account> lockedAccounts = this.accountDAO.findExternalTransferAccountsForUpdate(
            sourceAccountId,
            destinationAccountId,
            destinationDTO.routingNumber()
        );

        Account source = getLockedSourceAccount(lockedAccounts, sourceAccountId, username);
        Account destination = getLockedDestinationAccount(
            lockedAccounts,
            destinationAccountId
        );

        if (destination.getUsername().getUsername().equals(source.getUsername().getUsername())) {
            throw new InvalidTransferException(
                "Destination account must belong to another user.");
        }

        return this.sharedTransfer(source, destination, requestDTO);
    }

    private Account getLockedSourceAccount(
        List<Account> lockedAccounts,
        Integer sourceAccountId,
        String username
    ) {
        Account source = findLockedAccount(lockedAccounts, sourceAccountId)
            .orElseThrow(() -> 
                new AccountNotFoundException("Source account not found.")
            );

        if (!source.getUsername().getUsername().equals(username)) {
            throw new AccountNotFoundException("Source account not found.");
        }

        return source;
    }

    private Account getLockedDestinationAccount(
        List<Account> lockedAccounts,
        Integer destinationAccountId
    ) {
        return findLockedAccount(lockedAccounts, destinationAccountId)
            .orElseThrow(() -> 
                new AccountNotFoundException("Destination account for external transfer not found.")
            );
    }

    private Optional<Account> findLockedAccount(
        List<Account> lockedAccounts,
        Integer accountId
    ) {
        return lockedAccounts.stream()
            .filter(account -> account.getAccountId().equals(accountId))
            .findFirst();
    }

    private TransferResponseDTO sharedTransfer(Account source, Account destination, TransferRequestDTO requestDTO) {
        double amount = requestDTO.amount();
        LocalDate scheduledFor = requestDTO.scheduledFor();
        LocalDate today = LocalDate.now(applicationTimeZone);

        boolean scheduled = scheduledFor != null && scheduledFor.isAfter(today);

        if (scheduled) {
            Double pendingTransferAmount = this.transactionDAO
                .sumScheduledOutgoingAmount(source.getAccountId());
            double availableBalance = source.getBalance()
                - (pendingTransferAmount == null ? 0.0 : pendingTransferAmount);

            if (availableBalance < amount) {
                throw new InsufficientFundsException(
                    "Transfer amount exceeds the available balance after scheduled transfers."
                );
            }
        } else {
            if (source.getBalance() < amount) {
                throw new InsufficientFundsException("Insufficient funds for a transfer.");
            }

            this.withdraw(source, amount);
            this.deposit(destination, amount);
        }

        Instant createdAt = Instant.now();

        Transaction transferTransaction = new Transaction(
            null,
            createdAt,
            TransactionType.TRANSFER,
            amount,
            source,
            destination
        );
        transferTransaction.setNote(requestDTO.transactionNote());
        transferTransaction.setScheduledFor(scheduledFor);
        transferTransaction.setStatus(
            scheduled ? TransactionStatus.SCHEDULED : TransactionStatus.COMPLETED
        );

        Transaction saved = this.transactionDAO.save(transferTransaction);

        return new TransferResponseDTO(
            saved.getTransactionId(),
            saved.getDate(),
            saved.getStatus(),
            source.getAccountId(),
            requestDTO.destination(),
            saved.getAmount(),
            saved.getNote(),
            saved.getScheduledFor()
        );
    }
}
