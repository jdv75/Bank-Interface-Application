package com.revature.neurobank.controllers;

import com.revature.neurobank.models.Transaction;
import com.revature.neurobank.services.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/transactions")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:4200"}, allowedHeaders = "*")
public class TransactionController {
    private final TransactionService transactionService;

    @Autowired
    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping
    public ResponseEntity<Transaction> insertTransaction (@RequestBody Transaction transaction) {
        Transaction newTransaction = transactionService.insertTransaction(transaction);
        return ResponseEntity.status(201).body(newTransaction);
    }
}
