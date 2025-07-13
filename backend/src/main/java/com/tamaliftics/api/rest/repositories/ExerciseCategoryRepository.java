package com.tamaliftics.api.rest.repositories;

import com.tamaliftics.api.rest.models.ExerciseCategory;
import com.tamaliftics.api.rest.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository for ExerciseCategory entities.
 */
@Repository
public interface ExerciseCategoryRepository extends JpaRepository<ExerciseCategory, UUID> {
    
    /**
     * Find all exercise categories belonging to a user.
     * @param user the user
     * @return a list of exercise categories
     */
    List<ExerciseCategory> findByUser(User user);
    
    /**
     * Find an exercise category by name and user.
     * @param name the category name
     * @param user the user
     * @return an optional containing the exercise category if found
     */
    Optional<ExerciseCategory> findByNameAndUser(String name, User user);
    
    /**
     * Find all exercise categories by name containing a string and user.
     * @param name the name to search for
     * @param user the user
     * @return a list of exercise categories
     */
    List<ExerciseCategory> findByNameContainingIgnoreCaseAndUser(String name, User user);
}