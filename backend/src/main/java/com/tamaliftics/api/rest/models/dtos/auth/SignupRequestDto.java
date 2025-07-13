package com.tamaliftics.api.rest.models.dtos.auth;

/**
 * DTO for signup requests
 */
public record SignupRequestDto(
        String username,
        String password,
        String email,
        String firstName,
        String lastName
) {
}