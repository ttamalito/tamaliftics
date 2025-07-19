package com.tamaliftics.api;

import com.tamaliftics.api.utils.AuthenticationHelper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Optional;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthControllerIT {

    private final MockMvc mockMvc;

    @Autowired
    public AuthControllerIT(MockMvc mockMvc) {
        this.mockMvc = mockMvc;
    }

    @Test
    public void signUp() throws Exception {
        String createUserDtoJson = new String (Files.readAllBytes(Path.of("src/test/resources/user/createUser/createUserDto.json")));
//        CreateUserDto userSignupRequest = new CreateUserDto("test", "test", "test", "test@test.com");
//        String json = new ObjectMapper().writeValueAsString(userSignupRequest);
        String response = mockMvc.perform(MockMvcRequestBuilders.post("/auth/signup")
                        .contentType("application/json")
                        .content(createUserDtoJson))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        // Extract username from response
        //String username = response.split("\"username\":\"")[1].split("\"")[0];

        // Login with the created user
        String bearerToken = AuthenticationHelper.loginUser(mockMvc, "test", "test");

        // Delete the user using the username endpoint
        mockMvc.perform(MockMvcRequestBuilders.delete("/auth/delete/users/test")
                        .header("Authorization", bearerToken))
                .andExpect(status().isOk());
    }

    @Test
    public void deleteUserUnauthorized() throws Exception {
        // Try to delete a user without authentication
        mockMvc.perform(MockMvcRequestBuilders.delete("/auth/users/nonexistentuser"))
                .andExpect(status().isForbidden());
    }
}
