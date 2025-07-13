package com.tamaliftics.api.rest.controllers;

import com.tamaliftics.api.rest.models.Role;
import com.tamaliftics.api.rest.models.User;
import com.tamaliftics.api.rest.models.dtos.auth.AuthResponseDto;
import com.tamaliftics.api.rest.models.dtos.auth.LoginRequestDto;
import com.tamaliftics.api.rest.models.dtos.auth.SignupRequestDto;
import com.tamaliftics.api.rest.services.JwtService;
import com.tamaliftics.api.rest.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

/**
 * Controller for handling authentication requests
 */
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;

    @Autowired
    public AuthController(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    /**
     * Endpoint for user login
     * @param loginRequestDto the login request containing username and password
     * @return JWT token and user information if authentication is successful, error otherwise
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto loginRequestDto) {
        Optional<User> userOptional = userService.authenticateUserByUsername(
                loginRequestDto.username(),
                loginRequestDto.password()
        );

        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }

        User user = userOptional.get();
        String token = jwtService.generateToken(user);

        AuthResponseDto authResponseDto = new AuthResponseDto(
                token,
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole().name()
        );

        return ResponseEntity.ok(authResponseDto);
    }

    /**
     * Endpoint for user signup
     * @param signupRequestDto the signup request containing user information
     * @return JWT token and user information if signup is successful, error otherwise
     */
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequestDto signupRequestDto) {
        // Check if user can be created (username and email are unique)
        if (!userService.userCanBeCreated(signupRequestDto.username(), signupRequestDto.email())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Username or email already exists");
        }

        // Create the user
        var userId = userService.createUser(
                signupRequestDto.username(),
                signupRequestDto.password(),
                signupRequestDto.email(),
                Role.USER
        );

        // Get the created user
        Optional<User> userOptional = userService.getUserById(userId);
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create user");
        }

        User user = userOptional.get();
        
        // Update first name and last name if provided
        if (signupRequestDto.firstName() != null && !signupRequestDto.firstName().isEmpty()) {
            user.setFirstName(signupRequestDto.firstName());
        }
        
        if (signupRequestDto.lastName() != null && !signupRequestDto.lastName().isEmpty()) {
            user.setLastName(signupRequestDto.lastName());
        }
        
        // Save the updated user
        userService.updateUser(user);

        // Generate JWT token
        String token = jwtService.generateToken(user);

        AuthResponseDto authResponseDto = new AuthResponseDto(
                token,
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole().name()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(authResponseDto);
    }

    /**
     * Test endpoint to check if authentication is working
     * @return a simple message
     */
    @GetMapping("/ping")
    public ResponseEntity<String> ping() {
        return ResponseEntity.ok("Auth controller is working!");
    }
}