package com.tamaliftics.api.rest.models.dtos.workout;

import com.tamaliftics.api.rest.models.Day;
import com.tamaliftics.api.rest.models.WorkoutPlanType;
import com.tamaliftics.api.rest.models.dtos.exercise.GetExerciseDto;

import java.util.List;
import java.util.UUID;

/**
 * DTO for retrieving workout plan information.
 */
public record GetWorkoutPlanDto(
    UUID id,
    WorkoutPlanType type,
    Day day,
    String description,
    List<GetExerciseDto> exercises,
    UUID userId
) {
}