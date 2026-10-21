package com.revature.neurobank.exceptions;

public class InvalidAccountRequestException extends RuntimeException {
    public InvalidAccountRequestException(String message) {
        super(message);
    }
}
