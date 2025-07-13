package com.tamaliftics.api.rest.models.dtos.weight;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

import java.time.LocalDate;
import java.util.UUID;

/**
 * DTO for updating an existing weekly weight record.
 */
public record UpdateWeeklyWeightDto(
    @NotNull(message = "ID is required")
    UUID id,
    
    @Positive(message = "Week number must be positive")
    Integer weekNumber,
    
    @PositiveOrZero(message = "Year must be positive or zero")
    Integer year,
    
    @PastOrPresent(message = "Start date must be in the past or present")
    LocalDate startDate,
    
    @PastOrPresent(message = "End date must be in the past or present")
    LocalDate endDate,
    
    @Positive(message = "Average weight must be positive")
    Double averageWeight
) {
}