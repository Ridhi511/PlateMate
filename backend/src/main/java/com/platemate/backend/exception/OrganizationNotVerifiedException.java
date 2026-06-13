package com.platemate.backend.exception;

public class OrganizationNotVerifiedException extends RuntimeException {

    public OrganizationNotVerifiedException(String name) {
        super("Organization is not verified: " + name);
    }
}