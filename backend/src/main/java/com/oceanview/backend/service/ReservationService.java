package com.oceanview.backend.service;

import com.oceanview.backend.model.Reservation;
import com.oceanview.backend.repository.ReservationRepository;
import com.oceanview.backend.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepo;

    @Autowired
    private RoomRepository roomRepo;

    public Reservation createReservation(Reservation r) {

        r.setReservationNumber("RES-" +
                UUID.randomUUID().toString().substring(0, 8));

        Room room = roomRepo.findByRoomType(r.getRoomType());
        long nights = ChronoUnit.DAYS.between(
                r.getCheckInDate(), r.getCheckOutDate());

        r.setTotalBill(nights * room.getPrice());

        return reservationRepo.save(r);
    }

    public Reservation getReservation(String id) {
        return reservationRepo.findById(id).orElse(null);
    }
}
