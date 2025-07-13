package com.tamaliftics.api.rest.models.dtos.weight;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

import java.time.LocalDate;

/**
 * DTO for creating a new weekly weight record.
 */
public record CreateWeeklyWeightDto(
    @NotNull(message = "Week number is required")
    @Positive(message = "Week number must be positive")
    Integer weekNumber,
    
    @NotNull(message = "Year is required")
    @PositiveOrZero(message = "Year must be positive or zero")
    Integer year,
    
    @NotNull(message = "Start date is required")
    @PastOrPresent(message = "Start date must be in the past or present")
    LocalDate startDate,
    
    @NotNull(message = "End date is required")
    @PastOrPresent(message = "End date must be in the past or present")
    LocalDate endDate,
    
    @NotNull(message = "Average weight is required")
    @Positive(message = "Average weight must be positive")
    Double averageWeight
) {
}