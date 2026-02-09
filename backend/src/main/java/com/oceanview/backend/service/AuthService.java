package com.oceanview.backend.service;

import com.oceanview.backend.model.User;
import com.oceanview.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository repo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User register(User user) {
        Optional<User> existing = repo.findByUsername(user.getUsername());
        if (existing.isPresent()) {
            throw new IllegalArgumentException("Username already taken");
        }
        user.setRole("CUSTOMER");
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return repo.save(user);
    }

    public boolean validateAdmin(String u, String p) {
        return u.equals("admin") && p.equals("admin123");
    }
}
