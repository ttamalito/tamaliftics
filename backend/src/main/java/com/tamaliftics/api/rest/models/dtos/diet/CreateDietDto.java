package com.tamaliftics.api.rest.models.dtos.diet;

import jakarta.validation.constraints.NotBlank;

import java.util.List;
import java.util.UUID;

/**
 * DTO for creating a new diet.
 */
public record CreateDietDto(
    @NotBlank(message = "Name is required")
    String name,
    
    String description,
    
    List<UUID> mealIds
) {
}