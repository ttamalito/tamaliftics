package com.tamaliftics.api.rest.models;

/**
 * Enum representing the different types of workout plans.
 */
public enum WorkoutPlanType {
    PUSH_AND_PULL_1("PushAndPull 1"),
    PUSH_AND_PULL_2("PushAndPull 2"),
    LEGS_1("Legs 1"),
    LEGS_2("Legs 2"),
    ABS("Abs");

    private final String displayName;

    WorkoutPlanType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}