package com.platemate.backend.exception;

public class RoleMismatchException extends RuntimeException {

    public RoleMismatchException(String message) {
        super(message);
    }
}