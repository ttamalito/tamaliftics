package com.tamaliftics.api.rest.models.dtos.meal;

import com.tamaliftics.api.rest.models.MealType;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.UUID;

/**
 * DTO for creating a new meal.
 */
public record CreateMealDto(
    @NotNull(message = "Meal type is required")
    MealType type,
    
    List<UUID> dishIds
) {
}