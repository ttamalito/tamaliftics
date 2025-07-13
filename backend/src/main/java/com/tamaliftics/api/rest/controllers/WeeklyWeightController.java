package com.tamaliftics.api.rest.controllers;

import com.tamaliftics.api.rest.models.User;
import com.tamaliftics.api.rest.models.dtos.weight.GetWeeklyWeightDto;
import com.tamaliftics.api.rest.services.WeeklyWeightService;
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
 * Controller for handling weekly weight-related operations
 * Note: Weekly weights are automatically created and updated by the DailyWeightService.
 */
@RestController
@RequestMapping("/weekly-weights")
public class WeeklyWeightController {

    private final WeeklyWeightService weeklyWeightService;

    @Autowired
    public WeeklyWeightController(WeeklyWeightService weeklyWeightService) {
        this.weeklyWeightService = weeklyWeightService;
    }

    /**
     * Get a weekly weight record by ID
     * @param weeklyWeightId the ID of the weekly weight record to retrieve
     * @param user the authenticated user
     * @return the weekly weight record
     */
    @GetMapping("/{weeklyWeightId}")
    public ResponseEntity<?> getWeeklyWeightById(@PathVariable UUID weeklyWeightId, @AuthenticationPrincipal User user) {
        Optional<GetWeeklyWeightDto> weeklyWeightDtoOptional = weeklyWeightService.getWeeklyWeightById(weeklyWeightId, user.getId());
        
        if (weeklyWeightDtoOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Weekly weight record not found or not owned by user");
        }
        
        return ResponseEntity.ok(weeklyWeightDtoOptional.get());
    }

    /**
     * Get all weekly weight records for the authenticated user
     * @param user the authenticated user
     * @return list of weekly weight records
     */
    @GetMapping
    public ResponseEntity<List<GetWeeklyWeightDto>> getAllWeeklyWeights(@AuthenticationPrincipal User user) {
        List<GetWeeklyWeightDto> weeklyWeights = weeklyWeightService.getAllWeeklyWeightsForUser(user.getId());
        return ResponseEntity.ok(weeklyWeights);
    }

    /**
     * Get weekly weight records for a specific year
     * @param year the year
     * @param user the authenticated user
     * @return list of weekly weight records
     */
    @GetMapping("/year/{year}")
    public ResponseEntity<List<GetWeeklyWeightDto>> getWeeklyWeightsByYear(@PathVariable int year, @AuthenticationPrincipal User user) {
        List<GetWeeklyWeightDto> weeklyWeights = weeklyWeightService.getWeeklyWeightsByYear(year, user.getId());
        return ResponseEntity.ok(weeklyWeights);
    }

    /**
     * Get weekly weight records between two dates
     * @param startDate the start date (inclusive)
     * @param endDate the end date (inclusive)
     * @param user the authenticated user
     * @return list of weekly weight records
     */
    @GetMapping("/range")
    public ResponseEntity<List<GetWeeklyWeightDto>> getWeeklyWeightsBetweenDates(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @AuthenticationPrincipal User user) {
        
        List<GetWeeklyWeightDto> weeklyWeights = weeklyWeightService.getWeeklyWeightsBetweenDates(startDate, endDate, user.getId());
        return ResponseEntity.ok(weeklyWeights);
    }

    /**
     * Get the weekly weight record for a specific date
     * @param date the date
     * @param user the authenticated user
     * @return the weekly weight record
     */
    @GetMapping("/date")
    public ResponseEntity<?> getWeeklyWeightForDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @AuthenticationPrincipal User user) {
        
        Optional<GetWeeklyWeightDto> weeklyWeightDtoOptional = weeklyWeightService.getWeeklyWeightForDate(date, user.getId());
        
        if (weeklyWeightDtoOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No weekly weight record found for the specified date");
        }
        
        return ResponseEntity.ok(weeklyWeightDtoOptional.get());
    }
}