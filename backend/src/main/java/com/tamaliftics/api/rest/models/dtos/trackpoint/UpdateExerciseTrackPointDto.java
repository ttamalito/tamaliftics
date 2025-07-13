package com.tamaliftics.api.rest.models.dtos.trackpoint;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;
import java.util.UUID;

/**
 * DTO for updating an existing exercise track point.
 */
public record UpdateExerciseTrackPointDto(
    @NotNull(message = "ID is required")
    UUID id,
    
    @PastOrPresent(message = "Date must be in the past or present")
    LocalDate date,
    
    @Positive(message = "Reps count must be positive")
    Integer repsCount,
    
    @Positive(message = "Sets count must be positive")
    Integer setsCount,
    
    String description,
    
    UUID exerciseId
) {
}