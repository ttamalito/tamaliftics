package com.tamaliftics.api.rest.models.dtos.meal;

import com.tamaliftics.api.rest.models.MealType;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.UUID;

/**
 * DTO for updating an existing meal.
 */
public record UpdateMealDto(
    @NotNull(message = "ID is required")
    UUID id,
    
    MealType type,
    
    List<UUID> dishIds
) {
}