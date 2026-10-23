package com.revature.neurobank.dto;

import java.time.LocalDate;

import jakarta.validation.Valid;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

/**
 * This DTO specifies the details of a transfer request initiated by the user.
 * 
 * @param originAccountId The source account from where the transfer is initiated.
 * @param destination The destination account details. Depending on the transfer,
 *                it could just be a destinationAccountId or also a routintNumber.
 * @param amount The amount of money to be transferred.
 * @param transactionNote A transaction note to be attached to the transaction.
 * @param scheduledFor If it's a scheduled transfer, the date for the transfer to
 *                     occur.
 */
public record TransferRequestDTO(
    @NotNull(message = "Source account ID cannot be null.")
    Integer originAccountId,

    @NotNull(message = "Destination account details cannot be null.")
    @Valid 
    TransferDestinationDTO destination,

    @Positive(message = "Transfer amount must be greater than $0.")
    @NotNull
    Double amount,

    @Size(min = 0, max = 50, message = "Note cannot be longer than 50 characters.")
    String transactionNote,

    @FutureOrPresent
    LocalDate scheduledFor
) {
    public TransferRequestDTO {
        if (transactionNote != null) {
            transactionNote = transactionNote.trim();
            if (transactionNote.isEmpty()) {
                transactionNote = null;
            }
        }
    }
}
