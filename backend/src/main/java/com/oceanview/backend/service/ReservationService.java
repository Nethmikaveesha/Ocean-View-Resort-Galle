package com.oceanview.backend.service;

import com.oceanview.backend.model.Reservation;
import com.oceanview.backend.model.Room;
import com.oceanview.backend.repository.ReservationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ReservationService {

    private final ReservationRepository repository;
    private final RoomService roomService;

    public ReservationService(ReservationRepository repository, RoomService roomService) {
        this.repository = repository;
        this.roomService = roomService;
    }

    public List<Reservation> getAllReservations() {
        return repository.findAll();
    }

    public List<Reservation> getReservationsByCustomer(String customerUsername) {
        return repository.findByCustomerUsername(customerUsername);
    }

    public Reservation addReservation(Reservation reservation) {
        LocalDate today = LocalDate.now();
        if (reservation.getCheckIn().isBefore(today)) {
            throw new IllegalArgumentException("Check-in date cannot be in the past");
        }
        if (!reservation.getCheckOut().isAfter(reservation.getCheckIn())) {
            throw new IllegalArgumentException("Check-out date must be after check-in");
        }
        if (!checkAvailability(reservation.getRoomType(), reservation.getCheckIn(), reservation.getCheckOut())) {
            throw new IllegalArgumentException("Room not available for selected dates");
        }

        String resNum = "RES" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        reservation.setReservationNumber(resNum);

        double ratePerNight = getRoomRate(reservation.getRoomType());
        long nights = ChronoUnit.DAYS.between(reservation.getCheckIn(), reservation.getCheckOut());
        if (nights < 1) nights = 1;
        reservation.setTotalBill(nights * ratePerNight);

        return repository.save(reservation);
    }

    private double getRoomRate(String roomType) {
        List<Room> rooms = roomService.getAllRooms().stream()
                .filter(r -> r.getType().equalsIgnoreCase(roomType))
                .toList();
        return rooms.isEmpty() ? getDefaultRate(roomType) : rooms.get(0).getPrice();
    }

    private double getDefaultRate(String roomType) {
        return switch (roomType) {
            case "Single" -> 10000;
            case "Double" -> 15000;
            case "Deluxe" -> 25000;
            default -> 10000;
        };
    }

    public Reservation getReservation(String id) {
        return repository.findById(id).orElse(null);
    }

    public Reservation updateReservation(String id, Reservation reservation) {
        Optional<Reservation> existing = repository.findById(id);
        if (existing.isEmpty()) return null;
        Reservation r = existing.get();
        r.setGuestName(reservation.getGuestName());
        r.setAddress(reservation.getAddress());
        r.setContactNumber(reservation.getContactNumber());
        r.setRoomType(reservation.getRoomType());
        r.setCheckIn(reservation.getCheckIn());
        r.setCheckOut(reservation.getCheckOut());
        r.setCheckInTime(reservation.getCheckInTime());
        r.setCheckOutTime(reservation.getCheckOutTime());
        double ratePerNight = getRoomRate(reservation.getRoomType());
        long nights = ChronoUnit.DAYS.between(reservation.getCheckIn(), reservation.getCheckOut());
        if (nights < 1) nights = 1;
        r.setTotalBill(nights * ratePerNight);
        return repository.save(r);
    }

    public void deleteReservation(String id) {
        repository.deleteById(id);
    }

    public boolean checkAvailability(String roomType, LocalDate checkIn, LocalDate checkOut) {
        List<Room> availableRooms = roomService.getAllRooms().stream()
                .filter(r -> r.getType().equalsIgnoreCase(roomType) && r.isAvailable())
                .toList();
        if (availableRooms.isEmpty()) return false;

        List<Reservation> conflicting = repository.findAll().stream()
                .filter(res -> res.getRoomType().equalsIgnoreCase(roomType))
                .filter(res -> !(checkOut.isBefore(res.getCheckIn()) || checkIn.isAfter(res.getCheckOut())))
                .toList();
        return conflicting.size() < availableRooms.size();
    }
}
