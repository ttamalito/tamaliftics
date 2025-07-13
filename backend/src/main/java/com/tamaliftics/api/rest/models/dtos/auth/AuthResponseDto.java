package com.tamaliftics.api.rest.models.dtos.auth;

import java.util.UUID;

/**
 * DTO for authentication responses
 */
public record AuthResponseDto(
        String token,
        UUID userId,
        String username,
        String email,
        String role
) {
}