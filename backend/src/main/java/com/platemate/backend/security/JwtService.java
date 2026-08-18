package com.platemate.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class JwtService {

    private static final String SECRET_KEY =
            "platemate-secret-key-platemate-secret-key";

   public String generateToken(
        String email,
        String role) {

    return Jwts.builder()
            .subject(email)
            .claim("role", role)
            .issuedAt(new Date())
            .expiration(
                    new Date(
                            System.currentTimeMillis()
                                    + 1000L * 60 * 60 * 24))
            .signWith(
                    io.jsonwebtoken.security.Keys.hmacShaKeyFor(
                            SECRET_KEY.getBytes()),
                    Jwts.SIG.HS256)
            .compact();
}

    public String extractEmail(
            String token) {

        Claims claims =
                Jwts.parser()
                        .verifyWith(
                                io.jsonwebtoken.security.Keys
                                        .hmacShaKeyFor(
                                                SECRET_KEY.getBytes()))
                        .build()
                        .parseSignedClaims(token)
                        .getPayload();

        return claims.getSubject();
    }
    public boolean isTokenValid(String token) {

    try {

        extractEmail(token);

        return true;

    } catch (Exception e) {

        return false;
    }
}
public String extractRole(
        String token) {

    Claims claims =
            Jwts.parser()
                    .verifyWith(
                            io.jsonwebtoken.security.Keys
                                    .hmacShaKeyFor(
                                            SECRET_KEY.getBytes()))
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

    return claims.get(
            "role",
            String.class);
}
}