package com.tamaliftics.api.rest.models;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.UUID;

/**
 * Entity representing a daily weight record for a user.
 */
@Entity
@Table(name = "daily_weights")
public class DailyWeight {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private double weight;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public DailyWeight() {
    }

    public DailyWeight(LocalDate date, double weight, User user) {
        this.date = date;
        this.weight = weight;
        this.user = user;
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

    public double getWeight() {
        return weight;
    }

    public void setWeight(double weight) {
        this.weight = weight;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    /**
     * Get the week number of the year for this weight record.
     * @return the week number
     */
    public int getWeekNumber() {
        return date.get(java.time.temporal.WeekFields.of(java.util.Locale.getDefault()).weekOfWeekBasedYear());
    }

    /**
     * Get the year for this weight record.
     * @return the year
     */
    public int getYear() {
        return date.getYear();
    }
}