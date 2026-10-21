package com.revature.neurobank.services;


import com.revature.neurobank.models.Transaction;
import com.revature.neurobank.repositories.TransactionDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TransactionService {
    private final TransactionDAO transactionDAO;

    @Autowired

    public TransactionService(TransactionDAO transactionDAO) {
        this.transactionDAO = transactionDAO;
    }

    public Transaction insertTransaction(Transaction transaction) {
        return transaction;
    }
}