package com.oceanview.backend.controller;

import com.oceanview.backend.config.JwtUtil;
import com.oceanview.backend.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody com.oceanview.backend.model.User loginUser) {
        // Authenticate user
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginUser.getUsername(), loginUser.getPassword())
        );

        // Create UserDetails for JWT
        UserDetails userDetails = User.withUsername(loginUser.getUsername())
                .password(loginUser.getPassword())
                .authorities("ROLE_USER") // Set proper roles here
                .build();

        // Generate JWT token
        String token = jwtUtil.generateToken(userDetails);

        return Map.of("token", token);
    }
}
