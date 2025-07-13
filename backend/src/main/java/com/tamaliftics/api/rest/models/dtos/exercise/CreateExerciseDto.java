package com.tamaliftics.api.rest.models.dtos.exercise;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

/**
 * DTO for creating a new exercise.
 */
public record CreateExerciseDto(
    @NotBlank(message = "Name is required")
    String name,
    
    String description,
    
    @NotNull(message = "Category ID is required")
    UUID categoryId
) {
}