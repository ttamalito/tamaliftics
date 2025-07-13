package com.tamaliftics.api.rest.models;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Entity representing a meal in a diet.
 * A meal has a type (breakfast, lunch, dinner, snacks) and a list of dishes.
 */
@Entity
@Table(name = "meals")
public class Meal {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MealType type;

    @ManyToMany
    @JoinTable(
        name = "meal_dishes",
        joinColumns = @JoinColumn(name = "meal_id"),
        inverseJoinColumns = @JoinColumn(name = "dish_id")
    )
    private List<Dish> dishes = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public Meal() {
    }

    public Meal(MealType type, User user) {
        this.type = type;
        this.user = user;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public MealType getType() {
        return type;
    }

    public void setType(MealType type) {
        this.type = type;
    }

    public List<Dish> getDishes() {
        return dishes;
    }

    public void setDishes(List<Dish> dishes) {
        this.dishes = dishes;
    }

    public void addDish(Dish dish) {
        this.dishes.add(dish);
    }

    public void removeDish(Dish dish) {
        this.dishes.remove(dish);
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    /**
     * Calculate the total calories of the meal.
     * @return the total calories
     */
    public double getTotalCalories() {
        return dishes.stream().mapToDouble(Dish::getCalories).sum();
    }

    /**
     * Calculate the total carbs of the meal.
     * @return the total carbs
     */
    public double getTotalCarbs() {
        return dishes.stream().mapToDouble(Dish::getCarbs).sum();
    }

    /**
     * Calculate the total fat of the meal.
     * @return the total fat
     */
    public double getTotalFat() {
        return dishes.stream().mapToDouble(Dish::getFat).sum();
    }

    /**
     * Calculate the total protein of the meal.
     * @return the total protein
     */
    public double getTotalProtein() {
        return dishes.stream().mapToDouble(Dish::getProtein).sum();
    }
}