package com.tamaliftics.api.rest.services;

import com.tamaliftics.api.rest.models.ExerciseCategory;
import com.tamaliftics.api.rest.models.User;
import com.tamaliftics.api.rest.models.dtos.exercise.CreateExerciseCategoryDto;
import com.tamaliftics.api.rest.models.dtos.exercise.GetExerciseCategoryDto;
import com.tamaliftics.api.rest.models.dtos.exercise.UpdateExerciseCategoryDto;
import com.tamaliftics.api.rest.repositories.ExerciseCategoryRepository;
import com.tamaliftics.api.rest.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service for handling exercise category-related operations.
 */
@Service
public class ExerciseCategoryService {

    private final ExerciseCategoryRepository exerciseCategoryRepository;
    private final UserRepository userRepository;

    @Autowired
    public ExerciseCategoryService(ExerciseCategoryRepository exerciseCategoryRepository, UserRepository userRepository) {
        this.exerciseCategoryRepository = exerciseCategoryRepository;
        this.userRepository = userRepository;
    }

    /**
     * Create a new exercise category for a user.
     * @param createExerciseCategoryDto the DTO containing exercise category information
     * @param userId the ID of the user creating the exercise category
     * @return the created exercise category as a DTO, or empty if the user doesn't exist
     */
    public Optional<GetExerciseCategoryDto> createExerciseCategory(CreateExerciseCategoryDto createExerciseCategoryDto, UUID userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return Optional.empty();
        }

        User user = userOptional.get();
        ExerciseCategory exerciseCategory = new ExerciseCategory(
                createExerciseCategoryDto.name(),
                createExerciseCategoryDto.description(),
                user
        );

        ExerciseCategory savedExerciseCategory = exerciseCategoryRepository.save(exerciseCategory);
        return Optional.of(mapToGetExerciseCategoryDto(savedExerciseCategory));
    }

    /**
     * Update an existing exercise category.
     * @param updateExerciseCategoryDto the DTO containing updated exercise category information
     * @param userId the ID of the user updating the exercise category
     * @return the updated exercise category as a DTO, or empty if the category doesn't exist or doesn't belong to the user
     */
    public Optional<GetExerciseCategoryDto> updateExerciseCategory(UpdateExerciseCategoryDto updateExerciseCategoryDto, UUID userId) {
        Optional<ExerciseCategory> exerciseCategoryOptional = exerciseCategoryRepository.findById(updateExerciseCategoryDto.id());
        if (exerciseCategoryOptional.isEmpty() || !exerciseCategoryOptional.get().getUser().getId().equals(userId)) {
            return Optional.empty();
        }

        ExerciseCategory exerciseCategory = exerciseCategoryOptional.get();
        if (updateExerciseCategoryDto.name() != null) {
            exerciseCategory.setName(updateExerciseCategoryDto.name());
        }
        if (updateExerciseCategoryDto.description() != null) {
            exerciseCategory.setDescription(updateExerciseCategoryDto.description());
        }

        ExerciseCategory updatedExerciseCategory = exerciseCategoryRepository.save(exerciseCategory);
        return Optional.of(mapToGetExerciseCategoryDto(updatedExerciseCategory));
    }

    /**
     * Get an exercise category by ID.
     * @param exerciseCategoryId the ID of the exercise category to retrieve
     * @param userId the ID of the user requesting the category
     * @return the exercise category as a DTO, or empty if the category doesn't exist or doesn't belong to the user
     */
    public Optional<GetExerciseCategoryDto> getExerciseCategoryById(UUID exerciseCategoryId, UUID userId) {
        Optional<ExerciseCategory> exerciseCategoryOptional = exerciseCategoryRepository.findById(exerciseCategoryId);
        if (exerciseCategoryOptional.isEmpty() || !exerciseCategoryOptional.get().getUser().getId().equals(userId)) {
            return Optional.empty();
        }

        return Optional.of(mapToGetExerciseCategoryDto(exerciseCategoryOptional.get()));
    }

    /**
     * Get all exercise categories for a user.
     * @param userId the ID of the user
     * @return a list of exercise categories as DTOs
     */
    public List<GetExerciseCategoryDto> getAllExerciseCategoriesForUser(UUID userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return List.of();
        }

        return exerciseCategoryRepository.findByUser(userOptional.get()).stream()
                .map(this::mapToGetExerciseCategoryDto)
                .collect(Collectors.toList());
    }

    /**
     * Delete an exercise category.
     * @param exerciseCategoryId the ID of the exercise category to delete
     * @param userId the ID of the user deleting the category
     * @return true if the category was deleted, false if the category doesn't exist or doesn't belong to the user
     */
    public boolean deleteExerciseCategory(UUID exerciseCategoryId, UUID userId) {
        Optional<ExerciseCategory> exerciseCategoryOptional = exerciseCategoryRepository.findById(exerciseCategoryId);
        if (exerciseCategoryOptional.isEmpty() || !exerciseCategoryOptional.get().getUser().getId().equals(userId)) {
            return false;
        }

        exerciseCategoryRepository.delete(exerciseCategoryOptional.get());
        return true;
    }

    /**
     * Search for exercise categories by name for a user.
     * @param name the name to search for
     * @param userId the ID of the user
     * @return a list of exercise categories as DTOs
     */
    public List<GetExerciseCategoryDto> searchExerciseCategoriesByName(String name, UUID userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return List.of();
        }

        return exerciseCategoryRepository.findByNameContainingIgnoreCaseAndUser(name, userOptional.get()).stream()
                .map(this::mapToGetExerciseCategoryDto)
                .collect(Collectors.toList());
    }

    /**
     * Map an ExerciseCategory entity to a GetExerciseCategoryDto.
     * @param exerciseCategory the exercise category entity
     * @return the exercise category DTO
     */
    private GetExerciseCategoryDto mapToGetExerciseCategoryDto(ExerciseCategory exerciseCategory) {
        return new GetExerciseCategoryDto(
                exerciseCategory.getId(),
                exerciseCategory.getName(),
                exerciseCategory.getDescription(),
                exerciseCategory.getUser().getId()
        );
    }
}