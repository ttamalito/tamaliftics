package com.tamaliftics.api.rest.repositories;

import com.tamaliftics.api.rest.models.Dish;
import com.tamaliftics.api.rest.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Repository for Dish entities.
 */
@Repository
public interface DishRepository extends JpaRepository<Dish, UUID> {
    
    /**
     * Find all dishes belonging to a user.
     * @param user the user
     * @return a list of dishes
     */
    List<Dish> findByUser(User user);
    
    /**
     * Find all dishes belonging to a user with a specific name.
     * @param name the name to search for
     * @param user the user
     * @return a list of dishes
     */
    List<Dish> findByNameContainingIgnoreCaseAndUser(String name, User user);
}