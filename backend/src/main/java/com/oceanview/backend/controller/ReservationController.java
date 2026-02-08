package com.oceanview.backend.controller;

import com.oceanview.backend.model.Reservation;
import com.oceanview.backend.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin
public class ReservationController {

    @Autowired
    private ReservationService service;

    @PostMapping
    public Reservation addReservation(@RequestBody Reservation r) {
        return service.createReservation(r);
    }

    @GetMapping("/{id}")
    public Reservation getReservation(@PathVariable String id) {
        return service.getReservation(id);
    }
}
