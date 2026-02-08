package com.oceanview.backend.controller;

import com.oceanview.backend.config.JwtUtil;
import com.oceanview.backend.model.User;
import com.oceanview.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    @Autowired
    private AuthService service;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return service.register(user);
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody User user) {

        if (service.validateAdmin(user.getUsername(), user.getPassword())) {
            return Map.of("token", jwtUtil.generateToken("admin"));
        }

        return Map.of("token", jwtUtil.generateToken(user.getUsername()));
    }
}
