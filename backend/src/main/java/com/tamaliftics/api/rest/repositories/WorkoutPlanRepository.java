package com.tamaliftics.api.rest.repositories;

import com.tamaliftics.api.rest.models.Day;
import com.tamaliftics.api.rest.models.User;
import com.tamaliftics.api.rest.models.WorkoutPlan;
import com.tamaliftics.api.rest.models.WorkoutPlanType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository for WorkoutPlan entities.
 */
@Repository
public interface WorkoutPlanRepository extends JpaRepository<WorkoutPlan, UUID> {
    
    /**
     * Find all workout plans belonging to a user.
     * @param user the user
     * @return a list of workout plans
     */
    List<WorkoutPlan> findByUser(User user);
    
    /**
     * Find a workout plan by type and user.
     * @param type the workout plan type
     * @param user the user
     * @return an optional containing the workout plan if found
     */
    Optional<WorkoutPlan> findByTypeAndUser(WorkoutPlanType type, User user);
    
    /**
     * Find all workout plans by type and user.
     * @param type the workout plan type
     * @param user the user
     * @return a list of workout plans
     */
    List<WorkoutPlan> findAllByTypeAndUser(WorkoutPlanType type, User user);
    
    /**
     * Find a workout plan by day and user.
     * @param day the day
     * @param user the user
     * @return an optional containing the workout plan if found
     */
    Optional<WorkoutPlan> findByDayAndUser(Day day, User user);
    
    /**
     * Find all workout plans by day and user.
     * @param day the day
     * @param user the user
     * @return a list of workout plans
     */
    List<WorkoutPlan> findAllByDayAndUser(Day day, User user);
    
    /**
     * Find a workout plan by type, day, and user.
     * @param type the workout plan type
     * @param day the day
     * @param user the user
     * @return an optional containing the workout plan if found
     */
    Optional<WorkoutPlan> findByTypeAndDayAndUser(WorkoutPlanType type, Day day, User user);
}