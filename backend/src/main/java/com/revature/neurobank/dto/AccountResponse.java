package com.revature.neurobank.dto;

public record AccountResponse (
    String id,
    String type,
    String name,
    String last4,
    double balance,
    String routingNumber,
    double pendingTransferAmount
) {}


