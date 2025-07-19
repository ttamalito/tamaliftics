package com.tamaliftics.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tamaliftics.api.rest.models.dtos.weight.GetDailyWeightDto;
import com.tamaliftics.api.rest.models.dtos.weight.GetWeeklyWeightDto;
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
public class WeeklyWeightControllerIT {

    private final MockMvc mockMvc;
    private final ObjectMapper objectMapper;

    @Autowired
    public WeeklyWeightControllerIT(MockMvc mockMvc) {
        this.mockMvc = mockMvc;
        this.objectMapper = new ObjectMapper();
        // Configure ObjectMapper to handle Java 8 date/time types
        objectMapper.findAndRegisterModules();
    }

    @Test
    public void testGetWeeklyWeights() throws Exception {
        // Login with existing user
        String bearerToken = AuthenticationHelper.loginUser(mockMvc, "tamalito", "123456");

        // Create a daily weight record to trigger the creation of a weekly weight record
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
        
        try {
            // Get all weekly weights
            MvcResult getAllResult = mockMvc.perform(MockMvcRequestBuilders.get("/weekly-weights")
                    .header("Authorization", bearerToken))
                    .andExpect(status().isOk())
                    .andReturn();
            
            // Extract the weekly weights
            String getAllResponseJson = getAllResult.getResponse().getContentAsString();
            GetWeeklyWeightDto[] weeklyWeights = objectMapper.readValue(getAllResponseJson, GetWeeklyWeightDto[].class);
            
            // Ensure we have at least one weekly weight
            if (weeklyWeights.length > 0) {
                UUID weeklyWeightId = weeklyWeights[0].id();
                
                // Get the weekly weight by ID
                mockMvc.perform(MockMvcRequestBuilders.get("/weekly-weights/" + weeklyWeightId)
                        .header("Authorization", bearerToken))
                        .andExpect(status().isOk());
                
                // Get weekly weights by year
                int year = LocalDate.now().getYear();
                mockMvc.perform(MockMvcRequestBuilders.get("/weekly-weights/year/" + year)
                        .header("Authorization", bearerToken))
                        .andExpect(status().isOk());
                
                // Get weekly weights in a date range
                LocalDate startDate = LocalDate.now().minusDays(7);
                LocalDate endDate = LocalDate.now().plusDays(7);
                mockMvc.perform(MockMvcRequestBuilders.get("/weekly-weights/range")
                        .param("startDate", startDate.format(DateTimeFormatter.ISO_DATE))
                        .param("endDate", endDate.format(DateTimeFormatter.ISO_DATE))
                        .header("Authorization", bearerToken))
                        .andExpect(status().isOk());
                
                // Get weekly weight for a specific date
                LocalDate date = LocalDate.now();
                mockMvc.perform(MockMvcRequestBuilders.get("/weekly-weights/date")
                        .param("date", date.format(DateTimeFormatter.ISO_DATE))
                        .header("Authorization", bearerToken))
                        .andExpect(status().isOk());
            }
        } finally {
            // Clean up by deleting the daily weight record
            mockMvc.perform(MockMvcRequestBuilders.delete("/daily-weights/" + dailyWeightId)
                    .header("Authorization", bearerToken))
                    .andExpect(status().isOk());
        }
    }
}