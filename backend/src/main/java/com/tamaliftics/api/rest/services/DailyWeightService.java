package com.tamaliftics.api.rest.services;

import com.tamaliftics.api.rest.models.DailyWeight;
import com.tamaliftics.api.rest.models.User;
import com.tamaliftics.api.rest.models.WeeklyWeight;
import com.tamaliftics.api.rest.models.dtos.weight.CreateDailyWeightDto;
import com.tamaliftics.api.rest.models.dtos.weight.GetDailyWeightDto;
import com.tamaliftics.api.rest.models.dtos.weight.UpdateDailyWeightDto;
import com.tamaliftics.api.rest.repositories.DailyWeightRepository;
import com.tamaliftics.api.rest.repositories.UserRepository;
import com.tamaliftics.api.rest.repositories.WeeklyWeightRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.WeekFields;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service for handling daily weight-related operations.
 */
@Service
public class DailyWeightService {

    private final DailyWeightRepository dailyWeightRepository;
    private final WeeklyWeightRepository weeklyWeightRepository;
    private final UserRepository userRepository;

    @Autowired
    public DailyWeightService(DailyWeightRepository dailyWeightRepository,
                             WeeklyWeightRepository weeklyWeightRepository,
                             UserRepository userRepository) {
        this.dailyWeightRepository = dailyWeightRepository;
        this.weeklyWeightRepository = weeklyWeightRepository;
        this.userRepository = userRepository;
    }

    /**
     * Create a new daily weight record for a user.
     * @param createDailyWeightDto the DTO containing daily weight information
     * @param userId the ID of the user creating the daily weight record
     * @return the created daily weight record as a DTO, or empty if the user doesn't exist
     */
    public Optional<GetDailyWeightDto> createDailyWeight(CreateDailyWeightDto createDailyWeightDto, UUID userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return Optional.empty();
        }

        User user = userOptional.get();
        
        // Check if a record already exists for this date
        Optional<DailyWeight> existingWeight = dailyWeightRepository.findByDateAndUser(createDailyWeightDto.date(), user);
        if (existingWeight.isPresent()) {
            // Update the existing record instead of creating a new one
            DailyWeight weight = existingWeight.get();
            weight.setWeight(createDailyWeightDto.weight());
            DailyWeight savedWeight = dailyWeightRepository.save(weight);
            updateWeeklyWeight(user, createDailyWeightDto.date());
            return Optional.of(mapToGetDailyWeightDto(savedWeight));
        }

        DailyWeight dailyWeight = new DailyWeight(
                createDailyWeightDto.date(),
                createDailyWeightDto.weight(),
                user
        );

        DailyWeight savedDailyWeight = dailyWeightRepository.save(dailyWeight);
        
        // Update or create the weekly weight record
        updateWeeklyWeight(user, createDailyWeightDto.date());
        
