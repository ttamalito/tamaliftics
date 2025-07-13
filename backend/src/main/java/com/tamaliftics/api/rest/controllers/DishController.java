package com.tamaliftics.api.rest.controllers;

import com.tamaliftics.api.rest.models.User;
import com.tamaliftics.api.rest.models.dtos.dish.CreateDishDto;
import com.tamaliftics.api.rest.models.dtos.dish.GetDishDto;
import com.tamaliftics.api.rest.models.dtos.dish.UpdateDishDto;
import com.tamaliftics.api.rest.services.DishService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Controller for handling dish-related operations
 */
@RestController
@RequestMapping("/dishes")
public class DishController {

    private final DishService dishService;

    @Autowired
    public DishController(DishService dishService) {
        this.dishService = dishService;
    }

    /**
     * Create a new dish
     * @param createDishDto the DTO containing dish information
     * @param user the authenticated user
     * @return the created dish
     */
    @PostMapping
    public ResponseEntity<?> createDish(@RequestBody CreateDishDto createDishDto, @AuthenticationPrincipal User user) {
        Optional<GetDishDto> dishDtoOptional = dishService.createDish(createDishDto, user.getId());
        
        if (dishDtoOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to create dish");
        }
        
        return ResponseEntity.status(HttpStatus.CREATED).body(dishDtoOptional.get());
    }

    /**
     * Update an existing dish
     * @param updateDishDto the DTO containing updated dish information
     * @param user the authenticated user
     * @return the updated dish
     */
    @PutMapping
    public ResponseEntity<?> updateDish(@RequestBody UpdateDishDto updateDishDto, @AuthenticationPrincipal User user) {
        Optional<GetDishDto> dishDtoOptional = dishService.updateDish(updateDishDto, user.getId());
        
        if (dishDtoOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Dish not found or not owned by user");
        }
        
        return ResponseEntity.ok(dishDtoOptional.get());
    }

    /**
     * Get a dish by ID
     * @param dishId the ID of the dish to retrieve
     * @param user the authenticated user
     * @return the dish
     */
    @GetMapping("/{dishId}")
    public ResponseEntity<?> getDishById(@PathVariable UUID dishId, @AuthenticationPrincipal User user) {
        Optional<GetDishDto> dishDtoOptional = dishService.getDishById(dishId, user.getId());
        
        if (dishDtoOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Dish not found or not owned by user");
        }
        
        return ResponseEntity.ok(dishDtoOptional.get());
    }

    /**
     * Get all dishes for the authenticated user
     * @param user the authenticated user
     * @return list of dishes
     */
    @GetMapping
    public ResponseEntity<List<GetDishDto>> getAllDishes(@AuthenticationPrincipal User user) {
        List<GetDishDto> dishes = dishService.getAllDishesForUser(user.getId());
        return ResponseEntity.ok(dishes);
    }

    /**
     * Delete a dish
     * @param dishId the ID of the dish to delete
     * @param user the authenticated user
     * @return success or error message
     */
    @DeleteMapping("/{dishId}")
    public ResponseEntity<String> deleteDish(@PathVariable UUID dishId, @AuthenticationPrincipal User user) {
        boolean deleted = dishService.deleteDish(dishId, user.getId());
        
        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Dish not found or not owned by user");
        }
        
        return ResponseEntity.ok("Dish deleted successfully");
    }

    /**
     * Search for dishes by name
     * @param name the name to search for
     * @param user the authenticated user
     * @return list of matching dishes
     */
    @GetMapping("/search")
    public ResponseEntity<List<GetDishDto>> searchDishesByName(@RequestParam String name, @AuthenticationPrincipal User user) {
        List<GetDishDto> dishes = dishService.searchDishesByName(name, user.getId());
        return ResponseEntity.ok(dishes);
    }
}