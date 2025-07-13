package com.tamaliftics.api.rest.models.dtos.exercise;

import jakarta.validation.constraints.NotBlank;

/**
 * DTO for creating a new exercise category.
 */
public record CreateExerciseCategoryDto(
    @NotBlank(message = "Name is required")
    String name,
    
    String description
) {
}