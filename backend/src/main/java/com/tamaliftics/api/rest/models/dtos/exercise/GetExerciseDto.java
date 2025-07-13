package com.tamaliftics.api.rest.models.dtos.exercise;

import com.tamaliftics.api.rest.models.dtos.trackpoint.GetExerciseTrackPointDto;

import java.util.List;
import java.util.UUID;

/**
 * DTO for retrieving exercise information.
 */
public record GetExerciseDto(
    UUID id,
    String name,
    String description,
    GetExerciseCategoryDto category,
    List<GetExerciseTrackPointDto> trackPoints,
    UUID userId
) {
}