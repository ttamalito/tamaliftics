package com.tamaliftics.api.rest.services;

import com.tamaliftics.api.rest.models.Exercise;
import com.tamaliftics.api.rest.models.ExerciseTrackPoint;
import com.tamaliftics.api.rest.models.User;
import com.tamaliftics.api.rest.models.dtos.trackpoint.CreateExerciseTrackPointDto;
import com.tamaliftics.api.rest.models.dtos.trackpoint.GetExerciseTrackPointDto;
import com.tamaliftics.api.rest.models.dtos.trackpoint.UpdateExerciseTrackPointDto;
import com.tamaliftics.api.rest.repositories.ExerciseRepository;
import com.tamaliftics.api.rest.repositories.ExerciseTrackPointRepository;
import com.tamaliftics.api.rest.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service for handling exercise track point-related operations.
 */
@Service
public class ExerciseTrackPointService {

    private final ExerciseTrackPointRepository exerciseTrackPointRepository;
    private final ExerciseRepository exerciseRepository;
    private final UserRepository userRepository;

    @Autowired
    public ExerciseTrackPointService(ExerciseTrackPointRepository exerciseTrackPointRepository,
                                    ExerciseRepository exerciseRepository,
                                    UserRepository userRepository) {
        this.exerciseTrackPointRepository = exerciseTrackPointRepository;
        this.exerciseRepository = exerciseRepository;
        this.userRepository = userRepository;
    }

    /**
     * Create a new exercise track point.
     * @param createExerciseTrackPointDto the DTO containing track point information
     * @param userId the ID of the user creating the track point
     * @return the created track point as a DTO, or empty if the user or exercise doesn't exist
     */
    public Optional<GetExerciseTrackPointDto> createExerciseTrackPoint(CreateExerciseTrackPointDto createExerciseTrackPointDto, UUID userId) {
        Optional<Exercise> exerciseOptional = exerciseRepository.findById(createExerciseTrackPointDto.exerciseId());
        if (exerciseOptional.isEmpty() || !exerciseOptional.get().getUser().getId().equals(userId)) {
            return Optional.empty();
        }

        Exercise exercise = exerciseOptional.get();
        ExerciseTrackPoint trackPoint = new ExerciseTrackPoint(
                createExerciseTrackPointDto.date(),
                createExerciseTrackPointDto.repsCount(),
                createExerciseTrackPointDto.setsCount(),
                createExerciseTrackPointDto.description(),
                exercise
        );

        ExerciseTrackPoint savedTrackPoint = exerciseTrackPointRepository.save(trackPoint);
        return Optional.of(mapToGetExerciseTrackPointDto(savedTrackPoint));
    }

    /**
     * Update an existing exercise track point.
     * @param updateExerciseTrackPointDto the DTO containing updated track point information
     * @param userId the ID of the user updating the track point
     * @return the updated track point as a DTO, or empty if the track point doesn't exist or doesn't belong to the user
     */
    public Optional<GetExerciseTrackPointDto> updateExerciseTrackPoint(UpdateExerciseTrackPointDto updateExerciseTrackPointDto, UUID userId) {
        Optional<ExerciseTrackPoint> trackPointOptional = exerciseTrackPointRepository.findById(updateExerciseTrackPointDto.id());
        if (trackPointOptional.isEmpty() || !trackPointOptional.get().getExercise().getUser().getId().equals(userId)) {
            return Optional.empty();
        }

        ExerciseTrackPoint trackPoint = trackPointOptional.get();
        if (updateExerciseTrackPointDto.date() != null) {
            trackPoint.setDate(updateExerciseTrackPointDto.date());
        }
        if (updateExerciseTrackPointDto.repsCount() != null) {
            trackPoint.setRepsCount(updateExerciseTrackPointDto.repsCount());
        }
        if (updateExerciseTrackPointDto.setsCount() != null) {
            trackPoint.setSetsCount(updateExerciseTrackPointDto.setsCount());
        }
        if (updateExerciseTrackPointDto.description() != null) {
            trackPoint.setDescription(updateExerciseTrackPointDto.description());
        }
        
        // Update exercise if provided
        if (updateExerciseTrackPointDto.exerciseId() != null) {
            Optional<Exercise> exerciseOptional = exerciseRepository.findById(updateExerciseTrackPointDto.exerciseId());
            if (exerciseOptional.isPresent() && exerciseOptional.get().getUser().getId().equals(userId)) {
                trackPoint.setExercise(exerciseOptional.get());
            }
        }

        ExerciseTrackPoint updatedTrackPoint = exerciseTrackPointRepository.save(trackPoint);
        return Optional.of(mapToGetExerciseTrackPointDto(updatedTrackPoint));
    }

