package com.tamaliftics.api.rest.models.dtos.dish;

import java.util.UUID;

/**
 * DTO for retrieving dish information.
 */
public record GetDishDto(
    UUID id,
    String name,
    String description,
    double calories,
    double carbs,
    double fat,
    double protein,
    UUID userId
) {
}