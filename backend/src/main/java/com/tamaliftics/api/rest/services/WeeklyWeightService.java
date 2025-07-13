package com.tamaliftics.api.rest.services;

import com.tamaliftics.api.rest.models.User;
import com.tamaliftics.api.rest.models.WeeklyWeight;
import com.tamaliftics.api.rest.models.dtos.weight.GetWeeklyWeightDto;
import com.tamaliftics.api.rest.repositories.UserRepository;
import com.tamaliftics.api.rest.repositories.WeeklyWeightRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service for handling weekly weight-related operations.
 * Note: Weekly weights are automatically created and updated by the DailyWeightService.
 */
@Service
public class WeeklyWeightService {

    private final WeeklyWeightRepository weeklyWeightRepository;
    private final UserRepository userRepository;

    @Autowired
    public WeeklyWeightService(WeeklyWeightRepository weeklyWeightRepository, UserRepository userRepository) {
        this.weeklyWeightRepository = weeklyWeightRepository;
        this.userRepository = userRepository;
    }

    /**
     * Get a weekly weight record by ID.
     * @param weeklyWeightId the ID of the weekly weight record to retrieve
     * @param userId the ID of the user requesting the record
     * @return the weekly weight record as a DTO, or empty if the record doesn't exist or doesn't belong to the user
     */
    public Optional<GetWeeklyWeightDto> getWeeklyWeightById(UUID weeklyWeightId, UUID userId) {
        Optional<WeeklyWeight> weeklyWeightOptional = weeklyWeightRepository.findById(weeklyWeightId);
        if (weeklyWeightOptional.isEmpty() || !weeklyWeightOptional.get().getUser().getId().equals(userId)) {
            return Optional.empty();
        }

        return Optional.of(mapToGetWeeklyWeightDto(weeklyWeightOptional.get()));
    }

    /**
     * Get all weekly weight records for a user.
     * @param userId the ID of the user
     * @return a list of weekly weight records as DTOs
     */
    public List<GetWeeklyWeightDto> getAllWeeklyWeightsForUser(UUID userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return List.of();
        }

        return weeklyWeightRepository.findByUser(userOptional.get()).stream()
                .map(this::mapToGetWeeklyWeightDto)
                .collect(Collectors.toList());
    }

    /**
     * Get weekly weight records for a user for a specific year.
     * @param year the year
     * @param userId the ID of the user
     * @return a list of weekly weight records as DTOs
     */
    public List<GetWeeklyWeightDto> getWeeklyWeightsByYear(int year, UUID userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return List.of();
        }

        return weeklyWeightRepository.findByYearAndUser(year, userOptional.get()).stream()
                .map(this::mapToGetWeeklyWeightDto)
                .collect(Collectors.toList());
    }

    /**
     * Get weekly weight records for a user between two dates.
     * @param startDate the start date (inclusive)
     * @param endDate the end date (inclusive)
     * @param userId the ID of the user
     * @return a list of weekly weight records as DTOs
     */
    public List<GetWeeklyWeightDto> getWeeklyWeightsBetweenDates(LocalDate startDate, LocalDate endDate, UUID userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return List.of();
        }

        return weeklyWeightRepository.findByStartDateGreaterThanEqualAndEndDateLessThanEqualAndUser(startDate, endDate, userOptional.get()).stream()
                .map(this::mapToGetWeeklyWeightDto)
                .collect(Collectors.toList());
    }

    /**
     * Get the weekly weight record for a specific date.
     * @param date the date
     * @param userId the ID of the user
     * @return the weekly weight record as a DTO, or empty if no record exists for the date
     */
    public Optional<GetWeeklyWeightDto> getWeeklyWeightForDate(LocalDate date, UUID userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return Optional.empty();
        }

        List<WeeklyWeight> weeklyWeights = weeklyWeightRepository.findByStartDateLessThanEqualAndEndDateGreaterThanEqualAndUser(date, date, userOptional.get());
        if (weeklyWeights.isEmpty()) {
            return Optional.empty();
        }

        return Optional.of(mapToGetWeeklyWeightDto(weeklyWeights.get(0)));
    }

    /**
     * Map a WeeklyWeight entity to a GetWeeklyWeightDto.
     * @param weeklyWeight the weekly weight entity
     * @return the weekly weight DTO
     */
    private GetWeeklyWeightDto mapToGetWeeklyWeightDto(WeeklyWeight weeklyWeight) {
        return new GetWeeklyWeightDto(
                weeklyWeight.getId(),
                weeklyWeight.getWeekNumber(),
                weeklyWeight.getYear(),
                weeklyWeight.getStartDate(),
                weeklyWeight.getEndDate(),
                weeklyWeight.getAverageWeight(),
                weeklyWeight.getUser().getId()
        );
    }
}