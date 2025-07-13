package com.tamaliftics.api.rest.controllers;

import com.tamaliftics.api.rest.models.User;
import com.tamaliftics.api.rest.models.dtos.trackpoint.CreateExerciseTrackPointDto;
import com.tamaliftics.api.rest.models.dtos.trackpoint.GetExerciseTrackPointDto;
import com.tamaliftics.api.rest.models.dtos.trackpoint.UpdateExerciseTrackPointDto;
import com.tamaliftics.api.rest.services.ExerciseTrackPointService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Controller for handling exercise track point-related operations
 */
@RestController
@RequestMapping("/exercise-track-points")
public class ExerciseTrackPointController {

    private final ExerciseTrackPointService exerciseTrackPointService;

    @Autowired
    public ExerciseTrackPointController(ExerciseTrackPointService exerciseTrackPointService) {
        this.exerciseTrackPointService = exerciseTrackPointService;
    }

    /**
     * Create a new exercise track point
     * @param createExerciseTrackPointDto the DTO containing track point information
     * @param user the authenticated user
     * @return the created track point
     */
    @PostMapping
    public ResponseEntity<?> createExerciseTrackPoint(@RequestBody CreateExerciseTrackPointDto createExerciseTrackPointDto, @AuthenticationPrincipal User user) {
        Optional<GetExerciseTrackPointDto> trackPointDtoOptional = exerciseTrackPointService.createExerciseTrackPoint(createExerciseTrackPointDto, user.getId());
        
        if (trackPointDtoOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to create track point. Exercise may not exist or not owned by user.");
        }
        
        return ResponseEntity.status(HttpStatus.CREATED).body(trackPointDtoOptional.get());
    }

    /**
     * Update an existing exercise track point
     * @param updateExerciseTrackPointDto the DTO containing updated track point information
     * @param user the authenticated user
     * @return the updated track point
     */
    @PutMapping
    public ResponseEntity<?> updateExerciseTrackPoint(@RequestBody UpdateExerciseTrackPointDto updateExerciseTrackPointDto, @AuthenticationPrincipal User user) {
        Optional<GetExerciseTrackPointDto> trackPointDtoOptional = exerciseTrackPointService.updateExerciseTrackPoint(updateExerciseTrackPointDto, user.getId());
        
        if (trackPointDtoOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Track point not found or not owned by user");
        }
        
        return ResponseEntity.ok(trackPointDtoOptional.get());
    }

    /**
     * Get an exercise track point by ID
     * @param trackPointId the ID of the track point to retrieve
     * @param user the authenticated user
     * @return the track point
     */
    @GetMapping("/{trackPointId}")
    public ResponseEntity<?> getExerciseTrackPointById(@PathVariable UUID trackPointId, @AuthenticationPrincipal User user) {
        Optional<GetExerciseTrackPointDto> trackPointDtoOptional = exerciseTrackPointService.getExerciseTrackPointById(trackPointId, user.getId());
        
        if (trackPointDtoOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Track point not found or not owned by user");
        }
        
        return ResponseEntity.ok(trackPointDtoOptional.get());
    }

    /**
     * Get all track points for an exercise
     * @param exerciseId the ID of the exercise
     * @param user the authenticated user
     * @return list of track points
     */
    @GetMapping("/exercise/{exerciseId}")
    public ResponseEntity<List<GetExerciseTrackPointDto>> getTrackPointsForExercise(@PathVariable UUID exerciseId, @AuthenticationPrincipal User user) {
        List<GetExerciseTrackPointDto> trackPoints = exerciseTrackPointService.getTrackPointsForExercise(exerciseId, user.getId());
        return ResponseEntity.ok(trackPoints);
    }

    /**
     * Get track points for multiple exercises
     * @param exerciseIds the IDs of the exercises
     * @param user the authenticated user
     * @return list of track points
     */
    @PostMapping("/exercises")
    public ResponseEntity<List<GetExerciseTrackPointDto>> getTrackPointsForExercises(@RequestBody List<UUID> exerciseIds, @AuthenticationPrincipal User user) {
        List<GetExerciseTrackPointDto> trackPoints = exerciseTrackPointService.getTrackPointsForExercises(exerciseIds, user.getId());
        return ResponseEntity.ok(trackPoints);
    }

    /**
     * Get track points for an exercise between two dates
     * @param exerciseId the ID of the exercise
     * @param startDate the start date (inclusive)
     * @param endDate the end date (inclusive)
     * @param user the authenticated user
     * @return list of track points
     */
    @GetMapping("/exercise/{exerciseId}/date-range")
    public ResponseEntity<List<GetExerciseTrackPointDto>> getTrackPointsForExerciseBetweenDates(
            @PathVariable UUID exerciseId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @AuthenticationPrincipal User user) {
        
        List<GetExerciseTrackPointDto> trackPoints = exerciseTrackPointService.getTrackPointsForExerciseBetweenDates(exerciseId, startDate, endDate, user.getId());
        return ResponseEntity.ok(trackPoints);
    }

    /**
     * Delete an exercise track point
     * @param trackPointId the ID of the track point to delete
     * @param user the authenticated user
     * @return success or error message
     */
    @DeleteMapping("/{trackPointId}")
    public ResponseEntity<String> deleteExerciseTrackPoint(@PathVariable UUID trackPointId, @AuthenticationPrincipal User user) {
        boolean deleted = exerciseTrackPointService.deleteExerciseTrackPoint(trackPointId, user.getId());
        
        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Track point not found or not owned by user");
        }
        
        return ResponseEntity.ok("Track point deleted successfully");
    }
}