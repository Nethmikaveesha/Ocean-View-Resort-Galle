package com.oceanview.backend.controller;

import com.oceanview.backend.model.User;
import com.oceanview.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final UserRepository userRepository;

    public CustomerController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<User> getAllCustomers() {
        return userRepository.findAll().stream()
                .filter(u -> "CUSTOMER".equals(u.getRole()))
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCustomer(@PathVariable String id) {
        Optional<User> user = userRepository.findById(id);
        return user.isPresent() && "CUSTOMER".equals(user.get().getRole())
                ? ResponseEntity.ok(user.get())
                : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCustomer(@PathVariable String id, @RequestBody User user) {
        Optional<User> existing = userRepository.findById(id);
        if (existing.isEmpty() || !"CUSTOMER".equals(existing.get().getRole())) {
            return ResponseEntity.notFound().build();
        }
        User u = existing.get();
        if (user.getName() != null) u.setName(user.getName());
        if (user.getAddress() != null) u.setAddress(user.getAddress());
        if (user.getContactNumber() != null) u.setContactNumber(user.getContactNumber());
        return ResponseEntity.ok(userRepository.save(u));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCustomer(@PathVariable String id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isEmpty() || !"CUSTOMER".equals(user.get().getRole())) {
            return ResponseEntity.notFound().build();
        }
        userRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
