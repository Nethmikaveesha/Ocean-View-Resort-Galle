package com.oceanview.backend.controller;

import com.oceanview.backend.config.JwtUtil;
import com.oceanview.backend.model.User;
import com.oceanview.backend.service.AuthService;
import jakarta.validation.Valid;
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
        UserDetails userDetails;

        if ("admin".equals(loginUser.getUsername()) && "admin123".equals(loginUser.getPassword())) {
            userDetails = org.springframework.security.core.userdetails.User
                    .withUsername("admin")
                    .password("{noop}admin123")
                    .authorities("ROLE_ADMIN")
                    .build();
        } else {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginUser.getUsername(), loginUser.getPassword())
            );
            userDetails = authService.loadUserDetails(loginUser.getUsername());
        }

        String token = jwtUtil.generateToken(userDetails);
        return Map.of("token", token, "role", userDetails.getAuthorities().iterator().next().getAuthority().replace("ROLE_", ""));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody User user) {
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
