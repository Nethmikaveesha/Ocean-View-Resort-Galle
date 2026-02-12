package com.oceanview.backend.controller;

import com.oceanview.backend.model.Reservation;
import com.oceanview.backend.service.ReservationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "http://localhost:5173")
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
    public ResponseEntity<?> getMyReservations(@RequestParam(required = false) String username) {
        if (username == null || username.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username required"));
        }
        return ResponseEntity.ok(service.getReservationsByCustomer(username));
    }

    @GetMapping("/availability")
    public ResponseEntity<Map<String, Boolean>> checkAvailability(
            @RequestParam String roomType,
            @RequestParam String checkIn,
            @RequestParam String checkOut) {
        LocalDate ci = LocalDate.parse(checkIn);
        LocalDate co = LocalDate.parse(checkOut);
        boolean available = service.checkAvailability(roomType, ci, co);
        return ResponseEntity.ok(Map.of("available", available));
    }

    @PostMapping
    public ResponseEntity<?> addReservation(@Valid @RequestBody Reservation reservation) {
        try {
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
