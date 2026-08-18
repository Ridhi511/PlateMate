package com.platemate.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Collections;
import java.io.IOException;

@Component
public class JwtAuthenticationFilter
        extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(
            JwtService jwtService) {

        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader =
                request.getHeader("Authorization");

        if (authHeader != null
        && authHeader.startsWith("Bearer ")) {

    String token =
            authHeader.substring(7);

    if (!jwtService.isTokenValid(token)) {

        response.setStatus(
                HttpServletResponse.SC_UNAUTHORIZED);

        return;
    }

    String email =
            jwtService.extractEmail(token);

    String role =
        jwtService.extractRole(token);

UsernamePasswordAuthenticationToken authentication =
        new UsernamePasswordAuthenticationToken(
                email,
                null,
                java.util.List.of(
                        new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                "ROLE_" + role)));

    SecurityContextHolder
            .getContext()
            .setAuthentication(authentication);
}

        filterChain.doFilter(
                request,
                response);
    }
}