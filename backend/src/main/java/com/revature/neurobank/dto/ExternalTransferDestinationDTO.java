package com.revature.neurobank.dto;

import jakarta.validation.constraints.NotNull;

/**
 * This DTO specifies the structure of an <strong>External</strong> transfer
 * request (i.e. a transfer to an account that's not the user's own).
 * 
 * @param destinationAccountId The destination account number of the account
 *                             to be credited.
 * @param routingNumber The routing number of the destination account's bank.
 */
public record ExternalTransferDestinationDTO(
    @NotNull(message = "Destination account details cannot be null.")
    Integer destinationAccountId,

    @NotNull(message = "Routing number cannot be null.")
    Integer routingNumber
) implements TransferDestinationDTO {

}
