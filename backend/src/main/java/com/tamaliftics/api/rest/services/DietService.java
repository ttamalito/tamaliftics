package com.tamaliftics.api.rest.services;

import com.tamaliftics.api.rest.models.Diet;
import com.tamaliftics.api.rest.models.Meal;
import com.tamaliftics.api.rest.models.User;
import com.tamaliftics.api.rest.models.dtos.diet.CreateDietDto;
import com.tamaliftics.api.rest.models.dtos.diet.GetDietDto;
import com.tamaliftics.api.rest.models.dtos.diet.UpdateDietDto;
import com.tamaliftics.api.rest.models.dtos.meal.GetMealDto;
import com.tamaliftics.api.rest.repositories.DietRepository;
import com.tamaliftics.api.rest.repositories.MealRepository;
import com.tamaliftics.api.rest.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service for handling diet-related operations.
 */
@Service
public class DietService {

    private final DietRepository dietRepository;
    private final MealRepository mealRepository;
    private final UserRepository userRepository;
    private final MealService mealService;

    @Autowired
    public DietService(DietRepository dietRepository, MealRepository mealRepository,
                      UserRepository userRepository, MealService mealService) {
        this.dietRepository = dietRepository;
        this.mealRepository = mealRepository;
        this.userRepository = userRepository;
        this.mealService = mealService;
    }

    /**
     * Create a new diet for a user.
     * @param createDietDto the DTO containing diet information
     * @param userId the ID of the user creating the diet
     * @return the created diet as a DTO, or empty if the user doesn't exist
     */
    public Optional<GetDietDto> createDiet(CreateDietDto createDietDto, UUID userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return Optional.empty();
        }

        User user = userOptional.get();
        Diet diet = new Diet(createDietDto.name(), createDietDto.description(), user);

        // Add meals to the diet if meal IDs are provided
        if (createDietDto.mealIds() != null && !createDietDto.mealIds().isEmpty()) {
            List<Meal> meals = mealRepository.findAllById(createDietDto.mealIds()).stream()
                    .filter(meal -> meal.getUser().getId().equals(userId))
                    .collect(Collectors.toList());
            diet.setMeals(meals);
        }

