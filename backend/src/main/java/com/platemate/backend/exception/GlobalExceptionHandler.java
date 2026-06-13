package com.platemate.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<?> handleUserNotFound(
            UserNotFoundException ex) {

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(Map.of(
                        "error",
                        ex.getMessage()
                ));
    }

    @ExceptionHandler(OrganizationAlreadyExistsException.class)
    public ResponseEntity<?> handleOrganizationExists(
            OrganizationAlreadyExistsException ex) {

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of(
                        "error",
                        ex.getMessage()
                ));
    }

    @ExceptionHandler(RoleMismatchException.class)
    public ResponseEntity<?> handleRoleMismatch(
            RoleMismatchException ex) {

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of(
                        "error",
                        ex.getMessage()
                ));
    }
}