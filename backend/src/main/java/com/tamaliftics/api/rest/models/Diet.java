package com.tamaliftics.api.rest.models;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Entity representing a diet in the system.
 * A diet has a name, description, and a list of meals.
 */
@Entity
@Table(name = "diets")
public class Diet {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "diet_id")
    private List<Meal> meals = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public Diet() {
    }

    public Diet(String name, String description, User user) {
        this.name = name;
        this.description = description;
        this.user = user;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<Meal> getMeals() {
        return meals;
    }

    public void setMeals(List<Meal> meals) {
        this.meals.clear();
        if (meals != null) {
            this.meals.addAll(meals);
        }
    }

    public void addMeal(Meal meal) {
        this.meals.add(meal);
    }

    public void removeMeal(Meal meal) {
        this.meals.remove(meal);
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    /**
     * Get the breakfast meal from the diet.
     * @return the breakfast meal, or null if not found
     */
    public Meal getBreakfast() {
        return meals.stream()
                .filter(meal -> meal.getType() == MealType.BREAKFAST)
                .findFirst()
                .orElse(null);
    }

    /**
     * Get the lunch meal from the diet.
     * @return the lunch meal, or null if not found
     */
    public Meal getLunch() {
        return meals.stream()
                .filter(meal -> meal.getType() == MealType.LUNCH)
                .findFirst()
                .orElse(null);
    }

    /**
     * Get the dinner meal from the diet.
     * @return the dinner meal, or null if not found
     */
    public Meal getDinner() {
        return meals.stream()
                .filter(meal -> meal.getType() == MealType.DINNER)
                .findFirst()
                .orElse(null);
    }

    /**
     * Get the snacks meal from the diet.
     * @return the snacks meal, or null if not found
     */
    public Meal getSnacks() {
        return meals.stream()
                .filter(meal -> meal.getType() == MealType.SNACKS)
                .findFirst()
                .orElse(null);
    }

    /**
     * Calculate the total calories of the diet.
     * @return the total calories
     */
    public double getTotalCalories() {
        return meals.stream().mapToDouble(Meal::getTotalCalories).sum();
    }

    /**
     * Calculate the total carbs of the diet.
     * @return the total carbs
     */
    public double getTotalCarbs() {
        return meals.stream().mapToDouble(Meal::getTotalCarbs).sum();
    }

    /**
     * Calculate the total fat of the diet.
     * @return the total fat
     */
    public double getTotalFat() {
        return meals.stream().mapToDouble(Meal::getTotalFat).sum();
    }

    /**
     * Calculate the total protein of the diet.
     * @return the total protein
     */
    public double getTotalProtein() {
        return meals.stream().mapToDouble(Meal::getTotalProtein).sum();
    }
}
