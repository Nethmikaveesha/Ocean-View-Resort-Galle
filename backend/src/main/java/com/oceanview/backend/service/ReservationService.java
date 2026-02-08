package com.oceanview.backend.service;

import com.oceanview.backend.model.Reservation;
import com.oceanview.backend.repository.ReservationRepository;
import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
public class ReservationService {

    private final ReservationRepository repository;

    public ReservationService(ReservationRepository repository) {
        this.repository = repository;
    }

    public Reservation addReservation(Reservation reservation) {
        // Auto-generate reservation number
        reservation.setReservationNumber(UUID.randomUUID().toString());

        // Calculate total bill
        long nights = ChronoUnit.DAYS.between(reservation.getCheckIn(), reservation.getCheckOut());
        double rate = switch (reservation.getRoomType()) {
            case "Single" -> 10000;
            case "Double" -> 15000;
            case "Deluxe" -> 25000;
            default -> 0;
        };
        reservation.setTotalBill(nights * rate);

        return repository.save(reservation);
    }

    public Reservation getReservation(String id) {
        return repository.findById(id).orElse(null);
    }
}
