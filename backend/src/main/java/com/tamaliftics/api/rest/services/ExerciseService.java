package com.tamaliftics.api.rest.services;

import com.tamaliftics.api.rest.models.Exercise;
import com.tamaliftics.api.rest.models.ExerciseCategory;
import com.tamaliftics.api.rest.models.ExerciseTrackPoint;
import com.tamaliftics.api.rest.models.User;
import com.tamaliftics.api.rest.models.dtos.exercise.CreateExerciseDto;
import com.tamaliftics.api.rest.models.dtos.exercise.GetExerciseCategoryDto;
import com.tamaliftics.api.rest.models.dtos.exercise.GetExerciseDto;
import com.tamaliftics.api.rest.models.dtos.exercise.UpdateExerciseDto;
import com.tamaliftics.api.rest.models.dtos.trackpoint.GetExerciseTrackPointDto;
import com.tamaliftics.api.rest.repositories.ExerciseCategoryRepository;
import com.tamaliftics.api.rest.repositories.ExerciseRepository;
import com.tamaliftics.api.rest.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service for handling exercise-related operations.
 */
@Service
public class ExerciseService {

    private final ExerciseRepository exerciseRepository;
    private final ExerciseCategoryRepository exerciseCategoryRepository;
    private final UserRepository userRepository;
    private final ExerciseCategoryService exerciseCategoryService;

    @Autowired
    public ExerciseService(ExerciseRepository exerciseRepository,
                          ExerciseCategoryRepository exerciseCategoryRepository,
                          UserRepository userRepository,
                          ExerciseCategoryService exerciseCategoryService) {
        this.exerciseRepository = exerciseRepository;
        this.exerciseCategoryRepository = exerciseCategoryRepository;
        this.userRepository = userRepository;
        this.exerciseCategoryService = exerciseCategoryService;
    }

    /**
     * Create a new exercise for a user.
     * @param createExerciseDto the DTO containing exercise information
     * @param userId the ID of the user creating the exercise
     * @return the created exercise as a DTO, or empty if the user or category doesn't exist
     */
    public Optional<GetExerciseDto> createExercise(CreateExerciseDto createExerciseDto, UUID userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        Optional<ExerciseCategory> categoryOptional = exerciseCategoryRepository.findById(createExerciseDto.categoryId());

        if (userOptional.isEmpty() || categoryOptional.isEmpty() || !categoryOptional.get().getUser().getId().equals(userId)) {
            return Optional.empty();
        }

        User user = userOptional.get();
        ExerciseCategory category = categoryOptional.get();

        Exercise exercise = new Exercise(
                createExerciseDto.name(),
                createExerciseDto.description(),
                category,
                user
        );

        Exercise savedExercise = exerciseRepository.save(exercise);
        return Optional.of(mapToGetExerciseDto(savedExercise));
    }

    /**
     * Update an existing exercise.
     * @param updateExerciseDto the DTO containing updated exercise information
     * @param userId the ID of the user updating the exercise
     * @return the updated exercise as a DTO, or empty if the exercise doesn't exist or doesn't belong to the user
     */
    public Optional<GetExerciseDto> updateExercise(UpdateExerciseDto updateExerciseDto, UUID userId) {
        Optional<Exercise> exerciseOptional = exerciseRepository.findById(updateExerciseDto.id());
        if (exerciseOptional.isEmpty() || !exerciseOptional.get().getUser().getId().equals(userId)) {
            return Optional.empty();
        }

        Exercise exercise = exerciseOptional.get();
        if (updateExerciseDto.name() != null) {
            exercise.setName(updateExerciseDto.name());
        }
        if (updateExerciseDto.description() != null) {
            exercise.setDescription(updateExerciseDto.description());
        }

        // Update category if provided
        if (updateExerciseDto.categoryId() != null) {
            Optional<ExerciseCategory> categoryOptional = exerciseCategoryRepository.findById(updateExerciseDto.categoryId());
            if (categoryOptional.isPresent() && categoryOptional.get().getUser().getId().equals(userId)) {
                exercise.setCategory(categoryOptional.get());
            }
        }

        Exercise updatedExercise = exerciseRepository.save(exercise);
        return Optional.of(mapToGetExerciseDto(updatedExercise));
    }

