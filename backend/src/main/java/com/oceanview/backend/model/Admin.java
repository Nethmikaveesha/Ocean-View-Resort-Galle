package com.oceanview.backend.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "admins")
public class Admin {

    @Id
    private String id;
    @NotBlank(message = "Username is required")
    @Size(min = 2, max = 50)
    private String username;
    @NotBlank(message = "Password hash is required")
    private String passwordHash;  // bcrypt-encoded
    @NotBlank(message = "Role is required")
    private String role;  // ADMIN, MANAGER, RECEPTIONIST

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
