package com.tamaliftics.api.rest.controllers;

import com.tamaliftics.api.rest.models.User;
import com.tamaliftics.api.rest.models.dtos.weight.CreateDailyWeightDto;
import com.tamaliftics.api.rest.models.dtos.weight.GetDailyWeightDto;
import com.tamaliftics.api.rest.models.dtos.weight.UpdateDailyWeightDto;
import com.tamaliftics.api.rest.services.DailyWeightService;
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
 * Controller for handling daily weight-related operations
 */
@RestController
@RequestMapping("/daily-weights")
public class DailyWeightController {

    private final DailyWeightService dailyWeightService;

    @Autowired
    public DailyWeightController(DailyWeightService dailyWeightService) {
        this.dailyWeightService = dailyWeightService;
    }

    /**
     * Create a new daily weight record
     * @param createDailyWeightDto the DTO containing daily weight information
     * @param user the authenticated user
     * @return the created daily weight record
     */
    @PostMapping
    public ResponseEntity<?> createDailyWeight(@RequestBody CreateDailyWeightDto createDailyWeightDto, @AuthenticationPrincipal User user) {
        Optional<GetDailyWeightDto> dailyWeightDtoOptional = dailyWeightService.createDailyWeight(createDailyWeightDto, user.getId());
        
        if (dailyWeightDtoOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to create daily weight record");
        }
        
        return ResponseEntity.status(HttpStatus.CREATED).body(dailyWeightDtoOptional.get());
    }

    /**
     * Update an existing daily weight record
     * @param updateDailyWeightDto the DTO containing updated daily weight information
     * @param user the authenticated user
     * @return the updated daily weight record
     */
    @PutMapping
    public ResponseEntity<?> updateDailyWeight(@RequestBody UpdateDailyWeightDto updateDailyWeightDto, @AuthenticationPrincipal User user) {
        Optional<GetDailyWeightDto> dailyWeightDtoOptional = dailyWeightService.updateDailyWeight(updateDailyWeightDto, user.getId());
        
        if (dailyWeightDtoOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Daily weight record not found or not owned by user");
        }
        
        return ResponseEntity.ok(dailyWeightDtoOptional.get());
    }

    /**
     * Get a daily weight record by ID
     * @param dailyWeightId the ID of the daily weight record to retrieve
     * @param user the authenticated user
     * @return the daily weight record
     */
    @GetMapping("/{dailyWeightId}")
    public ResponseEntity<?> getDailyWeightById(@PathVariable UUID dailyWeightId, @AuthenticationPrincipal User user) {
        Optional<GetDailyWeightDto> dailyWeightDtoOptional = dailyWeightService.getDailyWeightById(dailyWeightId, user.getId());
        
        if (dailyWeightDtoOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Daily weight record not found or not owned by user");
        }
        
        return ResponseEntity.ok(dailyWeightDtoOptional.get());
    }

    /**
     * Get all daily weight records for the authenticated user
     * @param user the authenticated user
     * @return list of daily weight records
     */
    @GetMapping
    public ResponseEntity<List<GetDailyWeightDto>> getAllDailyWeights(@AuthenticationPrincipal User user) {
        List<GetDailyWeightDto> dailyWeights = dailyWeightService.getAllDailyWeightsForUser(user.getId());
        return ResponseEntity.ok(dailyWeights);
    }

    /**
     * Get daily weight records between two dates
     * @param startDate the start date (inclusive)
     * @param endDate the end date (inclusive)
     * @param user the authenticated user
     * @return list of daily weight records
     */
    @GetMapping("/range")
    public ResponseEntity<List<GetDailyWeightDto>> getDailyWeightsBetweenDates(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @AuthenticationPrincipal User user) {
        
        List<GetDailyWeightDto> dailyWeights = dailyWeightService.getDailyWeightsBetweenDates(startDate, endDate, user.getId());
        return ResponseEntity.ok(dailyWeights);
    }

    /**
     * Delete a daily weight record
     * @param dailyWeightId the ID of the daily weight record to delete
     * @param user the authenticated user
     * @return success or error message
     */
    @DeleteMapping("/{dailyWeightId}")
    public ResponseEntity<String> deleteDailyWeight(@PathVariable UUID dailyWeightId, @AuthenticationPrincipal User user) {
        boolean deleted = dailyWeightService.deleteDailyWeight(dailyWeightId, user.getId());
        
        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Daily weight record not found or not owned by user");
        }
        
        return ResponseEntity.ok("Daily weight record deleted successfully");
    }
}