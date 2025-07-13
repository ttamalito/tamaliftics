package com.tamaliftics.api.rest.services;

import com.tamaliftics.api.rest.models.Day;
import com.tamaliftics.api.rest.models.Exercise;
import com.tamaliftics.api.rest.models.User;
import com.tamaliftics.api.rest.models.WorkoutPlan;
import com.tamaliftics.api.rest.models.dtos.exercise.GetExerciseDto;
import com.tamaliftics.api.rest.models.dtos.workout.CreateWorkoutPlanDto;
import com.tamaliftics.api.rest.models.dtos.workout.GetWorkoutPlanDto;
import com.tamaliftics.api.rest.models.dtos.workout.UpdateWorkoutPlanDto;
import com.tamaliftics.api.rest.repositories.ExerciseRepository;
import com.tamaliftics.api.rest.repositories.UserRepository;
import com.tamaliftics.api.rest.repositories.WorkoutPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service for handling workout plan-related operations.
 */
@Service
public class WorkoutPlanService {

    private final WorkoutPlanRepository workoutPlanRepository;
    private final ExerciseRepository exerciseRepository;
    private final UserRepository userRepository;
    private final ExerciseService exerciseService;

    @Autowired
    public WorkoutPlanService(WorkoutPlanRepository workoutPlanRepository,
                             ExerciseRepository exerciseRepository,
                             UserRepository userRepository,
                             ExerciseService exerciseService) {
        this.workoutPlanRepository = workoutPlanRepository;
        this.exerciseRepository = exerciseRepository;
        this.userRepository = userRepository;
        this.exerciseService = exerciseService;
    }

    /**
     * Create a new workout plan for a user.
     * @param createWorkoutPlanDto the DTO containing workout plan information
     * @param userId the ID of the user creating the workout plan
     * @return the created workout plan as a DTO, or empty if the user doesn't exist
     */
    public Optional<GetWorkoutPlanDto> createWorkoutPlan(CreateWorkoutPlanDto createWorkoutPlanDto, UUID userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return Optional.empty();
        }

        User user = userOptional.get();
        WorkoutPlan workoutPlan = new WorkoutPlan(
                createWorkoutPlanDto.type(),
                createWorkoutPlanDto.day(),
                createWorkoutPlanDto.description(),
                user
        );

        // Add exercises to the workout plan if exercise IDs are provided
        if (createWorkoutPlanDto.exerciseIds() != null && !createWorkoutPlanDto.exerciseIds().isEmpty()) {
            List<Exercise> exercises = exerciseRepository.findAllById(createWorkoutPlanDto.exerciseIds()).stream()
                    .filter(exercise -> exercise.getUser().getId().equals(userId))
                    .collect(Collectors.toList());
            workoutPlan.setExercises(exercises);
        }

