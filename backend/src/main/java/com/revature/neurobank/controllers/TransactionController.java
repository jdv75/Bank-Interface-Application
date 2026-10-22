package com.revature.neurobank.controllers;

import org.springframework.security.core.context.SecurityContextHolder;
import com.revature.neurobank.models.Transaction;
import com.revature.neurobank.services.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:4200"}, allowedHeaders = "*")
public class TransactionController {
    private final TransactionService transactionService;

    @Autowired
    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping
    public ResponseEntity<Transaction> insertTransaction(@RequestBody Transaction transaction) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Transaction newTransaction = transactionService.insertTransaction(username, transaction);
        return ResponseEntity.status(201).body(newTransaction);
    }
}
