package com.tamaliftics.api.rest.models.dtos.workout;

import com.tamaliftics.api.rest.models.Day;
import com.tamaliftics.api.rest.models.WorkoutPlanType;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.UUID;

/**
 * DTO for updating an existing workout plan.
 */
public record UpdateWorkoutPlanDto(
    @NotNull(message = "ID is required")
    UUID id,
    
    WorkoutPlanType type,
    
    Day day,
    
    String description,
    
    List<UUID> exerciseIds
) {
}