    /**
     * Get an exercise by ID.
     * @param exerciseId the ID of the exercise to retrieve
     * @param userId the ID of the user requesting the exercise
     * @return the exercise as a DTO, or empty if the exercise doesn't exist or doesn't belong to the user
     */
    public Optional<GetExerciseDto> getExerciseById(UUID exerciseId, UUID userId) {
        Optional<Exercise> exerciseOptional = exerciseRepository.findById(exerciseId);
        if (exerciseOptional.isEmpty() || !exerciseOptional.get().getUser().getId().equals(userId)) {
            return Optional.empty();
        }

        return Optional.of(mapToGetExerciseDto(exerciseOptional.get()));
    }

    /**
     * Get all exercises for a user.
     * @param userId the ID of the user
     * @return a list of exercises as DTOs
     */
    public List<GetExerciseDto> getAllExercisesForUser(UUID userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return List.of();
        }

        return exerciseRepository.findByUser(userOptional.get()).stream()
                .map(this::mapToGetExerciseDto)
                .collect(Collectors.toList());
    }

    /**
     * Get all exercises for a category.
     * @param categoryId the ID of the category
     * @param userId the ID of the user
     * @return a list of exercises as DTOs
     */
    public List<GetExerciseDto> getExercisesByCategory(UUID categoryId, UUID userId) {
        Optional<ExerciseCategory> categoryOptional = exerciseCategoryRepository.findById(categoryId);
        if (categoryOptional.isEmpty() || !categoryOptional.get().getUser().getId().equals(userId)) {
            return List.of();
        }

        return exerciseRepository.findByCategoryAndUser(categoryOptional.get(), categoryOptional.get().getUser()).stream()
                .map(this::mapToGetExerciseDto)
                .collect(Collectors.toList());
    }

    /**
     * Delete an exercise.
     * @param exerciseId the ID of the exercise to delete
     * @param userId the ID of the user deleting the exercise
     * @return true if the exercise was deleted, false if the exercise doesn't exist or doesn't belong to the user
     */
    public boolean deleteExercise(UUID exerciseId, UUID userId) {
        Optional<Exercise> exerciseOptional = exerciseRepository.findById(exerciseId);
        if (exerciseOptional.isEmpty() || !exerciseOptional.get().getUser().getId().equals(userId)) {
            return false;
        }

        exerciseRepository.delete(exerciseOptional.get());
        return true;
    }

    /**
     * Search for exercises by name for a user.
     * @param name the name to search for
     * @param userId the ID of the user
     * @return a list of exercises as DTOs
     */
    public List<GetExerciseDto> searchExercisesByName(String name, UUID userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return List.of();
        }

        return exerciseRepository.findByNameContainingIgnoreCaseAndUser(name, userOptional.get()).stream()
                .map(this::mapToGetExerciseDto)
                .collect(Collectors.toList());
    }

    /**
     * Map an Exercise entity to a GetExerciseDto.
     * @param exercise the exercise entity
     * @return the exercise DTO
     */
    private GetExerciseDto mapToGetExerciseDto(Exercise exercise) {
        GetExerciseCategoryDto categoryDto = exerciseCategoryService.getExerciseCategoryById(
                exercise.getCategory().getId(), exercise.getUser().getId()).orElse(null);

        List<GetExerciseTrackPointDto> trackPointDtos = exercise.getTrackPoints().stream()
                .map(this::mapToGetExerciseTrackPointDto)
                .collect(Collectors.toList());

        return new GetExerciseDto(
                exercise.getId(),
                exercise.getName(),
                exercise.getDescription(),
                categoryDto,
                trackPointDtos,
                exercise.getUser().getId()
        );
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
                trackPoint.getWeight(),
                trackPoint.getExercise().getId()
        );
    }
}
