package com.revature.neurobank.dto;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

/**
 * This interface is used to resolve the transfer type and destination
 * of a transfer request. There can be two types of transfers:
 * 
 * <ul>
 *      <li>Internal: These are transfers between the user's own accounts.</li>
 *      <li>External: These are transfers between different user accounts.</li>
 * </ul>
 * 
 * In order to not require separate request classes for internal and external
 * transfers, we use this interface to simplify the type representation.
 * 
 * We do this by using the {@code @JsonTypeInfo and @JsonSubTypes annotations}
 * so that Jackson can deserialize the user's request into the appropriate 
 * transfer category.<br><br>
 * 
 * For {@code @JsonTypeInfo} there are 3 fields:
 * <ul>
 *      <li>{@code use}: Specifies <i>how</i> Jackson identifies the class
 *          to be used. Here, we use logical names rather than Java classes.</li>
 *      <li>{@code include}: Specifies <i>how</i> the type identifier is included 
 *          in the request JSON. As a JSON property.</li>
 *      <li>{@code property}: Specifies the name of the JSON property to be used.
 *          In our case, it would be {@code type}.</li>
 * </ul><br><br>
 * 
 * For {@code @JsonSubTypes} there are 2 fields:
 * <ul>
 *      <li>{@code value}: Specifies the class that Jackson should deserialize the
 *          request JSON to.</li>
 *      <li>{@code name}: Specifies the value that should be found for Jackson to
 *          deserialize to the specified class above. This value is looked up from 
 *          the key that is specified in {@code JsonTypeInfo}'s {@code property}
 *          field.</li>
 * </ul><br><br>
 * 
 */
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.PROPERTY,
    property = "type"
)
@JsonSubTypes({
    @JsonSubTypes.Type(
        value = InternalTransferDestinationDTO.class,
        name = "internal"
    ),
    @JsonSubTypes.Type(
        value = ExternalTransferDestinationDTO.class,
        name = "external"
    )
})
public sealed interface TransferDestinationDTO 
    permits InternalTransferDestinationDTO, ExternalTransferDestinationDTO {}
