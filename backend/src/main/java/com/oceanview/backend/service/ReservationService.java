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
        if (reservation.getRoomId() == null || reservation.getRoomId().isBlank()) {
            throw new IllegalArgumentException("Room ID is required");
        }

        Room room = roomService.getRoomById(reservation.getRoomId())
                .orElseThrow(() -> new IllegalArgumentException("Room not found"));
        if (!room.isAvailable()) {
            throw new IllegalArgumentException("Room is not available for booking");
        }
        if (!isRoomAvailableForDates(reservation.getRoomId(), reservation.getCheckIn(), reservation.getCheckOut(), null)) {
            throw new IllegalArgumentException("Room not available for selected dates");
        }

        String resNum = "RES" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        reservation.setReservationNumber(resNum);
        reservation.setRoomType(room.getType());

        long nights = ChronoUnit.DAYS.between(reservation.getCheckIn(), reservation.getCheckOut());
        if (nights < 1) nights = 1;
        double bill = nights * room.getPrice();
        reservation.setTotalBill(bill);

        return repository.save(reservation);
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
        r.setCheckIn(reservation.getCheckIn());
        r.setCheckOut(reservation.getCheckOut());
        r.setCheckInTime(reservation.getCheckInTime());
        r.setCheckOutTime(reservation.getCheckOutTime());

        String roomId = (reservation.getRoomId() != null && !reservation.getRoomId().isBlank()) ? reservation.getRoomId() : r.getRoomId();
        if (roomId == null || roomId.isBlank()) {
            throw new IllegalArgumentException("Room ID is required for update");
        }
        Room room = roomService.getRoomById(roomId).orElseThrow(() -> new IllegalArgumentException("Room not found"));
        if (!isRoomAvailableForDates(roomId, reservation.getCheckIn(), reservation.getCheckOut(), id)) {
            throw new IllegalArgumentException("Room not available for selected dates");
        }
        r.setRoomId(roomId);
        r.setRoomType(room.getType());
        long nights = ChronoUnit.DAYS.between(reservation.getCheckIn(), reservation.getCheckOut());
        if (nights < 1) nights = 1;
        r.setTotalBill(nights * room.getPrice());

        return repository.save(r);
    }

    public void deleteReservation(String id) {
        repository.deleteById(id);
    }

    public boolean checkAvailability(String roomType, LocalDate checkIn, LocalDate checkOut) {
        List<Room> roomsOfType = roomService.getAllRooms().stream()
                .filter(r -> r.getType().equalsIgnoreCase(roomType) && r.isAvailable())
                .toList();
        if (roomsOfType.isEmpty()) return false;
        for (Room room : roomsOfType) {
            if (isRoomAvailableForDates(room.getId(), checkIn, checkOut, null)) {
                return true;
            }
        }
        return false;
    }

    private boolean isRoomAvailableForDates(String roomId, LocalDate checkIn, LocalDate checkOut, String excludeReservationId) {
        List<Reservation> overlapping = repository.findByRoomId(roomId).stream()
                .filter(res -> !res.getReservationNumber().equals(excludeReservationId))
                .filter(res -> !(checkOut.isBefore(res.getCheckIn()) || checkIn.isAfter(res.getCheckOut())))
                .toList();
        return overlapping.isEmpty();
    }

    public List<Room> getAvailableRoomsForDates(String roomType, LocalDate checkIn, LocalDate checkOut) {
        return roomService.getAllRooms().stream()
                .filter(r -> r.getType().equalsIgnoreCase(roomType) && r.isAvailable())
                .filter(r -> isRoomAvailableForDates(r.getId(), checkIn, checkOut, null))
                .toList();
    }
}
