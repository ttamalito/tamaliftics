package com.tamaliftics.api.rest.repositories;

import com.tamaliftics.api.rest.models.Exercise;
import com.tamaliftics.api.rest.models.ExerciseTrackPoint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

/**
 * Repository for ExerciseTrackPoint entities.
 */
@Repository
public interface ExerciseTrackPointRepository extends JpaRepository<ExerciseTrackPoint, UUID> {
    
    /**
     * Find all track points for an exercise.
     * @param exercise the exercise
     * @return a list of track points
     */
    List<ExerciseTrackPoint> findByExercise(Exercise exercise);
    
    /**
     * Find all track points for an exercise ID.
     * @param exerciseId the exercise ID
     * @return a list of track points
     */
    List<ExerciseTrackPoint> findByExerciseId(UUID exerciseId);
    
    /**
     * Find all track points for a list of exercise IDs.
     * @param exerciseIds the list of exercise IDs
     * @return a list of track points
     */
    List<ExerciseTrackPoint> findByExerciseIdIn(List<UUID> exerciseIds);
    
    /**
     * Find all track points for an exercise on a specific date.
     * @param exercise the exercise
     * @param date the date
     * @return a list of track points
     */
    List<ExerciseTrackPoint> findByExerciseAndDate(Exercise exercise, LocalDate date);
    
    /**
     * Find all track points for an exercise between two dates.
     * @param exercise the exercise
     * @param startDate the start date (inclusive)
     * @param endDate the end date (inclusive)
     * @return a list of track points
     */
    List<ExerciseTrackPoint> findByExerciseAndDateBetween(Exercise exercise, LocalDate startDate, LocalDate endDate);
    
    /**
     * Find all track points for an exercise ID between two dates.
     * @param exerciseId the exercise ID
     * @param startDate the start date (inclusive)
     * @param endDate the end date (inclusive)
     * @return a list of track points
     */
    List<ExerciseTrackPoint> findByExerciseIdAndDateBetween(UUID exerciseId, LocalDate startDate, LocalDate endDate);
}