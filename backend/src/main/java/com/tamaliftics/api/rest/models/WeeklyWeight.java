package com.tamaliftics.api.rest.models;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.UUID;

/**
 * Entity representing a weekly weight average for a user.
 */
@Entity
@Table(name = "weekly_weights")
public class WeeklyWeight {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "week_number", nullable = false)
    private int weekNumber;

    @Column(nullable = false)
    private int year;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "average_weight", nullable = false)
    private double averageWeight;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public WeeklyWeight() {
    }

    public WeeklyWeight(int weekNumber, int year, LocalDate startDate, LocalDate endDate, double averageWeight, User user) {
        this.weekNumber = weekNumber;
        this.year = year;
        this.startDate = startDate;
        this.endDate = endDate;
        this.averageWeight = averageWeight;
        this.user = user;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public int getWeekNumber() {
        return weekNumber;
    }

    public void setWeekNumber(int weekNumber) {
        this.weekNumber = weekNumber;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public double getAverageWeight() {
        return averageWeight;
    }

    public void setAverageWeight(double averageWeight) {
        this.averageWeight = averageWeight;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    /**
     * Check if a date falls within this week.
     * @param date the date to check
     * @return true if the date is within this week, false otherwise
     */
    public boolean containsDate(LocalDate date) {
        return !date.isBefore(startDate) && !date.isAfter(endDate);
    }
}