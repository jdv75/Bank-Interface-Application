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
import com.revature.neurobank.models.TransactionType;
import com.revature.neurobank.repositories.AccountDAO;
import com.revature.neurobank.repositories.TransactionDAO;

import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TransactionService {
    private final TransactionDAO transactionDAO;
    private final AccountDAO accountDAO;

    @Autowired
    public TransactionService(TransactionDAO transactionDAO, AccountDAO accountDAO) {
        this.transactionDAO = transactionDAO;
        this.accountDAO = accountDAO;
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
        }

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
        Account source = this.accountDAO.findByIdForUpdate(requestDTO.originAccountId())
            .orElseThrow(() -> 
                new AccountNotFoundException("Source account not found.")
            );

        if (!source.getUsername().getUsername().equals(username)) {
            throw new AccountNotFoundException("Source account not found.");
        }

        return switch(requestDTO.destination()) {
            case InternalTransferDestinationDTO internal -> transferInternal(source, internal, requestDTO);
            case ExternalTransferDestinationDTO external -> transferExternal(source, external, requestDTO);
        };
    }

    private TransferResponseDTO transferInternal(Account source,
        InternalTransferDestinationDTO destinationDTO,
        TransferRequestDTO requestDTO) {

        Account destination = this.accountDAO.findByIdForUpdate(destinationDTO.destinationAccountId())
            .orElseThrow(() ->
                new AccountNotFoundException("Destination account for internal transfer not found.")
        );

        if (!source.getUsername().getUsername().equals(destination.getUsername().getUsername())) {
            throw new InvalidTransferException(
                "Source account and destination account must be the same for an internal transfer");
        }

        if (source.getAccountId().equals(destination.getAccountId())) {
            throw new InvalidTransferException(
                "Source account ID and destination account ID must be different.");
        }

        return this.sharedTransfer(source, destination, requestDTO);
    }

    private TransferResponseDTO transferExternal(Account source,
        ExternalTransferDestinationDTO destinationDTO,
        TransferRequestDTO requestDTO) {

        Account destination = this.accountDAO.findByAccountIdAndBank_RoutingNumber(
            destinationDTO.destinationAccountId(),
            destinationDTO.routingNumber()).orElseThrow(() ->
                new AccountNotFoundException("Destination account for external transfer not found.")
        );

        if (destination.getUsername().getUsername().equals(source.getUsername().getUsername())) {
            throw new InvalidTransferException(
                "Destination account must belong to another user.");
        }

        return this.sharedTransfer(source, destination, requestDTO);
    }

    private TransferResponseDTO sharedTransfer(Account source, Account destination, TransferRequestDTO requestDTO) {
        double amount = requestDTO.amount();

        this.withdraw(source, amount);
        this.deposit(destination, amount);

        LocalDateTime createdAt = LocalDateTime.now();

        Transaction transferTransaction = new Transaction(
            null,
            createdAt,
            TransactionType.TRANSFER,
            amount,
            source,
            destination
        );

        Transaction saved = this.transactionDAO.save(transferTransaction);

        return new TransferResponseDTO(
            saved.getTransactionId(),
            saved.getDate(),
            "completed"
        );
    }
}