package com.tamaliftics.api.rest.models.dtos.weight;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;
import java.util.UUID;

/**
 * DTO for updating an existing daily weight record.
 */
public record UpdateDailyWeightDto(
    @NotNull(message = "ID is required")
    UUID id,
    
    @PastOrPresent(message = "Date must be in the past or present")
    LocalDate date,
    
    @Positive(message = "Weight must be positive")
    Double weight
) {
}