package com.tamaliftics.api.rest.models.dtos.exercise;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

/**
 * DTO for updating an existing exercise category.
 */
public record UpdateExerciseCategoryDto(
    @NotNull(message = "ID is required")
    UUID id,
    
    String name,
    
    String description
) {
}