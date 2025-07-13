package com.tamaliftics.api.rest.models.dtos.diet;

import com.tamaliftics.api.rest.models.dtos.meal.GetMealDto;

import java.util.List;
import java.util.UUID;

/**
 * DTO for retrieving diet information.
 */
public record GetDietDto(
    UUID id,
    String name,
    String description,
    List<GetMealDto> meals,
    double totalCalories,
    double totalCarbs,
    double totalFat,
    double totalProtein,
    UUID userId
) {
}