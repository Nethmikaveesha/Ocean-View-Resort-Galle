package com.oceanview.backend.controller;

import com.oceanview.backend.config.Roles;
import com.oceanview.backend.model.Admin;
import com.oceanview.backend.repository.AdminRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admins")
public class AdminController {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminController(AdminRepository adminRepository, PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public List<AdminSummary> getAllAdmins() {
        return adminRepository.findAll().stream()
                .map(a -> new AdminSummary(a.getId(), a.getUsername(), a.getRole()))
                .toList();
    }

    public record AdminSummary(String id, String username, String role) {}

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAdmin(@PathVariable String id) {
        if (!adminRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        adminRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Admin deleted"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAdmin(@PathVariable String id, @Valid @RequestBody AdminUpdateRequest request) {
        return adminRepository.findById(id)
                .map(admin -> {
                    if (request.getRole() != null && !request.getRole().isBlank()) {
                        admin.setRole(request.getRole().toUpperCase());
                    }
                    if (request.getPassword() != null && !request.getPassword().isBlank() && request.getPassword().length() >= 6) {
                        admin.setPasswordHash(passwordEncoder.encode(request.getPassword()));
                    }
                    adminRepository.save(admin);
                    return ResponseEntity.ok(Map.of("message", "Admin updated"));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    public static class AdminUpdateRequest {
        private String role; // ADMIN, MANAGER, RECEPTIONIST
        @Size(min = 6, message = "Password must be at least 6 characters")
        private String password; // optional - only update if provided

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    @PostMapping
    public ResponseEntity<?> createAdmin(@Valid @RequestBody AdminCreateRequest request) {
        if (adminRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Username already taken"));
        }
        Admin admin = new Admin();
        admin.setUsername(request.getUsername());
        admin.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        admin.setRole(request.getRole() != null ? request.getRole().toUpperCase() : Roles.RECEPTIONIST);
        adminRepository.save(admin);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Admin created"));
    }

    public static class AdminCreateRequest {
        @NotBlank
        @Size(min = 2, max = 50)
        private String username;
        @NotBlank
        @Size(min = 6)
        private String password;
        private String role; // ADMIN, MANAGER, RECEPTIONIST

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
    }
}
