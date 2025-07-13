package com.tamaliftics.api.rest.repositories;

import com.tamaliftics.api.rest.models.DailyWeight;
import com.tamaliftics.api.rest.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository for DailyWeight entities.
 */
@Repository
public interface DailyWeightRepository extends JpaRepository<DailyWeight, UUID> {
    
    /**
     * Find all daily weights belonging to a user.
     * @param user the user
     * @return a list of daily weights
     */
    List<DailyWeight> findByUser(User user);
    
    /**
     * Find a daily weight by date and user.
     * @param date the date
     * @param user the user
     * @return an optional containing the daily weight if found
     */
    Optional<DailyWeight> findByDateAndUser(LocalDate date, User user);
    
    /**
     * Find all daily weights between two dates for a user.
     * @param startDate the start date (inclusive)
     * @param endDate the end date (inclusive)
     * @param user the user
     * @return a list of daily weights
     */
    List<DailyWeight> findByDateBetweenAndUser(LocalDate startDate, LocalDate endDate, User user);
    
    /**
     * Find all daily weights after a date for a user.
     * @param date the date (exclusive)
     * @param user the user
     * @return a list of daily weights
     */
    List<DailyWeight> findByDateAfterAndUser(LocalDate date, User user);
    
    /**
     * Find all daily weights before a date for a user.
     * @param date the date (exclusive)
     * @param user the user
     * @return a list of daily weights
     */
    List<DailyWeight> findByDateBeforeAndUser(LocalDate date, User user);
}