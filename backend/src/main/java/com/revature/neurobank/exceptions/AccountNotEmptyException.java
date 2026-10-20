package com.revature.neurobank.exceptions;

public class AccountNotEmptyException extends RuntimeException {
    public AccountNotEmptyException(String message) {
        super(message);
    }
}
