package com.tamaliftics.api.rest.services;

import com.tamaliftics.api.rest.models.Role;
import com.tamaliftics.api.rest.models.User;
import com.tamaliftics.api.rest.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.context.annotation.Primary;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Primary
@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, @Lazy PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Creates a new user, by encoding the password and saving the user to the database
     * @param username
     * @param password
     * @param email
     * @param role
     * @return the id of the created user
     */
    public UUID createUser(
            String username,
            String password,
            String email,
            Role role) {

        String encodedPassword = passwordEncoder.encode(password);

        User user = new User(
                username,
                encodedPassword,
                email,
                role
        );

        User savedUser = userRepository.save(user);
        return savedUser.getId();
    }

    /**
     * Authenticates a user by checking if the username exists and the password matches
     * @param username
     * @param password
     * @return Optional containing the user if authentication is successful, empty otherwise
     */
    public Optional<User> authenticateUserByUsername(String username, String password) {
        Optional<User> user = userRepository.findByUsername(username);
        return user.isPresent() && passwordEncoder.matches(password, user.get().getPassword()) ? user : Optional.empty();
    }

    /**
     * Authenticates a user by checking if the email exists and the password matches
     * @param email
     * @param password
     * @return Optional containing the user if authentication is successful, empty otherwise
     */
    public Optional<User> authenticateUserByEmail(String email, String password) {
        Optional<User> user = userRepository.findByEmail(email);
        return user.isPresent() && passwordEncoder.matches(password, user.get().getPassword()) ? user : Optional.empty();
    }

    /**
     * Checks if a user can be created by checking if the username and email are unique
     * @param username
     * @param email
     * @return true if the user can be created, false otherwise
     */
    public boolean userCanBeCreated(String username, String email) {
        return userRepository.findByUsername(username).isEmpty() && userRepository.findByEmail(email).isEmpty();
    }

    /**
     * Updates a user in the database
     * @param user
     * @return true if the update was successful
     */
    public boolean updateUser(User user) {
        userRepository.save(user);
        return true;
    }

    /**
     * Gets a user by id
     * @param id
     * @return Optional containing the user if found, empty otherwise
     */
    public Optional<User> getUserById(UUID id) {
        return userRepository.findById(id);
    }

    /**
     * Checks if a user exists by id
     * @param id
     * @return true if the user exists, false otherwise
     */
    public boolean userExists(UUID id) {
        return userRepository.existsById(id);
    }

    /**
     * Gets a user by username
     * @param username
     * @return Optional containing the user if found, empty otherwise
     */
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    /**
     * Loads a user by username for Spring Security
     * @param username
     * @return UserDetails
     * @throws UsernameNotFoundException if the user is not found
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
    }

    /**
     * Deletes a user from the database
     * @param user
     */
    public void deleteUser(User user) {
        userRepository.delete(user);
    }

    /**
     * Gets all users from the database
     * @return a list of all users
     */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