        return Optional.of(mapToGetDailyWeightDto(savedDailyWeight));
    }

    /**
     * Update an existing daily weight record.
     * @param updateDailyWeightDto the DTO containing updated daily weight information
     * @param userId the ID of the user updating the daily weight record
     * @return the updated daily weight record as a DTO, or empty if the record doesn't exist or doesn't belong to the user
     */
    public Optional<GetDailyWeightDto> updateDailyWeight(UpdateDailyWeightDto updateDailyWeightDto, UUID userId) {
        Optional<DailyWeight> dailyWeightOptional = dailyWeightRepository.findById(updateDailyWeightDto.id());
        if (dailyWeightOptional.isEmpty() || !dailyWeightOptional.get().getUser().getId().equals(userId)) {
            return Optional.empty();
        }

        DailyWeight dailyWeight = dailyWeightOptional.get();
        LocalDate oldDate = dailyWeight.getDate(); // Store the old date to update weekly weights if needed
        
        if (updateDailyWeightDto.date() != null) {
            dailyWeight.setDate(updateDailyWeightDto.date());
        }
        if (updateDailyWeightDto.weight() != null) {
            dailyWeight.setWeight(updateDailyWeightDto.weight());
        }

        DailyWeight updatedDailyWeight = dailyWeightRepository.save(dailyWeight);
        
        // Update weekly weights for both the old and new dates if they're different
        if (updateDailyWeightDto.date() != null && !updateDailyWeightDto.date().equals(oldDate)) {
            updateWeeklyWeight(dailyWeight.getUser(), oldDate);
            updateWeeklyWeight(dailyWeight.getUser(), updateDailyWeightDto.date());
        } else {
            updateWeeklyWeight(dailyWeight.getUser(), dailyWeight.getDate());
        }
        
        return Optional.of(mapToGetDailyWeightDto(updatedDailyWeight));
    }

    /**
     * Get a daily weight record by ID.
     * @param dailyWeightId the ID of the daily weight record to retrieve
     * @param userId the ID of the user requesting the record
     * @return the daily weight record as a DTO, or empty if the record doesn't exist or doesn't belong to the user
     */
    public Optional<GetDailyWeightDto> getDailyWeightById(UUID dailyWeightId, UUID userId) {
        Optional<DailyWeight> dailyWeightOptional = dailyWeightRepository.findById(dailyWeightId);
        if (dailyWeightOptional.isEmpty() || !dailyWeightOptional.get().getUser().getId().equals(userId)) {
            return Optional.empty();
        }

        return Optional.of(mapToGetDailyWeightDto(dailyWeightOptional.get()));
    }

    /**
     * Get all daily weight records for a user.
     * @param userId the ID of the user
     * @return a list of daily weight records as DTOs
     */
    public List<GetDailyWeightDto> getAllDailyWeightsForUser(UUID userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return List.of();
        }

        return dailyWeightRepository.findByUser(userOptional.get()).stream()
                .map(this::mapToGetDailyWeightDto)
                .collect(Collectors.toList());
    }

    /**
     * Get daily weight records for a user between two dates.
     * @param startDate the start date (inclusive)
     * @param endDate the end date (inclusive)
     * @param userId the ID of the user
     * @return a list of daily weight records as DTOs
     */
    public List<GetDailyWeightDto> getDailyWeightsBetweenDates(LocalDate startDate, LocalDate endDate, UUID userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return List.of();
        }

        return dailyWeightRepository.findByDateBetweenAndUser(startDate, endDate, userOptional.get()).stream()
                .map(this::mapToGetDailyWeightDto)
                .collect(Collectors.toList());
    }

    /**
     * Delete a daily weight record.
     * @param dailyWeightId the ID of the daily weight record to delete
     * @param userId the ID of the user deleting the record
     * @return true if the record was deleted, false if the record doesn't exist or doesn't belong to the user
     */
    public boolean deleteDailyWeight(UUID dailyWeightId, UUID userId) {
        Optional<DailyWeight> dailyWeightOptional = dailyWeightRepository.findById(dailyWeightId);
        if (dailyWeightOptional.isEmpty() || !dailyWeightOptional.get().getUser().getId().equals(userId)) {
            return false;
        }

        DailyWeight dailyWeight = dailyWeightOptional.get();
        LocalDate date = dailyWeight.getDate();
        User user = dailyWeight.getUser();
        
        dailyWeightRepository.delete(dailyWeight);
        
        // Update the weekly weight record
        updateWeeklyWeight(user, date);
        
        return true;
    }

    /**
     * Update or create the weekly weight record for a specific date.
     * @param user the user
     * @param date the date
     */
    private void updateWeeklyWeight(User user, LocalDate date) {
        // Get the week number and year for the date
        WeekFields weekFields = WeekFields.of(Locale.getDefault());
        int weekNumber = date.get(weekFields.weekOfWeekBasedYear());
        int year = date.get(weekFields.weekBasedYear());
        
        // Calculate the start and end dates of the week
        LocalDate startOfWeek = date.with(weekFields.dayOfWeek(), 1);
        LocalDate endOfWeek = date.with(weekFields.dayOfWeek(), 7);
        
        // Get all daily weights for the week
        List<DailyWeight> weeklyWeights = dailyWeightRepository.findByDateBetweenAndUser(startOfWeek, endOfWeek, user);
        
        if (weeklyWeights.isEmpty()) {
            // If there are no daily weights for the week, delete the weekly weight record if it exists
            Optional<WeeklyWeight> existingWeeklyWeight = weeklyWeightRepository.findByWeekNumberAndYearAndUser(weekNumber, year, user);
            existingWeeklyWeight.ifPresent(weeklyWeightRepository::delete);
            return;
        }
        
        // Calculate the average weight
        double averageWeight = weeklyWeights.stream()
                .mapToDouble(DailyWeight::getWeight)
                .average()
                .orElse(0.0);
        
        // Update or create the weekly weight record
        Optional<WeeklyWeight> existingWeeklyWeight = weeklyWeightRepository.findByWeekNumberAndYearAndUser(weekNumber, year, user);
        WeeklyWeight weeklyWeight;
        
        if (existingWeeklyWeight.isPresent()) {
            weeklyWeight = existingWeeklyWeight.get();
            weeklyWeight.setAverageWeight(averageWeight);
        } else {
            weeklyWeight = new WeeklyWeight(weekNumber, year, startOfWeek, endOfWeek, averageWeight, user);
        }
        
        weeklyWeightRepository.save(weeklyWeight);
    }

    /**
     * Map a DailyWeight entity to a GetDailyWeightDto.
     * @param dailyWeight the daily weight entity
     * @return the daily weight DTO
     */
    private GetDailyWeightDto mapToGetDailyWeightDto(DailyWeight dailyWeight) {
        return new GetDailyWeightDto(
                dailyWeight.getId(),
                dailyWeight.getDate(),
                dailyWeight.getWeight(),
                dailyWeight.getUser().getId()
        );
    }
}