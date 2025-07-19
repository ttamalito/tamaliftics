package com.tamaliftics.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tamaliftics.api.rest.models.dtos.weight.GetDailyWeightDto;
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
public class DailyWeightControllerIT {

    private final MockMvc mockMvc;
    private final ObjectMapper objectMapper;

    @Autowired
    public DailyWeightControllerIT(MockMvc mockMvc) {
        this.mockMvc = mockMvc;
        this.objectMapper = new ObjectMapper();
        // Configure ObjectMapper to handle Java 8 date/time types
        objectMapper.findAndRegisterModules();
    }

    @Test
    public void testCreateGetUpdateDeleteDailyWeight() throws Exception {
        // Login with existing user
        String bearerToken = AuthenticationHelper.loginUser(mockMvc, "tamalito", "123456");

        // Create a daily weight record
        String createDailyWeightDtoJson = new String(Files.readAllBytes(Path.of("src/test/resources/daily-weight/create/createDailyWeightDto.json")));
        
        MvcResult createResult = mockMvc.perform(MockMvcRequestBuilders.post("/daily-weights")
                .header("Authorization", bearerToken)
                .contentType("application/json")
                .content(createDailyWeightDtoJson))
                .andExpect(status().isCreated())
                .andReturn();
        
        // Extract the created daily weight record
        String createResponseJson = createResult.getResponse().getContentAsString();
        GetDailyWeightDto createdDailyWeight = objectMapper.readValue(createResponseJson, GetDailyWeightDto.class);
        UUID dailyWeightId = createdDailyWeight.id();
        
        // Get the daily weight record by ID
        mockMvc.perform(MockMvcRequestBuilders.get("/daily-weights/" + dailyWeightId)
                .header("Authorization", bearerToken))
                .andExpect(status().isOk());
        
        // Get all daily weight records
        mockMvc.perform(MockMvcRequestBuilders.get("/daily-weights")
                .header("Authorization", bearerToken))
                .andExpect(status().isOk());
        
        // Get daily weight records in a date range
        LocalDate startDate = LocalDate.now().minusDays(7);
        LocalDate endDate = LocalDate.now();
        mockMvc.perform(MockMvcRequestBuilders.get("/daily-weights/range")
                .param("startDate", startDate.format(DateTimeFormatter.ISO_DATE))
                .param("endDate", endDate.format(DateTimeFormatter.ISO_DATE))
                .header("Authorization", bearerToken))
                .andExpect(status().isOk());
        
        // Update the daily weight record
        String updateDailyWeightDtoJson = new String(Files.readAllBytes(Path.of("src/test/resources/daily-weight/update/updateDailyWeightDto.json")));
        // Replace the placeholder ID with the actual ID
        updateDailyWeightDtoJson = updateDailyWeightDtoJson.replace("00000000-0000-0000-0000-000000000000", dailyWeightId.toString());
        
        mockMvc.perform(MockMvcRequestBuilders.put("/daily-weights")
                .header("Authorization", bearerToken)
                .contentType("application/json")
                .content(updateDailyWeightDtoJson))
                .andExpect(status().isOk());
        
        // Delete the daily weight record
        mockMvc.perform(MockMvcRequestBuilders.delete("/daily-weights/" + dailyWeightId)
                .header("Authorization", bearerToken))
                .andExpect(status().isOk());
        
        // Verify the daily weight record was deleted
        mockMvc.perform(MockMvcRequestBuilders.get("/daily-weights/" + dailyWeightId)
                .header("Authorization", bearerToken))
                .andExpect(status().isNotFound());
    }
}