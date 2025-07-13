package com.tamaliftics.api.rest.models.dtos.trackpoint;

import java.time.LocalDate;
import java.util.UUID;

/**
 * DTO for retrieving exercise track point information.
 */
public record GetExerciseTrackPointDto(
    UUID id,
    LocalDate date,
    int repsCount,
    int setsCount,
    String description,
    UUID exerciseId
) {
}