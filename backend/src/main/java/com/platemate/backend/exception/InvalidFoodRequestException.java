package com.platemate.backend.exception;

public class InvalidFoodRequestException extends RuntimeException {

    public InvalidFoodRequestException(String message) {
        super(message);
    }
}