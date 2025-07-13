package com.tamaliftics.api.rest.controllers;

import com.tamaliftics.api.rest.models.User;
import com.tamaliftics.api.rest.models.dtos.exercise.CreateExerciseCategoryDto;
import com.tamaliftics.api.rest.models.dtos.exercise.GetExerciseCategoryDto;
import com.tamaliftics.api.rest.models.dtos.exercise.UpdateExerciseCategoryDto;
import com.tamaliftics.api.rest.services.ExerciseCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Controller for handling exercise category-related operations
 */
@RestController
@RequestMapping("/exercise-categories")
public class ExerciseCategoryController {

    private final ExerciseCategoryService exerciseCategoryService;

    @Autowired
    public ExerciseCategoryController(ExerciseCategoryService exerciseCategoryService) {
        this.exerciseCategoryService = exerciseCategoryService;
    }

    /**
     * Create a new exercise category
     * @param createExerciseCategoryDto the DTO containing exercise category information
     * @param user the authenticated user
     * @return the created exercise category
     */
    @PostMapping
    public ResponseEntity<?> createExerciseCategory(@RequestBody CreateExerciseCategoryDto createExerciseCategoryDto, @AuthenticationPrincipal User user) {
        Optional<GetExerciseCategoryDto> exerciseCategoryDtoOptional = exerciseCategoryService.createExerciseCategory(createExerciseCategoryDto, user.getId());
        
        if (exerciseCategoryDtoOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to create exercise category");
        }
        
        return ResponseEntity.status(HttpStatus.CREATED).body(exerciseCategoryDtoOptional.get());
    }

    /**
     * Update an existing exercise category
     * @param updateExerciseCategoryDto the DTO containing updated exercise category information
     * @param user the authenticated user
     * @return the updated exercise category
     */
    @PutMapping
    public ResponseEntity<?> updateExerciseCategory(@RequestBody UpdateExerciseCategoryDto updateExerciseCategoryDto, @AuthenticationPrincipal User user) {
        Optional<GetExerciseCategoryDto> exerciseCategoryDtoOptional = exerciseCategoryService.updateExerciseCategory(updateExerciseCategoryDto, user.getId());
        
        if (exerciseCategoryDtoOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Exercise category not found or not owned by user");
        }
        
        return ResponseEntity.ok(exerciseCategoryDtoOptional.get());
    }

    /**
     * Get an exercise category by ID
     * @param exerciseCategoryId the ID of the exercise category to retrieve
     * @param user the authenticated user
     * @return the exercise category
     */
    @GetMapping("/{exerciseCategoryId}")
    public ResponseEntity<?> getExerciseCategoryById(@PathVariable UUID exerciseCategoryId, @AuthenticationPrincipal User user) {
        Optional<GetExerciseCategoryDto> exerciseCategoryDtoOptional = exerciseCategoryService.getExerciseCategoryById(exerciseCategoryId, user.getId());
        
        if (exerciseCategoryDtoOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Exercise category not found or not owned by user");
        }
        
        return ResponseEntity.ok(exerciseCategoryDtoOptional.get());
    }

    /**
     * Get all exercise categories for the authenticated user
     * @param user the authenticated user
     * @return list of exercise categories
     */
    @GetMapping
    public ResponseEntity<List<GetExerciseCategoryDto>> getAllExerciseCategories(@AuthenticationPrincipal User user) {
        List<GetExerciseCategoryDto> exerciseCategories = exerciseCategoryService.getAllExerciseCategoriesForUser(user.getId());
        return ResponseEntity.ok(exerciseCategories);
    }

    /**
     * Delete an exercise category
     * @param exerciseCategoryId the ID of the exercise category to delete
     * @param user the authenticated user
     * @return success or error message
     */
    @DeleteMapping("/{exerciseCategoryId}")
    public ResponseEntity<String> deleteExerciseCategory(@PathVariable UUID exerciseCategoryId, @AuthenticationPrincipal User user) {
        boolean deleted = exerciseCategoryService.deleteExerciseCategory(exerciseCategoryId, user.getId());
        
        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Exercise category not found or not owned by user");
        }
        
        return ResponseEntity.ok("Exercise category deleted successfully");
    }

    /**
     * Search for exercise categories by name
     * @param name the name to search for
     * @param user the authenticated user
     * @return list of matching exercise categories
     */
    @GetMapping("/search")
    public ResponseEntity<List<GetExerciseCategoryDto>> searchExerciseCategoriesByName(@RequestParam String name, @AuthenticationPrincipal User user) {
        List<GetExerciseCategoryDto> exerciseCategories = exerciseCategoryService.searchExerciseCategoriesByName(name, user.getId());
        return ResponseEntity.ok(exerciseCategories);
    }
}