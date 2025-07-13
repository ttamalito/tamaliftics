package com.tamaliftics.api.rest.repositories;

import com.tamaliftics.api.rest.models.Meal;
import com.tamaliftics.api.rest.models.MealType;
import com.tamaliftics.api.rest.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository for Meal entities.
 */
@Repository
public interface MealRepository extends JpaRepository<Meal, UUID> {
    
    /**
     * Find all meals belonging to a user.
     * @param user the user
     * @return a list of meals
     */
    List<Meal> findByUser(User user);
    
    /**
     * Find a meal by type and user.
     * @param type the meal type
     * @param user the user
     * @return an optional containing the meal if found
     */
    Optional<Meal> findByTypeAndUser(MealType type, User user);
    
    /**
     * Find all meals by type and user.
     * @param type the meal type
     * @param user the user
     * @return a list of meals
     */
    List<Meal> findAllByTypeAndUser(MealType type, User user);
}