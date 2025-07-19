package com.tamaliftics.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tamaliftics.api.rest.models.dtos.exercise.GetExerciseDto;
import com.tamaliftics.api.rest.models.dtos.exercise.GetExerciseCategoryDto;
import com.tamaliftics.api.rest.models.dtos.trackpoint.GetExerciseTrackPointDto;
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
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class ExerciseTrackPointControllerIT {

    private final MockMvc mockMvc;
    private final ObjectMapper objectMapper;

    @Autowired
    public ExerciseTrackPointControllerIT(MockMvc mockMvc) {
        this.mockMvc = mockMvc;
        this.objectMapper = new ObjectMapper();
        // Configure ObjectMapper to handle Java 8 date/time types
        objectMapper.findAndRegisterModules();
    }

    @Test
    public void testCreateGetUpdateDeleteExerciseTrackPoint() throws Exception {
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
                // Create a track point for the exercise
                String createTrackPointDtoJson = new String(Files.readAllBytes(Path.of("src/test/resources/exercise-track-point/create/createExerciseTrackPointDto.json")));
                // Replace the placeholder exercise ID with the actual ID
                createTrackPointDtoJson = createTrackPointDtoJson.replace("00000000-0000-0000-0000-000000000000", exerciseId.toString());
                
                MvcResult createTrackPointResult = mockMvc.perform(MockMvcRequestBuilders.post("/exercise-track-points")
                        .header("Authorization", bearerToken)
                        .contentType("application/json")
                        .content(createTrackPointDtoJson))
                        .andExpect(status().isCreated())
                        .andReturn();
                
                // Extract the created track point
                String createTrackPointResponseJson = createTrackPointResult.getResponse().getContentAsString();
                GetExerciseTrackPointDto createdTrackPoint = objectMapper.readValue(createTrackPointResponseJson, GetExerciseTrackPointDto.class);
                UUID trackPointId = createdTrackPoint.id();
                
                try {
                    // Get the track point by ID
                    mockMvc.perform(MockMvcRequestBuilders.get("/exercise-track-points/" + trackPointId)
                            .header("Authorization", bearerToken))
                            .andExpect(status().isOk());
                    
                    // Get track points for the exercise
                    mockMvc.perform(MockMvcRequestBuilders.get("/exercise-track-points/exercise/" + exerciseId)
                            .header("Authorization", bearerToken))
                            .andExpect(status().isOk());
                    
                    // Get track points for multiple exercises
                    mockMvc.perform(MockMvcRequestBuilders.post("/exercise-track-points/exercises")
                            .header("Authorization", bearerToken)
                            .contentType("application/json")
                            .content("[\"" + exerciseId + "\"]"))
                            .andExpect(status().isOk());
                    
                    // Get track points for the exercise between dates
                    LocalDate startDate = LocalDate.of(2023, 1, 1);
                    LocalDate endDate = LocalDate.now();
                    mockMvc.perform(MockMvcRequestBuilders.get("/exercise-track-points/exercise/" + exerciseId + "/date-range")
                            .param("startDate", startDate.format(DateTimeFormatter.ISO_DATE))
                            .param("endDate", endDate.format(DateTimeFormatter.ISO_DATE))
                            .header("Authorization", bearerToken))
                            .andExpect(status().isOk());
                    
                    // Update the track point
                    String updateTrackPointDtoJson = new String(Files.readAllBytes(Path.of("src/test/resources/exercise-track-point/update/updateExerciseTrackPointDto.json")));
                    // Replace the placeholder IDs with the actual IDs
                    updateTrackPointDtoJson = updateTrackPointDtoJson.replace("00000000-0000-0000-0000-000000000000", trackPointId.toString());
                    updateTrackPointDtoJson = updateTrackPointDtoJson.replaceAll("\"exerciseId\": \"00000000-0000-0000-0000-000000000000\"", "\"exerciseId\": \"" + exerciseId.toString() + "\"");
                    
                    mockMvc.perform(MockMvcRequestBuilders.put("/exercise-track-points")
                            .header("Authorization", bearerToken)
                            .contentType("application/json")
                            .content(updateTrackPointDtoJson))
                            .andExpect(status().isOk());
                    
                    // Delete the track point
                    mockMvc.perform(MockMvcRequestBuilders.delete("/exercise-track-points/" + trackPointId)
                            .header("Authorization", bearerToken))
                            .andExpect(status().isOk());
                    
                    // Verify the track point was deleted
                    mockMvc.perform(MockMvcRequestBuilders.get("/exercise-track-points/" + trackPointId)
                            .header("Authorization", bearerToken))
                            .andExpect(status().isNotFound());
                } finally {
                    // Attempt to delete the track point if it still exists (cleanup)
                    try {
                        mockMvc.perform(MockMvcRequestBuilders.delete("/exercise-track-points/" + trackPointId)
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