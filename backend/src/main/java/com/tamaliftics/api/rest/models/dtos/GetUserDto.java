package com.tamaliftics.api.rest.models.dtos;

import java.util.UUID;

public record GetUserDto(UUID id, String username, String email, String firstName, String lastName) {
}
