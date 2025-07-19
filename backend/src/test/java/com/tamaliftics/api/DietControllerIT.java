package com.tamaliftics.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tamaliftics.api.rest.models.dtos.diet.GetDietDto;
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
public class DietControllerIT {

    private final MockMvc mockMvc;
    private final ObjectMapper objectMapper;

    @Autowired
    public DietControllerIT(MockMvc mockMvc) {
        this.mockMvc = mockMvc;
        this.objectMapper = new ObjectMapper();
        // Configure ObjectMapper to handle Java 8 date/time types
        objectMapper.findAndRegisterModules();
    }

    @Test
    public void testCreateGetUpdateDeleteDiet() throws Exception {
        // Login with existing user
        String bearerToken = AuthenticationHelper.loginUser(mockMvc, "tamalito", "123456");

        // Create a diet
        String createDietDtoJson = new String(Files.readAllBytes(Path.of("src/test/resources/diet/create/createDietDto.json")));
        
        MvcResult createResult = mockMvc.perform(MockMvcRequestBuilders.post("/diets")
                .header("Authorization", bearerToken)
                .contentType("application/json")
                .content(createDietDtoJson))
                .andExpect(status().isCreated())
                .andReturn();
        
        // Extract the created diet
        String createResponseJson = createResult.getResponse().getContentAsString();
        GetDietDto createdDiet = objectMapper.readValue(createResponseJson, GetDietDto.class);
        UUID dietId = createdDiet.id();
        
        // Get the diet by ID
        mockMvc.perform(MockMvcRequestBuilders.get("/diets/" + dietId)
                .header("Authorization", bearerToken))
                .andExpect(status().isOk());
        
        // Get all diets
        mockMvc.perform(MockMvcRequestBuilders.get("/diets")
                .header("Authorization", bearerToken))
                .andExpect(status().isOk());
        
        // Search for diets by name
        mockMvc.perform(MockMvcRequestBuilders.get("/diets/search")
                .param("name", "Test")
                .header("Authorization", bearerToken))
                .andExpect(status().isOk());
        
        // Update the diet
        String updateDietDtoJson = new String(Files.readAllBytes(Path.of("src/test/resources/diet/update/updateDietDto.json")));
        // Replace the placeholder ID with the actual ID
        updateDietDtoJson = updateDietDtoJson.replace("00000000-0000-0000-0000-000000000000", dietId.toString());
        
        mockMvc.perform(MockMvcRequestBuilders.put("/diets")
                .header("Authorization", bearerToken)
                .contentType("application/json")
                .content(updateDietDtoJson))
                .andExpect(status().isOk());
        
        // Delete the diet
        mockMvc.perform(MockMvcRequestBuilders.delete("/diets/" + dietId)
                .header("Authorization", bearerToken))
                .andExpect(status().isOk());
        
        // Verify the diet was deleted
        mockMvc.perform(MockMvcRequestBuilders.get("/diets/" + dietId)
                .header("Authorization", bearerToken))
                .andExpect(status().isNotFound());
    }
}