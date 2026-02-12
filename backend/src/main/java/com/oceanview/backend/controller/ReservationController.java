package com.oceanview.backend.controller;

import com.oceanview.backend.model.Reservation;
import com.oceanview.backend.service.ReservationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "http://localhost:5173") // Vite dev server
public class ReservationController {

    private final ReservationService service;

    public ReservationController(ReservationService service) {
        this.service = service;
    }

    @GetMapping
    public List<Reservation> getAllReservations() {
        return service.getAllReservations();
    }

    @PostMapping
    public Reservation addReservation(@RequestBody Reservation reservation) {
        return service.addReservation(reservation);
    }

    @GetMapping("/{id}")
    public Reservation getReservation(@PathVariable String id) {
        return service.getReservation(id);
    }
}