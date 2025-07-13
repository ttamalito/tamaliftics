package com.tamaliftics.api.rest.models.dtos.weight;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;

/**
 * DTO for creating a new daily weight record.
 */
public record CreateDailyWeightDto(
    @NotNull(message = "Date is required")
    @PastOrPresent(message = "Date must be in the past or present")
    LocalDate date,
    
    @NotNull(message = "Weight is required")
    @Positive(message = "Weight must be positive")
    Double weight
) {
}