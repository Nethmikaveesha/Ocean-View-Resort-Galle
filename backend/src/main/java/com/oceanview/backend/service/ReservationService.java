package com.oceanview.backend.service;

import com.oceanview.backend.model.Reservation;
import com.oceanview.backend.model.Room;
import com.oceanview.backend.repository.ReservationRepository;
import com.oceanview.backend.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private RoomRepository roomRepository;

    // Add new reservation
    public Reservation addReservation(Reservation reservation) {
        // Generate unique reservation number
        reservation.setReservationNumber(UUID.randomUUID().toString().substring(0, 8).toUpperCase());

        // Validate dates
        if (reservation.getCheckInDate().isBefore(LocalDate.now())) {
            throw new RuntimeException("Check-in date cannot be in the past");
        }
        if (reservation.getCheckOutDate().isBefore(reservation.getCheckInDate())) {
            throw new RuntimeException("Check-out date must be after check-in date");
        }

        // Check room availability
        Optional<Room> roomOpt = roomRepository.findById(reservation.getRoom().getId());
        if (roomOpt.isEmpty() || !roomOpt.get().isAvailable()) {
            throw new RuntimeException("Room not available");
        }

        // Calculate total bill
        long days = reservation.getCheckOutDate().toEpochDay() - reservation.getCheckInDate().toEpochDay();
        reservation.setTotalBill(days * roomOpt.get().getPrice());

        // Save reservation
        Reservation saved = reservationRepository.save(reservation);

        // Mark room as unavailable
        Room room = roomOpt.get();
        room.setAvailable(false);
        roomRepository.save(room);

        return saved;
    }

    // Retrieve a single reservation by reservation number
    public Reservation getReservation(String reservationNumber) {
        return reservationRepository.findById(reservationNumber)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));
    }

    // Retrieve all reservations (for admin)
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }
}
