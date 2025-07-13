package com.tamaliftics.api.rest.models.dtos.exercise;

import java.util.UUID;

/**
 * DTO for retrieving exercise category information.
 */
public record GetExerciseCategoryDto(
    UUID id,
    String name,
    String description,
    UUID userId
) {
}