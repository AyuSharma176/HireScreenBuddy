package com.ayush.hirescreenbuddy.controller;

import com.ayush.hirescreenbuddy.model.User;
import com.ayush.hirescreenbuddy.repository.UserRepository;
import com.ayush.hirescreenbuddy.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

/**
 * Authentication Controller - Handles user login and registration.
 * Provides endpoints for user registration and login with JWT token generation.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    /**
     * Register a new user with email and password.
     * Validates that email doesn't already exist in the system.
     *
     * @param body Request body containing email, password, and name
     * @return ResponseEntity with JWT token and user details
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");
        String name = body.get("name");

        // Check if email already exists
        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email already exists"));
        }

        // Create and save new user with encrypted password
        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setName(name);
        userRepository.save(user);

        // Generate JWT token for automatic login after registration
        String token = jwtUtil.generateToken(email);
        return ResponseEntity.ok(Map.of(
                "token", token,
                "name", name,
                "email", email
        ));
    }

    /**
     * Authenticate user with email and password.
     * Returns JWT token upon successful authentication.
     *
     * @param body Request body containing email and password
     * @return ResponseEntity with JWT token and user details, or error message
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");

        Optional<User> userOpt = userRepository.findByEmail(email);

        // Validate email exists and password matches
        if (userOpt.isEmpty() ||
                !passwordEncoder.matches(password, userOpt.get().getPassword())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Invalid email or password"));
        }

        // Generate JWT token for authenticated session
        String token = jwtUtil.generateToken(email);
        return ResponseEntity.ok(Map.of(
                "token", token,
                "name", userOpt.get().getName(),
                "email", email
        ));
    }
}