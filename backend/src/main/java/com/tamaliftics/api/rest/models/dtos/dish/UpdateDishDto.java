package com.tamaliftics.api.rest.models.dtos.dish;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.util.UUID;

/**
 * DTO for updating an existing dish.
 */
public record UpdateDishDto(
    @NotNull(message = "ID is required")
    UUID id,
    
    String name,
    
    String description,
    
    @PositiveOrZero(message = "Calories must be positive or zero")
    Double calories,
    
    @PositiveOrZero(message = "Carbs must be positive or zero")
    Double carbs,
    
    @PositiveOrZero(message = "Fat must be positive or zero")
    Double fat,
    
    @PositiveOrZero(message = "Protein must be positive or zero")
    Double protein
) {
}