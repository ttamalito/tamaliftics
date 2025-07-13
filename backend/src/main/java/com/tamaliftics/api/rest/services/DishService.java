package com.tamaliftics.api.rest.services;

import com.tamaliftics.api.rest.models.Dish;
import com.tamaliftics.api.rest.models.User;
import com.tamaliftics.api.rest.models.dtos.dish.CreateDishDto;
import com.tamaliftics.api.rest.models.dtos.dish.GetDishDto;
import com.tamaliftics.api.rest.models.dtos.dish.UpdateDishDto;
import com.tamaliftics.api.rest.repositories.DishRepository;
import com.tamaliftics.api.rest.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service for handling dish-related operations.
 */
@Service
public class DishService {

    private final DishRepository dishRepository;
    private final UserRepository userRepository;

    @Autowired
    public DishService(DishRepository dishRepository, UserRepository userRepository) {
        this.dishRepository = dishRepository;
        this.userRepository = userRepository;
    }

    /**
     * Create a new dish for a user.
     * @param createDishDto the DTO containing dish information
     * @param userId the ID of the user creating the dish
     * @return the created dish as a DTO, or empty if the user doesn't exist
     */
    public Optional<GetDishDto> createDish(CreateDishDto createDishDto, UUID userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return Optional.empty();
        }

        User user = userOptional.get();
        Dish dish = new Dish(
                createDishDto.name(),
                createDishDto.description(),
                createDishDto.calories(),
                createDishDto.carbs(),
                createDishDto.fat(),
                createDishDto.protein(),
                user
        );

        Dish savedDish = dishRepository.save(dish);
        return Optional.of(mapToGetDishDto(savedDish));
    }

    /**
     * Update an existing dish.
     * @param updateDishDto the DTO containing updated dish information
     * @param userId the ID of the user updating the dish
     * @return the updated dish as a DTO, or empty if the dish doesn't exist or doesn't belong to the user
     */
    public Optional<GetDishDto> updateDish(UpdateDishDto updateDishDto, UUID userId) {
        Optional<Dish> dishOptional = dishRepository.findById(updateDishDto.id());
        if (dishOptional.isEmpty() || !dishOptional.get().getUser().getId().equals(userId)) {
            return Optional.empty();
        }

        Dish dish = dishOptional.get();
        if (updateDishDto.name() != null) {
            dish.setName(updateDishDto.name());
        }
        if (updateDishDto.description() != null) {
            dish.setDescription(updateDishDto.description());
        }
        if (updateDishDto.calories() != null) {
            dish.setCalories(updateDishDto.calories());
        }
        if (updateDishDto.carbs() != null) {
            dish.setCarbs(updateDishDto.carbs());
        }
        if (updateDishDto.fat() != null) {
            dish.setFat(updateDishDto.fat());
        }
        if (updateDishDto.protein() != null) {
            dish.setProtein(updateDishDto.protein());
        }

        Dish updatedDish = dishRepository.save(dish);
        return Optional.of(mapToGetDishDto(updatedDish));
    }

    /**
     * Get a dish by ID.
     * @param dishId the ID of the dish to retrieve
     * @param userId the ID of the user requesting the dish
     * @return the dish as a DTO, or empty if the dish doesn't exist or doesn't belong to the user
     */
    public Optional<GetDishDto> getDishById(UUID dishId, UUID userId) {
        Optional<Dish> dishOptional = dishRepository.findById(dishId);
        if (dishOptional.isEmpty() || !dishOptional.get().getUser().getId().equals(userId)) {
            return Optional.empty();
        }

        return Optional.of(mapToGetDishDto(dishOptional.get()));
    }

    /**
     * Get all dishes for a user.
     * @param userId the ID of the user
     * @return a list of dishes as DTOs
     */
    public List<GetDishDto> getAllDishesForUser(UUID userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return List.of();
        }

        return dishRepository.findByUser(userOptional.get()).stream()
                .map(this::mapToGetDishDto)
                .collect(Collectors.toList());
    }

    /**
     * Delete a dish.
     * @param dishId the ID of the dish to delete
     * @param userId the ID of the user deleting the dish
     * @return true if the dish was deleted, false if the dish doesn't exist or doesn't belong to the user
     */
    public boolean deleteDish(UUID dishId, UUID userId) {
        Optional<Dish> dishOptional = dishRepository.findById(dishId);
        if (dishOptional.isEmpty() || !dishOptional.get().getUser().getId().equals(userId)) {
            return false;
        }

        dishRepository.delete(dishOptional.get());
        return true;
    }

    /**
     * Search for dishes by name for a user.
     * @param name the name to search for
     * @param userId the ID of the user
     * @return a list of dishes as DTOs
     */
    public List<GetDishDto> searchDishesByName(String name, UUID userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return List.of();
        }

        return dishRepository.findByNameContainingIgnoreCaseAndUser(name, userOptional.get()).stream()
                .map(this::mapToGetDishDto)
                .collect(Collectors.toList());
    }

    /**
     * Map a Dish entity to a GetDishDto.
     * @param dish the dish entity
     * @return the dish DTO
     */
    private GetDishDto mapToGetDishDto(Dish dish) {
        return new GetDishDto(
                dish.getId(),
                dish.getName(),
                dish.getDescription(),
                dish.getCalories(),
                dish.getCarbs(),
                dish.getFat(),
                dish.getProtein(),
                dish.getUser().getId()
        );
    }
}