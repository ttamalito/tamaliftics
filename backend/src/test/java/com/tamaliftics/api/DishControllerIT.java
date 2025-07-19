package com.tamaliftics.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tamaliftics.api.rest.models.dtos.dish.GetDishDto;
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
public class DishControllerIT {

    private final MockMvc mockMvc;
    private final ObjectMapper objectMapper;

    @Autowired
    public DishControllerIT(MockMvc mockMvc) {
        this.mockMvc = mockMvc;
        this.objectMapper = new ObjectMapper();
        // Configure ObjectMapper to handle Java 8 date/time types
        objectMapper.findAndRegisterModules();
    }

    @Test
    public void testCreateGetUpdateDeleteDish() throws Exception {
        // Login with existing user
        String bearerToken = AuthenticationHelper.loginUser(mockMvc, "tamalito", "123456");

        // Create a dish
        String createDishDtoJson = new String(Files.readAllBytes(Path.of("src/test/resources/dish/create/createDishDto.json")));
        
        MvcResult createResult = mockMvc.perform(MockMvcRequestBuilders.post("/dishes")
                .header("Authorization", bearerToken)
                .contentType("application/json")
                .content(createDishDtoJson))
                .andExpect(status().isCreated())
                .andReturn();
        
        // Extract the created dish
        String createResponseJson = createResult.getResponse().getContentAsString();
        GetDishDto createdDish = objectMapper.readValue(createResponseJson, GetDishDto.class);
        UUID dishId = createdDish.id();
        
        // Get the dish by ID
        mockMvc.perform(MockMvcRequestBuilders.get("/dishes/" + dishId)
                .header("Authorization", bearerToken))
                .andExpect(status().isOk());
        
        // Get all dishes
        mockMvc.perform(MockMvcRequestBuilders.get("/dishes")
                .header("Authorization", bearerToken))
                .andExpect(status().isOk());
        
        // Search for dishes by name
        mockMvc.perform(MockMvcRequestBuilders.get("/dishes/search")
                .param("name", "Test")
                .header("Authorization", bearerToken))
                .andExpect(status().isOk());
        
        // Update the dish
        String updateDishDtoJson = new String(Files.readAllBytes(Path.of("src/test/resources/dish/update/updateDishDto.json")));
        // Replace the placeholder ID with the actual ID
        updateDishDtoJson = updateDishDtoJson.replace("00000000-0000-0000-0000-000000000000", dishId.toString());
        
        mockMvc.perform(MockMvcRequestBuilders.put("/dishes")
                .header("Authorization", bearerToken)
                .contentType("application/json")
                .content(updateDishDtoJson))
                .andExpect(status().isOk());
        
        // Delete the dish
        mockMvc.perform(MockMvcRequestBuilders.delete("/dishes/" + dishId)
                .header("Authorization", bearerToken))
                .andExpect(status().isOk());
        
        // Verify the dish was deleted
        mockMvc.perform(MockMvcRequestBuilders.get("/dishes/" + dishId)
                .header("Authorization", bearerToken))
                .andExpect(status().isNotFound());
    }
}