    /**
     * Get an exercise track point by ID.
     * @param trackPointId the ID of the track point to retrieve
     * @param userId the ID of the user requesting the track point
     * @return the track point as a DTO, or empty if the track point doesn't exist or doesn't belong to the user
     */
    public Optional<GetExerciseTrackPointDto> getExerciseTrackPointById(UUID trackPointId, UUID userId) {
        Optional<ExerciseTrackPoint> trackPointOptional = exerciseTrackPointRepository.findById(trackPointId);
        if (trackPointOptional.isEmpty() || !trackPointOptional.get().getExercise().getUser().getId().equals(userId)) {
            return Optional.empty();
        }

        return Optional.of(mapToGetExerciseTrackPointDto(trackPointOptional.get()));
    }

    /**
     * Get all track points for an exercise.
     * @param exerciseId the ID of the exercise
     * @param userId the ID of the user
     * @return a list of track points as DTOs
     */
    public List<GetExerciseTrackPointDto> getTrackPointsForExercise(UUID exerciseId, UUID userId) {
        Optional<Exercise> exerciseOptional = exerciseRepository.findById(exerciseId);
        if (exerciseOptional.isEmpty() || !exerciseOptional.get().getUser().getId().equals(userId)) {
            return List.of();
        }

        return exerciseTrackPointRepository.findByExercise(exerciseOptional.get()).stream()
                .map(this::mapToGetExerciseTrackPointDto)
                .collect(Collectors.toList());
    }

    /**
     * Get track points for multiple exercises.
     * @param exerciseIds the IDs of the exercises
     * @param userId the ID of the user
     * @return a list of track points as DTOs
     */
    public List<GetExerciseTrackPointDto> getTrackPointsForExercises(List<UUID> exerciseIds, UUID userId) {
        List<Exercise> exercises = exerciseRepository.findAllById(exerciseIds).stream()
                .filter(exercise -> exercise.getUser().getId().equals(userId))
                .collect(Collectors.toList());
        
        if (exercises.isEmpty()) {
            return List.of();
        }
        
        List<UUID> validExerciseIds = exercises.stream()
                .map(Exercise::getId)
                .collect(Collectors.toList());
        
        return exerciseTrackPointRepository.findByExerciseIdIn(validExerciseIds).stream()
                .map(this::mapToGetExerciseTrackPointDto)
                .collect(Collectors.toList());
    }

    /**
     * Get track points for an exercise between two dates.
     * @param exerciseId the ID of the exercise
     * @param startDate the start date (inclusive)
     * @param endDate the end date (inclusive)
     * @param userId the ID of the user
     * @return a list of track points as DTOs
     */
    public List<GetExerciseTrackPointDto> getTrackPointsForExerciseBetweenDates(UUID exerciseId, LocalDate startDate, LocalDate endDate, UUID userId) {
        Optional<Exercise> exerciseOptional = exerciseRepository.findById(exerciseId);
        if (exerciseOptional.isEmpty() || !exerciseOptional.get().getUser().getId().equals(userId)) {
            return List.of();
        }

        return exerciseTrackPointRepository.findByExerciseAndDateBetween(exerciseOptional.get(), startDate, endDate).stream()
                .map(this::mapToGetExerciseTrackPointDto)
                .collect(Collectors.toList());
    }

    /**
     * Delete an exercise track point.
     * @param trackPointId the ID of the track point to delete
     * @param userId the ID of the user deleting the track point
     * @return true if the track point was deleted, false if the track point doesn't exist or doesn't belong to the user
     */
    public boolean deleteExerciseTrackPoint(UUID trackPointId, UUID userId) {
        Optional<ExerciseTrackPoint> trackPointOptional = exerciseTrackPointRepository.findById(trackPointId);
        if (trackPointOptional.isEmpty() || !trackPointOptional.get().getExercise().getUser().getId().equals(userId)) {
            return false;
        }

        exerciseTrackPointRepository.delete(trackPointOptional.get());
        return true;
    }

    /**
     * Map an ExerciseTrackPoint entity to a GetExerciseTrackPointDto.
     * @param trackPoint the track point entity
     * @return the track point DTO
     */
    private GetExerciseTrackPointDto mapToGetExerciseTrackPointDto(ExerciseTrackPoint trackPoint) {
        return new GetExerciseTrackPointDto(
                trackPoint.getId(),
                trackPoint.getDate(),
                trackPoint.getRepsCount(),
                trackPoint.getSetsCount(),
                trackPoint.getDescription(),
                trackPoint.getExercise().getId()
        );
    }
}