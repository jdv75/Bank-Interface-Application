package com.revature.neurobank.services;


import com.revature.neurobank.exceptions.AccountNotFoundException;
import com.revature.neurobank.exceptions.InsufficientFundsException;
import com.revature.neurobank.models.Account;
import com.revature.neurobank.models.Transaction;
import com.revature.neurobank.models.TransactionType;
import com.revature.neurobank.repositories.AccountDAO;
import com.revature.neurobank.repositories.TransactionDAO;
import org.springframework.transaction.annotation.Transactional;
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
            throw new InsufficientFundsException("Insufficient funds");
        }

        account.setBalance(account.getBalance() - amount);
    }
    @Transactional
    public void deposit(Account account, Double amount) {
        account.setBalance(account.getBalance() + amount);
    }
}