package com.tamaliftics.api.rest.models;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Entity representing an exercise in the system.
 * An exercise has a name, description, category, and a list of track points.
 */
@Entity
@Table(name = "exercises")
public class Exercise {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private ExerciseCategory category;

    @OneToMany(mappedBy = "exercise", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ExerciseTrackPoint> trackPoints = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public Exercise() {
    }

    public Exercise(String name, String description, ExerciseCategory category, User user) {
        this.name = name;
        this.description = description;
        this.category = category;
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

    public ExerciseCategory getCategory() {
        return category;
    }

    public void setCategory(ExerciseCategory category) {
        this.category = category;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<ExerciseTrackPoint> getTrackPoints() {
        return trackPoints;
    }

    public void setTrackPoints(List<ExerciseTrackPoint> trackPoints) {
        this.trackPoints = trackPoints;
    }

    public void addTrackPoint(ExerciseTrackPoint trackPoint) {
        trackPoints.add(trackPoint);
        trackPoint.setExercise(this);
    }

    public void removeTrackPoint(ExerciseTrackPoint trackPoint) {
        trackPoints.remove(trackPoint);
        trackPoint.setExercise(null);
    }
}
