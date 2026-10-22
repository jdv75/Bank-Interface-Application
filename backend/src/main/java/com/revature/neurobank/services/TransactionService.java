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
    public Transaction insertTransaction(Transaction transaction) {

        Integer originAccountId = transaction.getOriginAccountId().getAccountId();
        Double amount = transaction.getAmount();
        TransactionType type = transaction.getTransactionType();

        switch (type) {
            case DEPOSIT -> deposit(originAccountId, amount);
            case WITHDRAW -> withdraw(originAccountId, amount);
        }

        return transactionDAO.save(transaction);
    }

    @Transactional
    public void withdraw(Integer accountId, Double amount) {
        Account account = accountDAO.findByIdForUpdate(accountId)
                .orElseThrow(() -> new AccountNotFoundException("Account not found"));

        if (account.getBalance() < amount) {
            throw new InsufficientFundsException("Insufficient funds");
        }

        account.setBalance(account.getBalance() - amount);
    }

    @Transactional
    public void deposit(Integer accountId, Double amount) {
        Account account = accountDAO.findByIdForUpdate(accountId)
                .orElseThrow(() -> new AccountNotFoundException("Account not found"));
        account.setBalance(account.getBalance() + amount);
    }
}