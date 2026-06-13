package com.platemate.backend.exception;

public class OrganizationAlreadyExistsException extends RuntimeException {

    public OrganizationAlreadyExistsException(String name) {
        super("Organization already exists: " + name);
    }
}