package com.tamaliftics.api.rest.repositories;

import com.tamaliftics.api.rest.models.User;
import com.tamaliftics.api.rest.models.WeeklyWeight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository for WeeklyWeight entities.
 */
@Repository
public interface WeeklyWeightRepository extends JpaRepository<WeeklyWeight, UUID> {
    
    /**
     * Find all weekly weights belonging to a user.
     * @param user the user
     * @return a list of weekly weights
     */
    List<WeeklyWeight> findByUser(User user);
    
    /**
     * Find a weekly weight by week number, year, and user.
     * @param weekNumber the week number
     * @param year the year
     * @param user the user
     * @return an optional containing the weekly weight if found
     */
    Optional<WeeklyWeight> findByWeekNumberAndYearAndUser(int weekNumber, int year, User user);
    
    /**
     * Find all weekly weights for a specific year and user.
     * @param year the year
     * @param user the user
     * @return a list of weekly weights
     */
    List<WeeklyWeight> findByYearAndUser(int year, User user);
    
    /**
     * Find all weekly weights that contain a specific date for a user.
     * @param date the date
     * @param user the user
     * @return a list of weekly weights
     */
    List<WeeklyWeight> findByStartDateLessThanEqualAndEndDateGreaterThanEqualAndUser(LocalDate date, LocalDate date2, User user);
    
    /**
     * Find all weekly weights between two dates for a user.
     * @param startDate the start date (inclusive)
     * @param endDate the end date (inclusive)
     * @param user the user
     * @return a list of weekly weights
     */
    List<WeeklyWeight> findByStartDateGreaterThanEqualAndEndDateLessThanEqualAndUser(LocalDate startDate, LocalDate endDate, User user);
}