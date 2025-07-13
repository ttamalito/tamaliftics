package com.tamaliftics.api.rest.models.dtos.weight;

import java.time.LocalDate;
import java.util.UUID;

/**
 * DTO for retrieving weekly weight information.
 */
public record GetWeeklyWeightDto(
    UUID id,
    int weekNumber,
    int year,
    LocalDate startDate,
    LocalDate endDate,
    double averageWeight,
    UUID userId
) {
}