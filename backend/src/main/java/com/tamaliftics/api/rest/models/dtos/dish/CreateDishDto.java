package com.tamaliftics.api.rest.models.dtos.dish;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.util.UUID;

/**
 * DTO for creating a new dish.
 */
public record CreateDishDto(
    @NotBlank(message = "Name is required")
    String name,
    
    String description,
    
    @NotNull(message = "Calories are required")
    @PositiveOrZero(message = "Calories must be positive or zero")
    Double calories,
    
    @NotNull(message = "Carbs are required")
    @PositiveOrZero(message = "Carbs must be positive or zero")
    Double carbs,
    
    @NotNull(message = "Fat is required")
    @PositiveOrZero(message = "Fat must be positive or zero")
    Double fat,
    
    @NotNull(message = "Protein is required")
    @PositiveOrZero(message = "Protein must be positive or zero")
    Double protein,

    @NotNull(message = "Meal id is required")
    UUID mealId
)
{
}