package com.tamaliftics.api.rest.repositories;

import com.tamaliftics.api.rest.models.Diet;
import com.tamaliftics.api.rest.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository for Diet entities.
 */
@Repository
public interface DietRepository extends JpaRepository<Diet, UUID> {
    
    /**
     * Find all diets belonging to a user.
     * @param user the user
     * @return a list of diets
     */
    List<Diet> findByUser(User user);
    
    /**
     * Find a diet by name and user.
     * @param name the diet name
     * @param user the user
     * @return an optional containing the diet if found
     */
    Optional<Diet> findByNameAndUser(String name, User user);
    
    /**
     * Find all diets by name containing a string and user.
     * @param name the name to search for
     * @param user the user
     * @return a list of diets
     */
    List<Diet> findByNameContainingIgnoreCaseAndUser(String name, User user);
}