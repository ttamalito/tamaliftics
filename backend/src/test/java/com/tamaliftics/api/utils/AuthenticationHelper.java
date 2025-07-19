package com.tamaliftics.api.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tamaliftics.api.rest.models.dtos.auth.AuthResponseDto;
import com.tamaliftics.api.rest.models.dtos.auth.LoginRequestDto;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.util.Optional;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class AuthenticationHelper {

    /**
     * Logs in a user and returns "Bearer jwtToken"
     * @param mockMvc
     * @param username
     * @param password
     * @return "Bearer jwt"
     * @throws Exception
     */
    public static String loginUser(MockMvc mockMvc, String username, String password) throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();

        String json = objectMapper.writeValueAsString(new LoginRequestDto(username, password));

        ResultActions result = mockMvc.perform(MockMvcRequestBuilders.post("/auth/login")
                        .contentType("application/json")
                        .content(json))
                .andExpect(status().isOk());

        String jwtToken = objectMapper.readValue(result.andReturn().getResponse().getContentAsString(), AuthResponseDto.class).token();
        return "Bearer " + jwtToken;
    }
}
