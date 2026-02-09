package com.oceanview.backend.controller;

import com.oceanview.backend.config.JwtUtil;
import com.oceanview.backend.model.User; // your model
import com.oceanview.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

//    @Autowired
//    private AuthenticationManager authenticationManager;
@Autowired
private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

        @Autowired
        private AuthService authService;

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody User loginUser) {
        // Authenticate user
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginUser.getUsername(), loginUser.getPassword())
        );

        // Create UserDetails for JWT using fully qualified class name
        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername(loginUser.getUsername())
                .password(loginUser.getPassword())
                .authorities("ROLE_USER") // Set proper roles here
                .build();

        // Generate JWT token
        String token = jwtUtil.generateToken(userDetails);

        return Map.of("token", token);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User created = authService.register(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "Registration failed"));
        }
    }
}
