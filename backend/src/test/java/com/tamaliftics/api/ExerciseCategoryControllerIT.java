package com.tamaliftics.api;

import com.fasterxml.jackson.databind.ObjectMapper;
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
public class ExerciseCategoryControllerIT {

    private final MockMvc mockMvc;
    private final ObjectMapper objectMapper;

    @Autowired
    public ExerciseCategoryControllerIT(MockMvc mockMvc) {
        this.mockMvc = mockMvc;
        this.objectMapper = new ObjectMapper();
        // Configure ObjectMapper to handle Java 8 date/time types
        objectMapper.findAndRegisterModules();
    }

    @Test
    public void testCreateGetUpdateDeleteExerciseCategory() throws Exception {
        // Login with existing user
        String bearerToken = AuthenticationHelper.loginUser(mockMvc, "tamalito", "123456");

        // Create an exercise category
        String createExerciseCategoryDtoJson = new String(Files.readAllBytes(Path.of("src/test/resources/exercise-category/create/createExerciseCategoryDto.json")));
        
        MvcResult createResult = mockMvc.perform(MockMvcRequestBuilders.post("/exercise-categories")
                .header("Authorization", bearerToken)
                .contentType("application/json")
                .content(createExerciseCategoryDtoJson))
                .andExpect(status().isCreated())
                .andReturn();
        
        // Extract the created exercise category
        String createResponseJson = createResult.getResponse().getContentAsString();
        GetExerciseCategoryDto createdExerciseCategory = objectMapper.readValue(createResponseJson, GetExerciseCategoryDto.class);
        UUID exerciseCategoryId = createdExerciseCategory.id();
        
        // Get the exercise category by ID
        mockMvc.perform(MockMvcRequestBuilders.get("/exercise-categories/" + exerciseCategoryId)
                .header("Authorization", bearerToken))
                .andExpect(status().isOk());
        
        // Get all exercise categories
        mockMvc.perform(MockMvcRequestBuilders.get("/exercise-categories")
                .header("Authorization", bearerToken))
                .andExpect(status().isOk());
        
        // Search for exercise categories by name
        mockMvc.perform(MockMvcRequestBuilders.get("/exercise-categories/search")
                .param("name", "Test")
                .header("Authorization", bearerToken))
                .andExpect(status().isOk());
        
        // Update the exercise category
        String updateExerciseCategoryDtoJson = new String(Files.readAllBytes(Path.of("src/test/resources/exercise-category/update/updateExerciseCategoryDto.json")));
        // Replace the placeholder ID with the actual ID
        updateExerciseCategoryDtoJson = updateExerciseCategoryDtoJson.replace("00000000-0000-0000-0000-000000000000", exerciseCategoryId.toString());
        
        mockMvc.perform(MockMvcRequestBuilders.put("/exercise-categories")
                .header("Authorization", bearerToken)
                .contentType("application/json")
                .content(updateExerciseCategoryDtoJson))
                .andExpect(status().isOk());
        
        // Delete the exercise category
        mockMvc.perform(MockMvcRequestBuilders.delete("/exercise-categories/" + exerciseCategoryId)
                .header("Authorization", bearerToken))
                .andExpect(status().isOk());
        
        // Verify the exercise category was deleted
        mockMvc.perform(MockMvcRequestBuilders.get("/exercise-categories/" + exerciseCategoryId)
                .header("Authorization", bearerToken))
                .andExpect(status().isNotFound());
    }
}