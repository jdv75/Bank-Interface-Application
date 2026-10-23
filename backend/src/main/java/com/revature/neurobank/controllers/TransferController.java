package com.revature.neurobank.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.revature.neurobank.dto.TransferRequestDTO;
import com.revature.neurobank.dto.TransferResponseDTO;
import com.revature.neurobank.services.TransactionService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/transfers")
public class TransferController {
    private final TransactionService transferService;

    @Autowired
    public TransferController(TransactionService transactionService) {
        this.transferService = transactionService;
    }

    @PostMapping()
    public ResponseEntity<TransferResponseDTO> createTransfer(@Valid @RequestBody TransferRequestDTO requestDTO,
        Authentication auth
    ) {
        TransferResponseDTO response = this.transferService.transfer(auth.getName(), requestDTO);
    
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
}
