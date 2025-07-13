package com.tamaliftics.api.rest.controllers;

import com.tamaliftics.api.rest.models.User;
import com.tamaliftics.api.rest.models.dtos.exercise.CreateExerciseDto;
import com.tamaliftics.api.rest.models.dtos.exercise.GetExerciseDto;
import com.tamaliftics.api.rest.models.dtos.exercise.UpdateExerciseDto;
import com.tamaliftics.api.rest.services.ExerciseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Controller for handling exercise-related operations
 */
@RestController
@RequestMapping("/exercises")
public class ExerciseController {

    private final ExerciseService exerciseService;

    @Autowired
    public ExerciseController(ExerciseService exerciseService) {
        this.exerciseService = exerciseService;
    }

    /**
     * Create a new exercise
     * @param createExerciseDto the DTO containing exercise information
     * @param user the authenticated user
     * @return the created exercise
     */
    @PostMapping
    public ResponseEntity<?> createExercise(@RequestBody CreateExerciseDto createExerciseDto, @AuthenticationPrincipal User user) {
        Optional<GetExerciseDto> exerciseDtoOptional = exerciseService.createExercise(createExerciseDto, user.getId());
        
        if (exerciseDtoOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to create exercise. Category may not exist or not owned by user.");
        }
        
        return ResponseEntity.status(HttpStatus.CREATED).body(exerciseDtoOptional.get());
    }

    /**
     * Update an existing exercise
     * @param updateExerciseDto the DTO containing updated exercise information
     * @param user the authenticated user
     * @return the updated exercise
     */
    @PutMapping
    public ResponseEntity<?> updateExercise(@RequestBody UpdateExerciseDto updateExerciseDto, @AuthenticationPrincipal User user) {
        Optional<GetExerciseDto> exerciseDtoOptional = exerciseService.updateExercise(updateExerciseDto, user.getId());
        
        if (exerciseDtoOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Exercise not found or not owned by user");
        }
        
        return ResponseEntity.ok(exerciseDtoOptional.get());
    }

    /**
     * Get an exercise by ID
     * @param exerciseId the ID of the exercise to retrieve
     * @param user the authenticated user
     * @return the exercise
     */
    @GetMapping("/{exerciseId}")
    public ResponseEntity<?> getExerciseById(@PathVariable UUID exerciseId, @AuthenticationPrincipal User user) {
        Optional<GetExerciseDto> exerciseDtoOptional = exerciseService.getExerciseById(exerciseId, user.getId());
        
        if (exerciseDtoOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Exercise not found or not owned by user");
        }
        
        return ResponseEntity.ok(exerciseDtoOptional.get());
    }

    /**
     * Get all exercises for the authenticated user
     * @param user the authenticated user
     * @return list of exercises
     */
    @GetMapping
    public ResponseEntity<List<GetExerciseDto>> getAllExercises(@AuthenticationPrincipal User user) {
        List<GetExerciseDto> exercises = exerciseService.getAllExercisesForUser(user.getId());
        return ResponseEntity.ok(exercises);
    }

    /**
     * Get exercises by category
     * @param categoryId the ID of the category
     * @param user the authenticated user
     * @return list of exercises in the category
     */
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<GetExerciseDto>> getExercisesByCategory(@PathVariable UUID categoryId, @AuthenticationPrincipal User user) {
        List<GetExerciseDto> exercises = exerciseService.getExercisesByCategory(categoryId, user.getId());
        return ResponseEntity.ok(exercises);
    }

    /**
     * Delete an exercise
     * @param exerciseId the ID of the exercise to delete
     * @param user the authenticated user
     * @return success or error message
     */
    @DeleteMapping("/{exerciseId}")
    public ResponseEntity<String> deleteExercise(@PathVariable UUID exerciseId, @AuthenticationPrincipal User user) {
        boolean deleted = exerciseService.deleteExercise(exerciseId, user.getId());
        
        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Exercise not found or not owned by user");
        }
        
        return ResponseEntity.ok("Exercise deleted successfully");
    }

    /**
     * Search for exercises by name
     * @param name the name to search for
     * @param user the authenticated user
     * @return list of matching exercises
     */
    @GetMapping("/search")
    public ResponseEntity<List<GetExerciseDto>> searchExercisesByName(@RequestParam String name, @AuthenticationPrincipal User user) {
        List<GetExerciseDto> exercises = exerciseService.searchExercisesByName(name, user.getId());
        return ResponseEntity.ok(exercises);
    }
}