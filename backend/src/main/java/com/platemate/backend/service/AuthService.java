package com.platemate.backend.service;

import com.platemate.backend.dto.LoginRequest;
import com.platemate.backend.dto.LoginResponse;
import com.platemate.backend.dto.RegisterRequest;
import com.platemate.backend.entity.User;
import com.platemate.backend.repository.UserRepository;
import com.platemate.backend.security.JwtService;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    public User register(
            RegisterRequest request) {

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setRole(request.getRole());

        return userRepository.save(user);
    }

    public LoginResponse login(
            LoginRequest request) {

        User user =
                userRepository.findByEmail(
                        request.getEmail())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invalid email"));

        if (!user.getPassword()
                .equals(request.getPassword())) {

            throw new RuntimeException(
                    "Invalid password");
        }

        String token =
        jwtService.generateToken(
                user.getEmail(),
                user.getRole().name());

        return new LoginResponse(token);
    }
}