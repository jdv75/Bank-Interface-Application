package com.revature.neurobank.dto;

import java.time.Instant;
import java.time.LocalDate;

import com.revature.neurobank.models.TransactionStatus;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

/**
 * This DTO specifies the details of a transfer response that is to be sent 
 * back to the user.
 
 * @param transactionId The transaction ID of the transfer.
 * @param createdAt The time that the transfer was acknowledged.
 * @param status The current status of the transfer request.
 * @param originAccountId The account from which the transfer was initiated.
 * @param destination The destination account details.
 * @param amount The amount transferred.
 * @param transactionNote An optional note attached to the transfer.
 * @param scheduledFor The requested execution date for a scheduled transfer.
 */
public record TransferResponseDTO(
    @NotNull(message = "Transaction ID cannot be null.")
    Integer transactionId,

    @NotNull(message = "Transaction creation date cannot be null.")
    @PastOrPresent(message = "Transaction creation date cannot be in the future.")
    Instant createdAt,

    @NotNull(message = "Transaction status cannot be null.")
    TransactionStatus status,

    @NotNull(message = "Source account ID cannot be null.")
    Integer originAccountId,

    @NotNull(message = "Destination account details cannot be null.")
    @Valid
    TransferDestinationDTO destination,

    @NotNull(message = "Transfer amount cannot be null.")
    @Positive(message = "Transfer amount must be greater than $0.")
    Double amount,

    @Size(max = 50, message = "Note cannot be longer than 50 characters.")
    String transactionNote,

    LocalDate scheduledFor
) {}
