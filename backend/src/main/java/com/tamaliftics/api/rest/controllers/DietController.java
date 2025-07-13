package com.tamaliftics.api.rest.controllers;

import com.tamaliftics.api.rest.models.User;
import com.tamaliftics.api.rest.models.dtos.diet.CreateDietDto;
import com.tamaliftics.api.rest.models.dtos.diet.GetDietDto;
import com.tamaliftics.api.rest.models.dtos.diet.UpdateDietDto;
import com.tamaliftics.api.rest.services.DietService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Controller for handling diet-related operations
 */
@RestController
@RequestMapping("/diets")
public class DietController {

    private final DietService dietService;

    @Autowired
    public DietController(DietService dietService) {
        this.dietService = dietService;
    }

    /**
     * Create a new diet
     * @param createDietDto the DTO containing diet information
     * @param user the authenticated user
     * @return the created diet
     */
    @PostMapping
    public ResponseEntity<?> createDiet(@RequestBody CreateDietDto createDietDto, @AuthenticationPrincipal User user) {
        Optional<GetDietDto> dietDtoOptional = dietService.createDiet(createDietDto, user.getId());
        
        if (dietDtoOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to create diet");
        }
        
        return ResponseEntity.status(HttpStatus.CREATED).body(dietDtoOptional.get());
    }

    /**
     * Update an existing diet
     * @param updateDietDto the DTO containing updated diet information
     * @param user the authenticated user
     * @return the updated diet
     */
    @PutMapping
    public ResponseEntity<?> updateDiet(@RequestBody UpdateDietDto updateDietDto, @AuthenticationPrincipal User user) {
        Optional<GetDietDto> dietDtoOptional = dietService.updateDiet(updateDietDto, user.getId());
        
        if (dietDtoOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Diet not found or not owned by user");
        }
        
        return ResponseEntity.ok(dietDtoOptional.get());
    }

    /**
     * Get a diet by ID
     * @param dietId the ID of the diet to retrieve
     * @param user the authenticated user
     * @return the diet
     */
    @GetMapping("/{dietId}")
    public ResponseEntity<?> getDietById(@PathVariable UUID dietId, @AuthenticationPrincipal User user) {
        Optional<GetDietDto> dietDtoOptional = dietService.getDietById(dietId, user.getId());
        
        if (dietDtoOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Diet not found or not owned by user");
        }
        
        return ResponseEntity.ok(dietDtoOptional.get());
    }

    /**
     * Get all diets for the authenticated user
     * @param user the authenticated user
     * @return list of diets
     */
    @GetMapping
    public ResponseEntity<List<GetDietDto>> getAllDiets(@AuthenticationPrincipal User user) {
        List<GetDietDto> diets = dietService.getAllDietsForUser(user.getId());
        return ResponseEntity.ok(diets);
    }

    /**
     * Delete a diet
     * @param dietId the ID of the diet to delete
     * @param user the authenticated user
     * @return success or error message
     */
    @DeleteMapping("/{dietId}")
    public ResponseEntity<String> deleteDiet(@PathVariable UUID dietId, @AuthenticationPrincipal User user) {
        boolean deleted = dietService.deleteDiet(dietId, user.getId());
        
        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Diet not found or not owned by user");
        }
        
        return ResponseEntity.ok("Diet deleted successfully");
    }

    /**
     * Add a meal to a diet
     * @param dietId the ID of the diet
     * @param mealId the ID of the meal to add
     * @param user the authenticated user
     * @return the updated diet
     */
    @PostMapping("/{dietId}/meals/{mealId}")
    public ResponseEntity<?> addMealToDiet(
            @PathVariable UUID dietId,
            @PathVariable UUID mealId,
            @AuthenticationPrincipal User user) {
        
        Optional<GetDietDto> dietDtoOptional = dietService.addMealToDiet(dietId, mealId, user.getId());
        
        if (dietDtoOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Diet or meal not found, or not owned by user");
        }
        
        return ResponseEntity.ok(dietDtoOptional.get());
    }

    /**
     * Remove a meal from a diet
     * @param dietId the ID of the diet
     * @param mealId the ID of the meal to remove
     * @param user the authenticated user
     * @return the updated diet
     */
    @DeleteMapping("/{dietId}/meals/{mealId}")
    public ResponseEntity<?> removeMealFromDiet(
            @PathVariable UUID dietId,
            @PathVariable UUID mealId,
            @AuthenticationPrincipal User user) {
        
        Optional<GetDietDto> dietDtoOptional = dietService.removeMealFromDiet(dietId, mealId, user.getId());
        
        if (dietDtoOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Diet not found or not owned by user");
        }
        
        return ResponseEntity.ok(dietDtoOptional.get());
    }

    /**
     * Search for diets by name
     * @param name the name to search for
     * @param user the authenticated user
     * @return list of matching diets
     */
    @GetMapping("/search")
    public ResponseEntity<List<GetDietDto>> searchDietsByName(@RequestParam String name, @AuthenticationPrincipal User user) {
        List<GetDietDto> diets = dietService.searchDietsByName(name, user.getId());
        return ResponseEntity.ok(diets);
    }
}