        Diet savedDiet = dietRepository.save(diet);
        return Optional.of(mapToGetDietDto(savedDiet));
    }

    /**
     * Update an existing diet.
     * @param updateDietDto the DTO containing updated diet information
     * @param userId the ID of the user updating the diet
     * @return the updated diet as a DTO, or empty if the diet doesn't exist or doesn't belong to the user
     */
    public Optional<GetDietDto> updateDiet(UpdateDietDto updateDietDto, UUID userId) {
        Optional<Diet> dietOptional = dietRepository.findById(updateDietDto.id());
        if (dietOptional.isEmpty() || !dietOptional.get().getUser().getId().equals(userId)) {
            return Optional.empty();
        }

        Diet diet = dietOptional.get();
        if (updateDietDto.name() != null) {
            diet.setName(updateDietDto.name());
        }
        if (updateDietDto.description() != null) {
            diet.setDescription(updateDietDto.description());
        }

        // Update meals if meal IDs are provided
        if (updateDietDto.mealIds() != null) {
            List<Meal> meals = mealRepository.findAllById(updateDietDto.mealIds()).stream()
                    .filter(meal -> meal.getUser().getId().equals(userId))
                    .collect(Collectors.toList());
            diet.setMeals(meals);
        }

        Diet updatedDiet = dietRepository.save(diet);
        return Optional.of(mapToGetDietDto(updatedDiet));
    }

    /**
     * Get a diet by ID.
     * @param dietId the ID of the diet to retrieve
     * @param userId the ID of the user requesting the diet
     * @return the diet as a DTO, or empty if the diet doesn't exist or doesn't belong to the user
     */
    public Optional<GetDietDto> getDietById(UUID dietId, UUID userId) {
        Optional<Diet> dietOptional = dietRepository.findById(dietId);
        if (dietOptional.isEmpty() || !dietOptional.get().getUser().getId().equals(userId)) {
            return Optional.empty();
        }

        return Optional.of(mapToGetDietDto(dietOptional.get()));
    }

    /**
     * Get all diets for a user.
     * @param userId the ID of the user
     * @return a list of diets as DTOs
     */
    public List<GetDietDto> getAllDietsForUser(UUID userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return List.of();
        }

        return dietRepository.findByUser(userOptional.get()).stream()
                .map(this::mapToGetDietDto)
                .collect(Collectors.toList());
    }

    /**
     * Delete a diet.
     * @param dietId the ID of the diet to delete
     * @param userId the ID of the user deleting the diet
     * @return true if the diet was deleted, false if the diet doesn't exist or doesn't belong to the user
     */
    public boolean deleteDiet(UUID dietId, UUID userId) {
        Optional<Diet> dietOptional = dietRepository.findById(dietId);
        if (dietOptional.isEmpty() || !dietOptional.get().getUser().getId().equals(userId)) {
            return false;
        }

        dietRepository.delete(dietOptional.get());
        return true;
    }

    /**
     * Add a meal to a diet.
     * @param dietId the ID of the diet
     * @param mealId the ID of the meal to add
     * @param userId the ID of the user
     * @return the updated diet as a DTO, or empty if the diet or meal doesn't exist or doesn't belong to the user
     */
    public Optional<GetDietDto> addMealToDiet(UUID dietId, UUID mealId, UUID userId) {
        Optional<Diet> dietOptional = dietRepository.findById(dietId);
        Optional<Meal> mealOptional = mealRepository.findById(mealId);

        if (dietOptional.isEmpty() || mealOptional.isEmpty() || 
            !dietOptional.get().getUser().getId().equals(userId) || 
            !mealOptional.get().getUser().getId().equals(userId)) {
            return Optional.empty();
        }

        Diet diet = dietOptional.get();
        Meal meal = mealOptional.get();
        diet.addMeal(meal);

        Diet updatedDiet = dietRepository.save(diet);
        return Optional.of(mapToGetDietDto(updatedDiet));
    }

    /**
     * Remove a meal from a diet.
     * @param dietId the ID of the diet
     * @param mealId the ID of the meal to remove
     * @param userId the ID of the user
     * @return the updated diet as a DTO, or empty if the diet doesn't exist or doesn't belong to the user
     */
    public Optional<GetDietDto> removeMealFromDiet(UUID dietId, UUID mealId, UUID userId) {
        Optional<Diet> dietOptional = dietRepository.findById(dietId);
        if (dietOptional.isEmpty() || !dietOptional.get().getUser().getId().equals(userId)) {
            return Optional.empty();
        }

        Diet diet = dietOptional.get();
        diet.getMeals().removeIf(meal -> meal.getId().equals(mealId));

        Diet updatedDiet = dietRepository.save(diet);
        return Optional.of(mapToGetDietDto(updatedDiet));
    }

    /**
     * Search for diets by name for a user.
     * @param name the name to search for
     * @param userId the ID of the user
     * @return a list of diets as DTOs
     */
    public List<GetDietDto> searchDietsByName(String name, UUID userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return List.of();
        }

        return dietRepository.findByNameContainingIgnoreCaseAndUser(name, userOptional.get()).stream()
                .map(this::mapToGetDietDto)
                .collect(Collectors.toList());
    }

    /**
     * Map a Diet entity to a GetDietDto.
     * @param diet the diet entity
     * @return the diet DTO
     */
    private GetDietDto mapToGetDietDto(Diet diet) {
        List<GetMealDto> mealDtos = diet.getMeals().stream()
                .map(meal -> {
                    Optional<GetMealDto> mealDto = mealService.getMealById(meal.getId(), diet.getUser().getId());
                    return mealDto.orElse(null);
                })
                .filter(mealDto -> mealDto != null)
                .collect(Collectors.toList());

        return new GetDietDto(
                diet.getId(),
                diet.getName(),
                diet.getDescription(),
                mealDtos,
                diet.getTotalCalories(),
                diet.getTotalCarbs(),
                diet.getTotalFat(),
                diet.getTotalProtein(),
                diet.getUser().getId()
        );
    }
}