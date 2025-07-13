package com.tamaliftics.api.rest.models;

import jakarta.persistence.*;
import java.util.UUID;

/**
 * Entity representing a dish in the system.
 * A dish is a food item that can be part of a meal in a diet.
 */
@Entity
@Table(name = "dishes")
public class Dish {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private double calories;

    @Column(nullable = false)
    private double carbs;

    @Column(nullable = false)
    private double fat;

    @Column(nullable = false)
    private double protein;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public Dish() {
    }

    public Dish(String name, String description, double calories, double carbs, double fat, double protein, User user) {
        this.name = name;
        this.description = description;
        this.calories = calories;
        this.carbs = carbs;
        this.fat = fat;
        this.protein = protein;
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

    public double getCalories() {
        return calories;
    }

    public void setCalories(double calories) {
        this.calories = calories;
    }

    public double getCarbs() {
        return carbs;
    }

    public void setCarbs(double carbs) {
        this.carbs = carbs;
    }

    public double getFat() {
        return fat;
    }

    public void setFat(double fat) {
        this.fat = fat;
    }

    public double getProtein() {
        return protein;
    }

    public void setProtein(double protein) {
        this.protein = protein;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}