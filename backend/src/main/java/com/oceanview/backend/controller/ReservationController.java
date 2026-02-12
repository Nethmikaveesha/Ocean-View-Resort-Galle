package com.oceanview.backend.controller;

import com.oceanview.backend.model.Reservation;
import com.oceanview.backend.service.ReservationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService service;

    public ReservationController(ReservationService service) {
        this.service = service;
    }

    @GetMapping
    public List<Reservation> getAllReservations() {
        return service.getAllReservations();
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyReservations(@RequestParam(required = false) String username, Authentication auth) {
        String customerUsername = username;
        if (auth != null && auth.isAuthenticated() && auth.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_CUSTOMER"))) {
            customerUsername = auth.getName();
        }
        if (customerUsername == null || customerUsername.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username required"));
        }
        return ResponseEntity.ok(service.getReservationsByCustomer(customerUsername));
    }

    @GetMapping("/availability")
    public ResponseEntity<?> checkAvailability(
            @RequestParam String roomType,
            @RequestParam String checkIn,
            @RequestParam String checkOut) {
        try {
            LocalDate ci = LocalDate.parse(checkIn);
            LocalDate co = LocalDate.parse(checkOut);
            if (ci.isBefore(LocalDate.now())) {
                return ResponseEntity.badRequest().body(Map.of("available", false, "message", "Check-in cannot be in the past"));
            }
            if (!co.isAfter(ci)) {
                return ResponseEntity.badRequest().body(Map.of("available", false, "message", "Check-out must be after check-in"));
            }
            boolean available = service.checkAvailability(roomType, ci, co);
            return ResponseEntity.ok(Map.of("available", available));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("available", false, "message", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> addReservation(@Valid @RequestBody Reservation reservation, Authentication auth) {
        try {
            if (auth != null && auth.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_CUSTOMER"))) {
                reservation.setCustomerUsername(auth.getName());
            }
            Reservation saved = service.addReservation(reservation);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getReservation(@PathVariable String id) {
        Reservation r = service.getReservation(id);
        return r != null ? ResponseEntity.ok(r) : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateReservation(@PathVariable String id, @Valid @RequestBody Reservation reservation) {
        Reservation updated = service.updateReservation(id, reservation);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReservation(@PathVariable String id) {
        service.deleteReservation(id);
        return ResponseEntity.ok(Map.of("message", "Reservation deleted"));
    }
}
