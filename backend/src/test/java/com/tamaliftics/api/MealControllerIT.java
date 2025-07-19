package com.tamaliftics.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tamaliftics.api.rest.models.dtos.dish.GetDishDto;
import com.tamaliftics.api.rest.models.dtos.meal.GetMealDto;
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
public class MealControllerIT {

    private final MockMvc mockMvc;
    private final ObjectMapper objectMapper;

    @Autowired
    public MealControllerIT(MockMvc mockMvc) {
        this.mockMvc = mockMvc;
        this.objectMapper = new ObjectMapper();
        // Configure ObjectMapper to handle Java 8 date/time types
        objectMapper.findAndRegisterModules();
    }

    @Test
    public void testCreateGetUpdateDeleteMeal() throws Exception {
        // Login with existing user
        String bearerToken = AuthenticationHelper.loginUser(mockMvc, "tamalito", "123456");

        // First, create a dish to use with the meal
        String createDishDtoJson = new String(Files.readAllBytes(Path.of("src/test/resources/dish/create/createDishDto.json")));
        
        MvcResult createDishResult = mockMvc.perform(MockMvcRequestBuilders.post("/dishes")
                .header("Authorization", bearerToken)
                .contentType("application/json")
                .content(createDishDtoJson))
                .andExpect(status().isCreated())
                .andReturn();
        
        // Extract the created dish
        String createDishResponseJson = createDishResult.getResponse().getContentAsString();
        GetDishDto createdDish = objectMapper.readValue(createDishResponseJson, GetDishDto.class);
        UUID dishId = createdDish.id();
        
        try {
            // Create a meal
            String createMealDtoJson = new String(Files.readAllBytes(Path.of("src/test/resources/meal/create/createMealDto.json")));
            
            MvcResult createMealResult = mockMvc.perform(MockMvcRequestBuilders.post("/meals")
                    .header("Authorization", bearerToken)
                    .contentType("application/json")
                    .content(createMealDtoJson))
                    .andExpect(status().isCreated())
                    .andReturn();
            
            // Extract the created meal
            String createMealResponseJson = createMealResult.getResponse().getContentAsString();
            GetMealDto createdMeal = objectMapper.readValue(createMealResponseJson, GetMealDto.class);
            UUID mealId = createdMeal.id();
            
            try {
                // Get the meal by ID
                mockMvc.perform(MockMvcRequestBuilders.get("/meals/" + mealId)
                        .header("Authorization", bearerToken))
                        .andExpect(status().isOk());
                
                // Get all meals
                mockMvc.perform(MockMvcRequestBuilders.get("/meals")
                        .header("Authorization", bearerToken))
                        .andExpect(status().isOk());
                
                // Add a dish to the meal
                mockMvc.perform(MockMvcRequestBuilders.post("/meals/" + mealId + "/dishes/" + dishId)
                        .header("Authorization", bearerToken))
                        .andExpect(status().isOk());
                
                // Update the meal
                String updateMealDtoJson = new String(Files.readAllBytes(Path.of("src/test/resources/meal/update/updateMealDto.json")));
                // Replace the placeholder ID with the actual ID
                updateMealDtoJson = updateMealDtoJson.replace("00000000-0000-0000-0000-000000000000", mealId.toString());
                
                mockMvc.perform(MockMvcRequestBuilders.put("/meals")
                        .header("Authorization", bearerToken)
                        .contentType("application/json")
                        .content(updateMealDtoJson))
                        .andExpect(status().isOk());
                
                // Remove the dish from the meal
                mockMvc.perform(MockMvcRequestBuilders.delete("/meals/" + mealId + "/dishes/" + dishId)
                        .header("Authorization", bearerToken))
                        .andExpect(status().isOk());
                
                // Delete the meal
                mockMvc.perform(MockMvcRequestBuilders.delete("/meals/" + mealId)
                        .header("Authorization", bearerToken))
                        .andExpect(status().isOk());
                
                // Verify the meal was deleted
                mockMvc.perform(MockMvcRequestBuilders.get("/meals/" + mealId)
                        .header("Authorization", bearerToken))
                        .andExpect(status().isNotFound());
            } finally {
                // Attempt to delete the meal if it still exists (cleanup)
                try {
                    mockMvc.perform(MockMvcRequestBuilders.delete("/meals/" + mealId)
                            .header("Authorization", bearerToken));
                } catch (Exception e) {
                    // Ignore exceptions during cleanup
                }
            }
        } finally {
            // Delete the dish
            mockMvc.perform(MockMvcRequestBuilders.delete("/dishes/" + dishId)
                    .header("Authorization", bearerToken));
        }
    }
}