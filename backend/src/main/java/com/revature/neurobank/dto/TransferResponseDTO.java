package com.revature.neurobank.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Pattern;

/**
 * This DTO specifies the details of a transfer response that is to be sent 
 * back to the user.
 
 * @param transactionId The transaction ID of the transfer.
 * @param createdAt The time that the transfer was acknowledged.
 * @param status The current status of the transfer request. Could be one of:
 *               {@code "completed"} or {@code "scheduled"}.
 */
public record TransferResponseDTO(
    @NotNull(message = "Transaction ID cannot be null.")
    Integer transactionId,

    @PastOrPresent(message = "Transaction creation date cannot be in the future.")
    LocalDateTime createdAt,

    @Pattern(
        regexp = "(completed|scheduled)",
        message = "Transaction status must be one of 'scheduled' or 'completed'."
    )
    @NotBlank(message = "Transaction status cannot be blank.")
    @NotNull(message = "Transaction status cannot be null.")
    String status
) {

}
