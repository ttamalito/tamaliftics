package com.tamaliftics.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tamaliftics.api.rest.models.dtos.exercise.GetExerciseDto;
import com.tamaliftics.api.rest.models.dtos.exercise.GetExerciseCategoryDto;
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
public class ExerciseControllerIT {

    private final MockMvc mockMvc;
    private final ObjectMapper objectMapper;

    @Autowired
    public ExerciseControllerIT(MockMvc mockMvc) {
        this.mockMvc = mockMvc;
        this.objectMapper = new ObjectMapper();
        // Configure ObjectMapper to handle Java 8 date/time types
        objectMapper.findAndRegisterModules();
    }

    @Test
    public void testCreateGetUpdateDeleteExercise() throws Exception {
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
            
            MvcResult createResult = mockMvc.perform(MockMvcRequestBuilders.post("/exercises")
                    .header("Authorization", bearerToken)
                    .contentType("application/json")
                    .content(createExerciseDtoJson))
                    .andExpect(status().isCreated())
                    .andReturn();
            
            // Extract the created exercise
            String createResponseJson = createResult.getResponse().getContentAsString();
            GetExerciseDto createdExercise = objectMapper.readValue(createResponseJson, GetExerciseDto.class);
            UUID exerciseId = createdExercise.id();
            
            try {
                // Get the exercise by ID
                mockMvc.perform(MockMvcRequestBuilders.get("/exercises/" + exerciseId)
                        .header("Authorization", bearerToken))
                        .andExpect(status().isOk());
                
                // Get all exercises
                mockMvc.perform(MockMvcRequestBuilders.get("/exercises")
                        .header("Authorization", bearerToken))
                        .andExpect(status().isOk());
                
                // Get exercises by category
                mockMvc.perform(MockMvcRequestBuilders.get("/exercises/category/" + categoryId)
                        .header("Authorization", bearerToken))
                        .andExpect(status().isOk());
                
                // Search for exercises by name
                mockMvc.perform(MockMvcRequestBuilders.get("/exercises/search")
                        .param("name", "Test")
                        .header("Authorization", bearerToken))
                        .andExpect(status().isOk());
                
                // Update the exercise
                String updateExerciseDtoJson = new String(Files.readAllBytes(Path.of("src/test/resources/exercise/update/updateExerciseDto.json")));
                // Replace the placeholder IDs with the actual IDs
                updateExerciseDtoJson = updateExerciseDtoJson.replace("00000000-0000-0000-0000-000000000000", exerciseId.toString());
                updateExerciseDtoJson = updateExerciseDtoJson.replaceAll("\"categoryId\": \"00000000-0000-0000-0000-000000000000\"", "\"categoryId\": \"" + categoryId.toString() + "\"");
                
                mockMvc.perform(MockMvcRequestBuilders.put("/exercises")
                        .header("Authorization", bearerToken)
                        .contentType("application/json")
                        .content(updateExerciseDtoJson))
                        .andExpect(status().isOk());
                
                // Delete the exercise
                mockMvc.perform(MockMvcRequestBuilders.delete("/exercises/" + exerciseId)
                        .header("Authorization", bearerToken))
                        .andExpect(status().isOk());
                
                // Verify the exercise was deleted
                mockMvc.perform(MockMvcRequestBuilders.get("/exercises/" + exerciseId)
                        .header("Authorization", bearerToken))
                        .andExpect(status().isNotFound());
            } finally {
                // Attempt to delete the exercise if it still exists (cleanup)
                try {
                    mockMvc.perform(MockMvcRequestBuilders.delete("/exercises/" + exerciseId)
                            .header("Authorization", bearerToken));
                } catch (Exception e) {
                    // Ignore exceptions during cleanup
                }
            }
        } finally {
            // Delete the exercise category
            mockMvc.perform(MockMvcRequestBuilders.delete("/exercise-categories/" + categoryId)
                    .header("Authorization", bearerToken));
        }
    }
}