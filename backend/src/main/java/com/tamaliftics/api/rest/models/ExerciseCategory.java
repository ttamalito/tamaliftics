package com.tamaliftics.api.rest.models;

import jakarta.persistence.*;
import java.util.UUID;

/**
 * Entity representing an exercise category in the system.
 * An exercise category is a grouping of exercises (e.g., Cardio, Strength, Flexibility).
 */
@Entity
@Table(name = "exercise_categories")
public class ExerciseCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public ExerciseCategory() {
    }

    public ExerciseCategory(String name, String description, User user) {
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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}