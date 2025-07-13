package com.tamaliftics.api.rest.repositories;

import com.tamaliftics.api.rest.models.Exercise;
import com.tamaliftics.api.rest.models.ExerciseCategory;
import com.tamaliftics.api.rest.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository for Exercise entities.
 */
@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, UUID> {
    
    /**
     * Find all exercises belonging to a user.
     * @param user the user
     * @return a list of exercises
     */
    List<Exercise> findByUser(User user);
    
    /**
     * Find an exercise by name and user.
     * @param name the exercise name
     * @param user the user
     * @return an optional containing the exercise if found
     */
    Optional<Exercise> findByNameAndUser(String name, User user);
    
    /**
     * Find all exercises by name containing a string and user.
     * @param name the name to search for
     * @param user the user
     * @return a list of exercises
     */
    List<Exercise> findByNameContainingIgnoreCaseAndUser(String name, User user);
    
    /**
     * Find all exercises by category and user.
     * @param category the exercise category
     * @param user the user
     * @return a list of exercises
     */
    List<Exercise> findByCategoryAndUser(ExerciseCategory category, User user);
    
    /**
     * Find all exercises by category ID and user.
     * @param categoryId the exercise category ID
     * @param user the user
     * @return a list of exercises
     */
    List<Exercise> findByCategoryIdAndUser(UUID categoryId, User user);
}