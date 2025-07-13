package com.tamaliftics.api.rest.models.dtos.auth;

/**
 * DTO for login requests
 */
public record LoginRequestDto(
        String username,
        String password
) {
}