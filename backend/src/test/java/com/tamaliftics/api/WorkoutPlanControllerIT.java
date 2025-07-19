package com.tamaliftics.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tamaliftics.api.rest.models.Day;
import com.tamaliftics.api.rest.models.dtos.exercise.GetExerciseDto;
import com.tamaliftics.api.rest.models.dtos.exercise.GetExerciseCategoryDto;
import com.tamaliftics.api.rest.models.dtos.workout.GetWorkoutPlanDto;
import com.tamaliftics.api.utils.AuthenticationHelper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class WorkoutPlanControllerIT {

    private final MockMvc mockMvc;
    private final ObjectMapper objectMapper;

    @Autowired
    public WorkoutPlanControllerIT(MockMvc mockMvc) {
        this.mockMvc = mockMvc;
        this.objectMapper = new ObjectMapper();
        // Configure ObjectMapper to handle Java 8 date/time types
        objectMapper.findAndRegisterModules();
    }

    @Test
    public void testCreateGetUpdateDeleteWorkoutPlan() throws Exception {
        // Login with existing user
        String bearerToken = AuthenticationHelper.loginUser(mockMvc, "tamalito", "123456");

        // First, create an exercise category to use for the exercise
        String createExerciseCategoryDtoJson = new String(Files.readAllBytes(Path.of("src/test/resources/exercise-category/create/createExerciseCategoryDto.json")));
        
        MvcResult createCategoryResult = mockMvc.perform(MockMvcRequestBuilders.post("/exercise-categories")
                .header("Authorization", bearerToken)
                .contentType("application/json")
                .content(createExerciseCategoryDtoJson))
                .andExpect(status().isCreated())
                .andReturn();
        
        // Extract the created exercise category
        String createCategoryResponseJson = createCategoryResult.getResponse().getContentAsString();
        GetExerciseCategoryDto createdCategory = objectMapper.readValue(createCategoryResponseJson, GetExerciseCategoryDto.class);
        UUID categoryId = createdCategory.id();
        
        try {
            // Create an exercise using the created category
            String createExerciseDtoJson = new String(Files.readAllBytes(Path.of("src/test/resources/exercise/create/createExerciseDto.json")));
            // Replace the placeholder category ID with the actual ID
            createExerciseDtoJson = createExerciseDtoJson.replace("00000000-0000-0000-0000-000000000000", categoryId.toString());
            
            MvcResult createExerciseResult = mockMvc.perform(MockMvcRequestBuilders.post("/exercises")
                    .header("Authorization", bearerToken)
                    .contentType("application/json")
                    .content(createExerciseDtoJson))
                    .andExpect(status().isCreated())
                    .andReturn();
            
            // Extract the created exercise
            String createExerciseResponseJson = createExerciseResult.getResponse().getContentAsString();
            GetExerciseDto createdExercise = objectMapper.readValue(createExerciseResponseJson, GetExerciseDto.class);
            UUID exerciseId = createdExercise.id();
            
            try {
                // Create a workout plan
                String createWorkoutPlanDtoJson = new String(Files.readAllBytes(Path.of("src/test/resources/workout-plan/create/createWorkoutPlanDto.json")));
                
                MvcResult createWorkoutPlanResult = mockMvc.perform(MockMvcRequestBuilders.post("/workout-plans")
                        .header("Authorization", bearerToken)
                        .contentType("application/json")
                        .content(createWorkoutPlanDtoJson))
                        .andExpect(status().isCreated())
                        .andReturn();
                
                // Extract the created workout plan
                String createWorkoutPlanResponseJson = createWorkoutPlanResult.getResponse().getContentAsString();
                GetWorkoutPlanDto createdWorkoutPlan = objectMapper.readValue(createWorkoutPlanResponseJson, GetWorkoutPlanDto.class);
                UUID workoutPlanId = createdWorkoutPlan.id();
                
                try {
                    // Get the workout plan by ID
                    mockMvc.perform(MockMvcRequestBuilders.get("/workout-plans/" + workoutPlanId)
                            .header("Authorization", bearerToken))
                            .andExpect(status().isOk());
                    
                    // Get all workout plans
                    mockMvc.perform(MockMvcRequestBuilders.get("/workout-plans")
                            .header("Authorization", bearerToken))
                            .andExpect(status().isOk());
                    
                    // Get workout plans by day
                    mockMvc.perform(MockMvcRequestBuilders.get("/workout-plans/day/" + Day.MONDAY)
                            .header("Authorization", bearerToken))
                            .andExpect(status().isOk());
                    
                    // Add an exercise to the workout plan
                    mockMvc.perform(MockMvcRequestBuilders.post("/workout-plans/" + workoutPlanId + "/exercises/" + exerciseId)
                            .header("Authorization", bearerToken))
                            .andExpect(status().isOk());
                    
                    // Update the workout plan
                    String updateWorkoutPlanDtoJson = new String(Files.readAllBytes(Path.of("src/test/resources/workout-plan/update/updateWorkoutPlanDto.json")));
                    // Replace the placeholder ID with the actual ID
                    updateWorkoutPlanDtoJson = updateWorkoutPlanDtoJson.replace("00000000-0000-0000-0000-000000000000", workoutPlanId.toString());
                    
                    mockMvc.perform(MockMvcRequestBuilders.put("/workout-plans")
                            .header("Authorization", bearerToken)
                            .contentType("application/json")
                            .content(updateWorkoutPlanDtoJson))
                            .andExpect(status().isOk());
                    
                    // Remove the exercise from the workout plan
                    mockMvc.perform(MockMvcRequestBuilders.delete("/workout-plans/" + workoutPlanId + "/exercises/" + exerciseId)
                            .header("Authorization", bearerToken))
                            .andExpect(status().isOk());
                    
                    // Delete the workout plan
                    mockMvc.perform(MockMvcRequestBuilders.delete("/workout-plans/" + workoutPlanId)
                            .header("Authorization", bearerToken))
                            .andExpect(status().isOk());
                    
                    // Verify the workout plan was deleted
                    mockMvc.perform(MockMvcRequestBuilders.get("/workout-plans/" + workoutPlanId)
                            .header("Authorization", bearerToken))
                            .andExpect(status().isNotFound());
                } finally {
                    // Attempt to delete the workout plan if it still exists (cleanup)
                    try {
                        mockMvc.perform(MockMvcRequestBuilders.delete("/workout-plans/" + workoutPlanId)
                                .header("Authorization", bearerToken));
                    } catch (Exception e) {
                        // Ignore exceptions during cleanup
                    }
                }
            } finally {
                // Delete the exercise
                mockMvc.perform(MockMvcRequestBuilders.delete("/exercises/" + exerciseId)
                        .header("Authorization", bearerToken));
            }
        } finally {
            // Delete the exercise category
            mockMvc.perform(MockMvcRequestBuilders.delete("/exercise-categories/" + categoryId)
                    .header("Authorization", bearerToken));
        }
    }
}