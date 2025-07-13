package com.tamaliftics.api.rest.models.dtos.weight;

import java.time.LocalDate;
import java.util.UUID;

/**
 * DTO for retrieving daily weight information.
 */
public record GetDailyWeightDto(
    UUID id,
    LocalDate date,
    double weight,
    UUID userId
) {
}