package com.tamaliftics.api.rest.models;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.UUID;

/**
 * Entity representing a tracking point for an exercise.
 * An exercise track point records the date, reps, sets, and description for a specific exercise.
 */
@Entity
@Table(name = "exercise_track_points")
public class ExerciseTrackPoint {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private LocalDate date;

    @Column(name = "reps_count", nullable = false)
    private int repsCount;

    @Column(name = "sets_count", nullable = false)
    private int setsCount;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne
    @JoinColumn(name = "exercise_id", nullable = false)
    private Exercise exercise;

    public ExerciseTrackPoint() {
    }

    public ExerciseTrackPoint(LocalDate date, int repsCount, int setsCount, String description, Exercise exercise) {
        this.date = date;
        this.repsCount = repsCount;
        this.setsCount = setsCount;
        this.description = description;
        this.exercise = exercise;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public int getRepsCount() {
        return repsCount;
    }

    public void setRepsCount(int repsCount) {
        this.repsCount = repsCount;
    }

    public int getSetsCount() {
        return setsCount;
    }

    public void setSetsCount(int setsCount) {
        this.setsCount = setsCount;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Exercise getExercise() {
        return exercise;
    }

    public void setExercise(Exercise exercise) {
        this.exercise = exercise;
    }
}