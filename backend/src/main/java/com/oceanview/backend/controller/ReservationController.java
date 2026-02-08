package com.oceanview.backend.controller;

import com.oceanview.backend.model.Reservation;
import com.oceanview.backend.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    // Add new reservation
    @PostMapping
    public Reservation addReservation(@RequestBody Reservation reservation) {
        return reservationService.addReservation(reservation);
    }

    // Get a single reservation by reservation number
    @GetMapping("/{reservationNumber}")
    public Reservation getReservation(@PathVariable String reservationNumber) {
        return reservationService.getReservation(reservationNumber);
    }

    // Get all reservations (for admin)
    @GetMapping
    public List<Reservation> getAllReservations() {
        return reservationService.getAllReservations();
    }
}
