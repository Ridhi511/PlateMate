package com.platemate.backend.controller;

import com.platemate.backend.dto.LoginRequest;
import com.platemate.backend.dto.LoginResponse;
import com.platemate.backend.dto.RegisterRequest;
import com.platemate.backend.entity.User;
import com.platemate.backend.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(
            AuthService authService) {

        this.authService = authService;
    }

    @PostMapping("/register")
    public User register(
            @RequestBody RegisterRequest request) {

        return authService.register(
                request);
    }

    @PostMapping("/login")
    public LoginResponse login(
            @RequestBody LoginRequest request) {

        return authService.login(
                request);
    }
}