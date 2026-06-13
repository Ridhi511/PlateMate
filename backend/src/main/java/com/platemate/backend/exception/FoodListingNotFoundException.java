package com.platemate.backend.exception;

public class FoodListingNotFoundException extends RuntimeException {

    public FoodListingNotFoundException(Long id) {
        super("Food listing not found with id: " + id);
    }
}