package com.tamaliftics.api.rest.models.dtos.trackpoint;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;
import java.util.UUID;

/**
 * DTO for creating a new exercise track point.
 */
public record CreateExerciseTrackPointDto(
    @NotNull(message = "Date is required")
    @PastOrPresent(message = "Date must be in the past or present")
    LocalDate date,

    @NotNull(message = "Reps count is required")
    @Positive(message = "Reps count must be positive")
    Integer repsCount,

    @NotNull(message = "Sets count is required")
    @Positive(message = "Sets count must be positive")
    Integer setsCount,

    String description,

    Float weight,

    @NotNull(message = "Exercise ID is required")
    UUID exerciseId
) {
}
