package com.platemate.backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter) {

        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                // Enable CORS
                .cors(cors ->
                        cors.configurationSource(
                                corsConfigurationSource()
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        // ==============================
                        // CORS PREFLIGHT
                        // ==============================

                        .requestMatchers(
                                HttpMethod.OPTIONS,
                                "/**"
                        )
                        .permitAll()


                        // ==============================
                        // AUTHENTICATION
                        // ==============================

                        .requestMatchers("/auth/**")
                        .permitAll()


                        // ==============================
                        // FOOD LISTINGS
                        // ==============================

                        // Both providers and receivers
                        // can view food listings
                        .requestMatchers(
                                HttpMethod.GET,
                                "/food-listings/**"
                        )
                        .hasAnyRole("PROVIDER", "RECEIVER")

                        // Only providers can create listings
                        .requestMatchers(
                                HttpMethod.POST,
                                "/food-listings/**"
                        )
                        .hasRole("PROVIDER")

                        // Only providers can modify listings
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/food-listings/**"
                        )
                        .hasRole("PROVIDER")

                        // Only providers can delete listings
                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/food-listings/**"
                        )
                        .hasRole("PROVIDER")


                        // ==============================
                        // FOOD REQUESTS
                        // ==============================

                        // Receiver creates a request
                        .requestMatchers(
                                HttpMethod.POST,
                                "/food-requests/**"
                        )
                        .hasRole("RECEIVER")

                        // Both receiver AND provider
                        // can view requests
                        .requestMatchers(
                                HttpMethod.GET,
                                "/food-requests/**"
                        )
                        .hasAnyRole("RECEIVER", "PROVIDER")

                        // Provider approves a request
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/food-requests/*/approve"
                        )
                        .hasRole("PROVIDER")

                        // Provider rejects a request
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/food-requests/*/reject"
                        )
                        .hasRole("PROVIDER")

                        // Receiver completes a request
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/food-requests/*/complete"
                        )
                        .hasRole("RECEIVER")


                        // ==============================
                        // ADMIN
                        // ==============================

                        .requestMatchers("/admin/**")
                        .hasRole("ADMIN")


                        // ==============================
                        // EVERYTHING ELSE
                        // ==============================

                        .anyRequest()
                        .authenticated()
                )

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }


    // ==========================================
    // CORS CONFIGURATION
    // ==========================================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of("http://localhost:5173")
        );

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                List.of("*")
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }
}