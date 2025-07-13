package com.tamaliftics.api.rest.models.dtos.diet;

import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.UUID;

/**
 * DTO for updating an existing diet.
 */
public record UpdateDietDto(
    @NotNull(message = "ID is required")
    UUID id,
    
    String name,
    
    String description,
    
    List<UUID> mealIds
) {
}