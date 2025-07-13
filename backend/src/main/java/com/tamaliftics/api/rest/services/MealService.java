package com.tamaliftics.api.rest.services;

import com.tamaliftics.api.rest.models.Dish;
import com.tamaliftics.api.rest.models.Meal;
import com.tamaliftics.api.rest.models.User;
import com.tamaliftics.api.rest.models.dtos.dish.GetDishDto;
import com.tamaliftics.api.rest.models.dtos.meal.CreateMealDto;
import com.tamaliftics.api.rest.models.dtos.meal.GetMealDto;
import com.tamaliftics.api.rest.models.dtos.meal.UpdateMealDto;
import com.tamaliftics.api.rest.repositories.DishRepository;
import com.tamaliftics.api.rest.repositories.MealRepository;
import com.tamaliftics.api.rest.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service for handling meal-related operations.
 */
@Service
public class MealService {

    private final MealRepository mealRepository;
    private final DishRepository dishRepository;
    private final UserRepository userRepository;
    private final DishService dishService;

    @Autowired
    public MealService(MealRepository mealRepository, DishRepository dishRepository, 
                      UserRepository userRepository, DishService dishService) {
        this.mealRepository = mealRepository;
        this.dishRepository = dishRepository;
        this.userRepository = userRepository;
        this.dishService = dishService;
    }

    /**
     * Create a new meal for a user.
     * @param createMealDto the DTO containing meal information
     * @param userId the ID of the user creating the meal
     * @return the created meal as a DTO, or empty if the user doesn't exist
     */
    public Optional<GetMealDto> createMeal(CreateMealDto createMealDto, UUID userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return Optional.empty();
        }

        User user = userOptional.get();
        Meal meal = new Meal(createMealDto.type(), user);

        // Add dishes to the meal if dish IDs are provided
        if (createMealDto.dishIds() != null && !createMealDto.dishIds().isEmpty()) {
            List<Dish> dishes = dishRepository.findAllById(createMealDto.dishIds()).stream()
                    .filter(dish -> dish.getUser().getId().equals(userId))
                    .collect(Collectors.toList());
            meal.setDishes(dishes);
        }

        Meal savedMeal = mealRepository.save(meal);
        return Optional.of(mapToGetMealDto(savedMeal));
    }

    /**
     * Update an existing meal.
     * @param updateMealDto the DTO containing updated meal information
     * @param userId the ID of the user updating the meal
     * @return the updated meal as a DTO, or empty if the meal doesn't exist or doesn't belong to the user
     */
    public Optional<GetMealDto> updateMeal(UpdateMealDto updateMealDto, UUID userId) {
        Optional<Meal> mealOptional = mealRepository.findById(updateMealDto.id());
        if (mealOptional.isEmpty() || !mealOptional.get().getUser().getId().equals(userId)) {
            return Optional.empty();
        }

        Meal meal = mealOptional.get();
        if (updateMealDto.type() != null) {
            meal.setType(updateMealDto.type());
        }

        // Update dishes if dish IDs are provided
        if (updateMealDto.dishIds() != null) {
            List<Dish> dishes = dishRepository.findAllById(updateMealDto.dishIds()).stream()
                    .filter(dish -> dish.getUser().getId().equals(userId))
                    .collect(Collectors.toList());
            meal.setDishes(dishes);
        }

        Meal updatedMeal = mealRepository.save(meal);
        return Optional.of(mapToGetMealDto(updatedMeal));
    }

    /**
     * Get a meal by ID.
     * @param mealId the ID of the meal to retrieve
     * @param userId the ID of the user requesting the meal
     * @return the meal as a DTO, or empty if the meal doesn't exist or doesn't belong to the user
     */
    public Optional<GetMealDto> getMealById(UUID mealId, UUID userId) {
        Optional<Meal> mealOptional = mealRepository.findById(mealId);
        if (mealOptional.isEmpty() || !mealOptional.get().getUser().getId().equals(userId)) {
            return Optional.empty();
        }

        return Optional.of(mapToGetMealDto(mealOptional.get()));
    }

    /**
     * Get all meals for a user.
     * @param userId the ID of the user
     * @return a list of meals as DTOs
     */
    public List<GetMealDto> getAllMealsForUser(UUID userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return List.of();
        }

        return mealRepository.findByUser(userOptional.get()).stream()
                .map(this::mapToGetMealDto)
                .collect(Collectors.toList());
    }

    /**
     * Delete a meal.
     * @param mealId the ID of the meal to delete
     * @param userId the ID of the user deleting the meal
     * @return true if the meal was deleted, false if the meal doesn't exist or doesn't belong to the user
     */
    public boolean deleteMeal(UUID mealId, UUID userId) {
        Optional<Meal> mealOptional = mealRepository.findById(mealId);
        if (mealOptional.isEmpty() || !mealOptional.get().getUser().getId().equals(userId)) {
            return false;
        }

        mealRepository.delete(mealOptional.get());
        return true;
    }

    /**
     * Add a dish to a meal.
     * @param mealId the ID of the meal
     * @param dishId the ID of the dish to add
     * @param userId the ID of the user
     * @return the updated meal as a DTO, or empty if the meal or dish doesn't exist or doesn't belong to the user
     */
    public Optional<GetMealDto> addDishToMeal(UUID mealId, UUID dishId, UUID userId) {
        Optional<Meal> mealOptional = mealRepository.findById(mealId);
        Optional<Dish> dishOptional = dishRepository.findById(dishId);

        if (mealOptional.isEmpty() || dishOptional.isEmpty() || 
            !mealOptional.get().getUser().getId().equals(userId) || 
            !dishOptional.get().getUser().getId().equals(userId)) {
            return Optional.empty();
        }

        Meal meal = mealOptional.get();
        Dish dish = dishOptional.get();
        meal.addDish(dish);

        Meal updatedMeal = mealRepository.save(meal);
        return Optional.of(mapToGetMealDto(updatedMeal));
    }

    /**
     * Remove a dish from a meal.
     * @param mealId the ID of the meal
     * @param dishId the ID of the dish to remove
     * @param userId the ID of the user
     * @return the updated meal as a DTO, or empty if the meal doesn't exist or doesn't belong to the user
     */
    public Optional<GetMealDto> removeDishFromMeal(UUID mealId, UUID dishId, UUID userId) {
        Optional<Meal> mealOptional = mealRepository.findById(mealId);
        if (mealOptional.isEmpty() || !mealOptional.get().getUser().getId().equals(userId)) {
            return Optional.empty();
        }

        Meal meal = mealOptional.get();
        meal.getDishes().removeIf(dish -> dish.getId().equals(dishId));

        Meal updatedMeal = mealRepository.save(meal);
        return Optional.of(mapToGetMealDto(updatedMeal));
    }

    /**
     * Map a Meal entity to a GetMealDto.
     * @param meal the meal entity
     * @return the meal DTO
     */
    private GetMealDto mapToGetMealDto(Meal meal) {
        List<GetDishDto> dishDtos = meal.getDishes().stream()
                .map(dish -> new GetDishDto(
                        dish.getId(),
                        dish.getName(),
                        dish.getDescription(),
                        dish.getCalories(),
                        dish.getCarbs(),
                        dish.getFat(),
                        dish.getProtein(),
                        dish.getUser().getId()
                ))
                .collect(Collectors.toList());

        return new GetMealDto(
                meal.getId(),
                meal.getType(),
                dishDtos,
                meal.getTotalCalories(),
                meal.getTotalCarbs(),
                meal.getTotalFat(),
                meal.getTotalProtein(),
                meal.getUser().getId()
        );
    }
}