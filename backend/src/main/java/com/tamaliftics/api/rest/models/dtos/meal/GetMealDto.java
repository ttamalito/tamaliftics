package com.tamaliftics.api.rest.models.dtos.meal;

import com.tamaliftics.api.rest.models.MealType;
import com.tamaliftics.api.rest.models.dtos.dish.GetDishDto;

import java.util.List;
import java.util.UUID;

/**
 * DTO for retrieving meal information.
 */
public record GetMealDto(
    UUID id,
    MealType type,
    List<GetDishDto> dishes,
    double totalCalories,
    double totalCarbs,
    double totalFat,
    double totalProtein,
    UUID userId
) {
}