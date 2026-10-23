package com.revature.neurobank.models;

import java.util.Locale;

import com.fasterxml.jackson.annotation.JsonValue;

public enum TransactionStatus {
    SCHEDULED,
    COMPLETED,
    FAILED;

    @JsonValue
    public String toJsonValue() {
        return name().toLowerCase(Locale.ROOT);
    }
}
