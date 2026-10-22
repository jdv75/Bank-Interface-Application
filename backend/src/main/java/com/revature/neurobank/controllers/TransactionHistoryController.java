package com.revature.neurobank.controllers;

import com.revature.neurobank.models.TransactionHistoryPageDTO;
import com.revature.neurobank.services.TransactionHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin(origins = "http://localhost:5173")
public class TransactionHistoryController {

    private final TransactionHistoryService transactionHistoryService;

    @Autowired
    public TransactionHistoryController(TransactionHistoryService transactionHistoryService) {
        this.transactionHistoryService = transactionHistoryService;
    }

    private String getCurrentUsername() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @GetMapping("/{accountId}/transactions")
    public ResponseEntity<TransactionHistoryPageDTO> getTransactionHistory(
            @PathVariable Integer accountId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(name = "page_size", defaultValue = "20") int pageSize,
            @RequestParam(required = false) String type) {

        TransactionHistoryPageDTO history = transactionHistoryService.getTransactionHistory(
                getCurrentUsername(), accountId, page, pageSize, type);

        return ResponseEntity.ok().body(history);
    }
}
