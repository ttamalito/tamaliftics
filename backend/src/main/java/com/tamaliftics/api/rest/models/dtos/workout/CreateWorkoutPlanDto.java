package com.tamaliftics.api.rest.models.dtos.workout;

import com.tamaliftics.api.rest.models.Day;
import com.tamaliftics.api.rest.models.WorkoutPlanType;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.UUID;

/**
 * DTO for creating a new workout plan.
 */
public record CreateWorkoutPlanDto(
    @NotNull(message = "Type is required")
    WorkoutPlanType type,
    
    @NotNull(message = "Day is required")
    Day day,
    
    String description,
    
    List<UUID> exerciseIds
) {
}