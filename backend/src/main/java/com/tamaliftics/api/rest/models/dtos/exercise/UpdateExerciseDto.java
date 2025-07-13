package com.tamaliftics.api.rest.models.dtos.exercise;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

/**
 * DTO for updating an existing exercise.
 */
public record UpdateExerciseDto(
    @NotNull(message = "ID is required")
    UUID id,
    
    String name,
    
    String description,
    
    UUID categoryId
) {
}