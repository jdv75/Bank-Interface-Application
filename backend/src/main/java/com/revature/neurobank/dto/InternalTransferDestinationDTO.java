package com.revature.neurobank.dto;

import jakarta.validation.constraints.NotNull;

/**
 * This DTO specifies the structure of an <strong>Internal</strong> transfer
 * request (i.e. a transfer between the user's own accounts).
 * 
 * @param destinationAccountId The destination account number of the account
 *                             to be credited.
 */
public record InternalTransferDestinationDTO(
    @NotNull(message = "Destination account details cannot be null.")
    Integer destinationAccountId
) implements TransferDestinationDTO {

}