        WorkoutPlan savedWorkoutPlan = workoutPlanRepository.save(workoutPlan);
        return Optional.of(mapToGetWorkoutPlanDto(savedWorkoutPlan));
    }

    /**
     * Update an existing workout plan.
     * @param updateWorkoutPlanDto the DTO containing updated workout plan information
     * @param userId the ID of the user updating the workout plan
     * @return the updated workout plan as a DTO, or empty if the plan doesn't exist or doesn't belong to the user
     */
    public Optional<GetWorkoutPlanDto> updateWorkoutPlan(UpdateWorkoutPlanDto updateWorkoutPlanDto, UUID userId) {
        Optional<WorkoutPlan> workoutPlanOptional = workoutPlanRepository.findById(updateWorkoutPlanDto.id());
        if (workoutPlanOptional.isEmpty() || !workoutPlanOptional.get().getUser().getId().equals(userId)) {
            return Optional.empty();
        }

        WorkoutPlan workoutPlan = workoutPlanOptional.get();
        if (updateWorkoutPlanDto.type() != null) {
            workoutPlan.setType(updateWorkoutPlanDto.type());
        }
        if (updateWorkoutPlanDto.day() != null) {
            workoutPlan.setDay(updateWorkoutPlanDto.day());
        }
        if (updateWorkoutPlanDto.description() != null) {
            workoutPlan.setDescription(updateWorkoutPlanDto.description());
        }

        // Update exercises if exercise IDs are provided
        if (updateWorkoutPlanDto.exerciseIds() != null) {
            List<Exercise> exercises = exerciseRepository.findAllById(updateWorkoutPlanDto.exerciseIds()).stream()
                    .filter(exercise -> exercise.getUser().getId().equals(userId))
                    .collect(Collectors.toList());
            workoutPlan.setExercises(exercises);
        }

        WorkoutPlan updatedWorkoutPlan = workoutPlanRepository.save(workoutPlan);
        return Optional.of(mapToGetWorkoutPlanDto(updatedWorkoutPlan));
    }

    /**
     * Get a workout plan by ID.
     * @param workoutPlanId the ID of the workout plan to retrieve
     * @param userId the ID of the user requesting the plan
     * @return the workout plan as a DTO, or empty if the plan doesn't exist or doesn't belong to the user
     */
    public Optional<GetWorkoutPlanDto> getWorkoutPlanById(UUID workoutPlanId, UUID userId) {
        Optional<WorkoutPlan> workoutPlanOptional = workoutPlanRepository.findById(workoutPlanId);
        if (workoutPlanOptional.isEmpty() || !workoutPlanOptional.get().getUser().getId().equals(userId)) {
            return Optional.empty();
        }

        return Optional.of(mapToGetWorkoutPlanDto(workoutPlanOptional.get()));
    }

    /**
     * Get all workout plans for a user.
     * @param userId the ID of the user
     * @return a list of workout plans as DTOs
     */
    public List<GetWorkoutPlanDto> getAllWorkoutPlansForUser(UUID userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return List.of();
        }

        return workoutPlanRepository.findByUser(userOptional.get()).stream()
                .map(this::mapToGetWorkoutPlanDto)
                .collect(Collectors.toList());
    }

    /**
     * Get workout plans for a specific day.
     * @param day the day of the week
     * @param userId the ID of the user
     * @return a list of workout plans as DTOs
     */
    public List<GetWorkoutPlanDto> getWorkoutPlansByDay(Day day, UUID userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return List.of();
        }

        return workoutPlanRepository.findAllByDayAndUser(day, userOptional.get()).stream()
                .map(this::mapToGetWorkoutPlanDto)
                .collect(Collectors.toList());
    }

    /**
     * Delete a workout plan.
     * @param workoutPlanId the ID of the workout plan to delete
     * @param userId the ID of the user deleting the plan
     * @return true if the plan was deleted, false if the plan doesn't exist or doesn't belong to the user
     */
    public boolean deleteWorkoutPlan(UUID workoutPlanId, UUID userId) {
        Optional<WorkoutPlan> workoutPlanOptional = workoutPlanRepository.findById(workoutPlanId);
        if (workoutPlanOptional.isEmpty() || !workoutPlanOptional.get().getUser().getId().equals(userId)) {
            return false;
        }

        workoutPlanRepository.delete(workoutPlanOptional.get());
        return true;
    }

    /**
     * Add an exercise to a workout plan.
     * @param workoutPlanId the ID of the workout plan
     * @param exerciseId the ID of the exercise to add
     * @param userId the ID of the user
     * @return the updated workout plan as a DTO, or empty if the plan or exercise doesn't exist or doesn't belong to the user
     */
    public Optional<GetWorkoutPlanDto> addExerciseToWorkoutPlan(UUID workoutPlanId, UUID exerciseId, UUID userId) {
        Optional<WorkoutPlan> workoutPlanOptional = workoutPlanRepository.findById(workoutPlanId);
        Optional<Exercise> exerciseOptional = exerciseRepository.findById(exerciseId);

        if (workoutPlanOptional.isEmpty() || exerciseOptional.isEmpty() || 
            !workoutPlanOptional.get().getUser().getId().equals(userId) || 
            !exerciseOptional.get().getUser().getId().equals(userId)) {
            return Optional.empty();
        }

        WorkoutPlan workoutPlan = workoutPlanOptional.get();
        Exercise exercise = exerciseOptional.get();
        workoutPlan.addExercise(exercise);

        WorkoutPlan updatedWorkoutPlan = workoutPlanRepository.save(workoutPlan);
        return Optional.of(mapToGetWorkoutPlanDto(updatedWorkoutPlan));
    }

    /**
     * Remove an exercise from a workout plan.
     * @param workoutPlanId the ID of the workout plan
     * @param exerciseId the ID of the exercise to remove
     * @param userId the ID of the user
     * @return the updated workout plan as a DTO, or empty if the plan doesn't exist or doesn't belong to the user
     */
    public Optional<GetWorkoutPlanDto> removeExerciseFromWorkoutPlan(UUID workoutPlanId, UUID exerciseId, UUID userId) {
        Optional<WorkoutPlan> workoutPlanOptional = workoutPlanRepository.findById(workoutPlanId);
        if (workoutPlanOptional.isEmpty() || !workoutPlanOptional.get().getUser().getId().equals(userId)) {
            return Optional.empty();
        }

        WorkoutPlan workoutPlan = workoutPlanOptional.get();
        workoutPlan.getExercises().removeIf(exercise -> exercise.getId().equals(exerciseId));

        WorkoutPlan updatedWorkoutPlan = workoutPlanRepository.save(workoutPlan);
        return Optional.of(mapToGetWorkoutPlanDto(updatedWorkoutPlan));
    }

    /**
     * Map a WorkoutPlan entity to a GetWorkoutPlanDto.
     * @param workoutPlan the workout plan entity
     * @return the workout plan DTO
     */
    private GetWorkoutPlanDto mapToGetWorkoutPlanDto(WorkoutPlan workoutPlan) {
        List<GetExerciseDto> exerciseDtos = workoutPlan.getExercises().stream()
                .map(exercise -> exerciseService.getExerciseById(exercise.getId(), workoutPlan.getUser().getId()))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .collect(Collectors.toList());

        return new GetWorkoutPlanDto(
                workoutPlan.getId(),
                workoutPlan.getType(),
                workoutPlan.getDay(),
                workoutPlan.getDescription(),
                exerciseDtos,
                workoutPlan.getUser().getId()
        );
    }
}