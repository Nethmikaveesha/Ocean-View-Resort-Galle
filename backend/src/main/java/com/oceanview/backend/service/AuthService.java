package com.oceanview.backend.service;

import com.oceanview.backend.model.User;
import com.oceanview.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository repo;

    public User register(User user) {
        user.setRole("CUSTOMER");
        return repo.save(user);
    }

    public boolean validateAdmin(String u, String p) {
        return u.equals("admin") && p.equals("admin123");
    }
}
