package com.oceanview.backend.config;

import com.oceanview.backend.config.Roles;
import com.oceanview.backend.model.Admin;
import com.oceanview.backend.repository.AdminRepository;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminDataLoader {

    @Bean
    public ApplicationRunner seedAdmin(AdminRepository adminRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (adminRepository.findByUsername("admin").isEmpty()) {
                Admin admin = new Admin();
                admin.setUsername("admin");
                admin.setPasswordHash(passwordEncoder.encode("admin123"));
                admin.setRole(Roles.ADMIN);
                adminRepository.save(admin);
            }
        };
    }
}
