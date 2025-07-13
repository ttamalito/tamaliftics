package com.tamaliftics.api.rest.controllers;

import com.tamaliftics.api.rest.models.User;
import com.tamaliftics.api.rest.models.dtos.meal.CreateMealDto;
import com.tamaliftics.api.rest.models.dtos.meal.GetMealDto;
import com.tamaliftics.api.rest.models.dtos.meal.UpdateMealDto;
import com.tamaliftics.api.rest.services.MealService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Controller for handling meal-related operations
 */
@RestController
@RequestMapping("/meals")
public class MealController {

    private final MealService mealService;

    @Autowired
    public MealController(MealService mealService) {
        this.mealService = mealService;
    }

    /**
     * Create a new meal
     * @param createMealDto the DTO containing meal information
     * @param user the authenticated user
     * @return the created meal
     */
    @PostMapping
    public ResponseEntity<?> createMeal(@RequestBody CreateMealDto createMealDto, @AuthenticationPrincipal User user) {
        Optional<GetMealDto> mealDtoOptional = mealService.createMeal(createMealDto, user.getId());
        
        if (mealDtoOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to create meal");
        }
        
        return ResponseEntity.status(HttpStatus.CREATED).body(mealDtoOptional.get());
    }

    /**
     * Update an existing meal
     * @param updateMealDto the DTO containing updated meal information
     * @param user the authenticated user
     * @return the updated meal
     */
    @PutMapping
    public ResponseEntity<?> updateMeal(@RequestBody UpdateMealDto updateMealDto, @AuthenticationPrincipal User user) {
        Optional<GetMealDto> mealDtoOptional = mealService.updateMeal(updateMealDto, user.getId());
        
        if (mealDtoOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Meal not found or not owned by user");
        }
        
        return ResponseEntity.ok(mealDtoOptional.get());
    }

    /**
     * Get a meal by ID
     * @param mealId the ID of the meal to retrieve
     * @param user the authenticated user
     * @return the meal
     */
    @GetMapping("/{mealId}")
    public ResponseEntity<?> getMealById(@PathVariable UUID mealId, @AuthenticationPrincipal User user) {
        Optional<GetMealDto> mealDtoOptional = mealService.getMealById(mealId, user.getId());
        
        if (mealDtoOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Meal not found or not owned by user");
        }
        
        return ResponseEntity.ok(mealDtoOptional.get());
    }

    /**
     * Get all meals for the authenticated user
     * @param user the authenticated user
     * @return list of meals
     */
    @GetMapping
    public ResponseEntity<List<GetMealDto>> getAllMeals(@AuthenticationPrincipal User user) {
        List<GetMealDto> meals = mealService.getAllMealsForUser(user.getId());
        return ResponseEntity.ok(meals);
    }

    /**
     * Delete a meal
     * @param mealId the ID of the meal to delete
     * @param user the authenticated user
     * @return success or error message
     */
    @DeleteMapping("/{mealId}")
    public ResponseEntity<String> deleteMeal(@PathVariable UUID mealId, @AuthenticationPrincipal User user) {
        boolean deleted = mealService.deleteMeal(mealId, user.getId());
        
        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Meal not found or not owned by user");
        }
        
        return ResponseEntity.ok("Meal deleted successfully");
    }

    /**
     * Add a dish to a meal
     * @param mealId the ID of the meal
     * @param dishId the ID of the dish to add
     * @param user the authenticated user
     * @return the updated meal
     */
    @PostMapping("/{mealId}/dishes/{dishId}")
    public ResponseEntity<?> addDishToMeal(
            @PathVariable UUID mealId,
            @PathVariable UUID dishId,
            @AuthenticationPrincipal User user) {
        
        Optional<GetMealDto> mealDtoOptional = mealService.addDishToMeal(mealId, dishId, user.getId());
        
        if (mealDtoOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Meal or dish not found, or not owned by user");
        }
        
        return ResponseEntity.ok(mealDtoOptional.get());
    }

    /**
     * Remove a dish from a meal
     * @param mealId the ID of the meal
     * @param dishId the ID of the dish to remove
     * @param user the authenticated user
     * @return the updated meal
     */
    @DeleteMapping("/{mealId}/dishes/{dishId}")
    public ResponseEntity<?> removeDishFromMeal(
            @PathVariable UUID mealId,
            @PathVariable UUID dishId,
            @AuthenticationPrincipal User user) {
        
        Optional<GetMealDto> mealDtoOptional = mealService.removeDishFromMeal(mealId, dishId, user.getId());
        
        if (mealDtoOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Meal not found or not owned by user");
        }
        
        return ResponseEntity.ok(mealDtoOptional.get());
    }
}