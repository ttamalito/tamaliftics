package com.tamaliftics.api.rest.controllers;

import com.tamaliftics.api.rest.models.Day;
import com.tamaliftics.api.rest.models.User;
import com.tamaliftics.api.rest.models.dtos.workout.CreateWorkoutPlanDto;
import com.tamaliftics.api.rest.models.dtos.workout.GetWorkoutPlanDto;
import com.tamaliftics.api.rest.models.dtos.workout.UpdateWorkoutPlanDto;
import com.tamaliftics.api.rest.services.WorkoutPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Controller for handling workout plan-related operations
 */
@RestController
@RequestMapping("/workout-plans")
public class WorkoutPlanController {

    private final WorkoutPlanService workoutPlanService;

    @Autowired
    public WorkoutPlanController(WorkoutPlanService workoutPlanService) {
        this.workoutPlanService = workoutPlanService;
    }

    /**
     * Create a new workout plan
     * @param createWorkoutPlanDto the DTO containing workout plan information
     * @param user the authenticated user
     * @return the created workout plan
     */
    @PostMapping
    public ResponseEntity<?> createWorkoutPlan(@RequestBody CreateWorkoutPlanDto createWorkoutPlanDto, @AuthenticationPrincipal User user) {
        Optional<GetWorkoutPlanDto> workoutPlanDtoOptional = workoutPlanService.createWorkoutPlan(createWorkoutPlanDto, user.getId());
        
        if (workoutPlanDtoOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to create workout plan");
        }
        
        return ResponseEntity.status(HttpStatus.CREATED).body(workoutPlanDtoOptional.get());
    }

    /**
     * Update an existing workout plan
     * @param updateWorkoutPlanDto the DTO containing updated workout plan information
     * @param user the authenticated user
     * @return the updated workout plan
     */
    @PutMapping
    public ResponseEntity<?> updateWorkoutPlan(@RequestBody UpdateWorkoutPlanDto updateWorkoutPlanDto, @AuthenticationPrincipal User user) {
        Optional<GetWorkoutPlanDto> workoutPlanDtoOptional = workoutPlanService.updateWorkoutPlan(updateWorkoutPlanDto, user.getId());
        
        if (workoutPlanDtoOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Workout plan not found or not owned by user");
        }
        
        return ResponseEntity.ok(workoutPlanDtoOptional.get());
    }

    /**
     * Get a workout plan by ID
     * @param workoutPlanId the ID of the workout plan to retrieve
     * @param user the authenticated user
     * @return the workout plan
     */
    @GetMapping("/{workoutPlanId}")
    public ResponseEntity<?> getWorkoutPlanById(@PathVariable UUID workoutPlanId, @AuthenticationPrincipal User user) {
        Optional<GetWorkoutPlanDto> workoutPlanDtoOptional = workoutPlanService.getWorkoutPlanById(workoutPlanId, user.getId());
        
        if (workoutPlanDtoOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Workout plan not found or not owned by user");
        }
        
        return ResponseEntity.ok(workoutPlanDtoOptional.get());
    }

    /**
     * Get all workout plans for the authenticated user
     * @param user the authenticated user
     * @return list of workout plans
     */
    @GetMapping
    public ResponseEntity<List<GetWorkoutPlanDto>> getAllWorkoutPlans(@AuthenticationPrincipal User user) {
        List<GetWorkoutPlanDto> workoutPlans = workoutPlanService.getAllWorkoutPlansForUser(user.getId());
        return ResponseEntity.ok(workoutPlans);
    }

    /**
     * Get workout plans by day
     * @param day the day of the week
     * @param user the authenticated user
     * @return list of workout plans for the specified day
     */
    @GetMapping("/day/{day}")
    public ResponseEntity<List<GetWorkoutPlanDto>> getWorkoutPlansByDay(@PathVariable Day day, @AuthenticationPrincipal User user) {
        List<GetWorkoutPlanDto> workoutPlans = workoutPlanService.getWorkoutPlansByDay(day, user.getId());
        return ResponseEntity.ok(workoutPlans);
    }

    /**
     * Delete a workout plan
     * @param workoutPlanId the ID of the workout plan to delete
     * @param user the authenticated user
     * @return success or error message
     */
    @DeleteMapping("/{workoutPlanId}")
    public ResponseEntity<String> deleteWorkoutPlan(@PathVariable UUID workoutPlanId, @AuthenticationPrincipal User user) {
        boolean deleted = workoutPlanService.deleteWorkoutPlan(workoutPlanId, user.getId());
        
        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Workout plan not found or not owned by user");
        }
        
        return ResponseEntity.ok("Workout plan deleted successfully");
    }

    /**
     * Add an exercise to a workout plan
     * @param workoutPlanId the ID of the workout plan
     * @param exerciseId the ID of the exercise to add
     * @param user the authenticated user
     * @return the updated workout plan
     */
    @PostMapping("/{workoutPlanId}/exercises/{exerciseId}")
    public ResponseEntity<?> addExerciseToWorkoutPlan(
            @PathVariable UUID workoutPlanId,
            @PathVariable UUID exerciseId,
            @AuthenticationPrincipal User user) {
        
        Optional<GetWorkoutPlanDto> workoutPlanDtoOptional = workoutPlanService.addExerciseToWorkoutPlan(workoutPlanId, exerciseId, user.getId());
        
        if (workoutPlanDtoOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Workout plan or exercise not found, or not owned by user");
        }
        
        return ResponseEntity.ok(workoutPlanDtoOptional.get());
    }

    /**
     * Remove an exercise from a workout plan
     * @param workoutPlanId the ID of the workout plan
     * @param exerciseId the ID of the exercise to remove
     * @param user the authenticated user
     * @return the updated workout plan
     */
    @DeleteMapping("/{workoutPlanId}/exercises/{exerciseId}")
    public ResponseEntity<?> removeExerciseFromWorkoutPlan(
            @PathVariable UUID workoutPlanId,
            @PathVariable UUID exerciseId,
            @AuthenticationPrincipal User user) {
        
        Optional<GetWorkoutPlanDto> workoutPlanDtoOptional = workoutPlanService.removeExerciseFromWorkoutPlan(workoutPlanId, exerciseId, user.getId());
        
        if (workoutPlanDtoOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Workout plan not found or not owned by user");
        }
        
        return ResponseEntity.ok(workoutPlanDtoOptional.get());
    }
}