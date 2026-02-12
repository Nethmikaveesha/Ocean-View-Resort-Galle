
package com.oceanview.backend.controller;

import com.oceanview.backend.model.Room;
import com.oceanview.backend.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "http://localhost:5173") // allow Vite frontend
public class RoomController {

    @Autowired
    private RoomService service;

    // ✅ Add new room (accepts type, price, imageBase64 in JSON)
    @PostMapping
    public ResponseEntity<Room> addRoom(@RequestBody Room room) {
        if (room.getRoomNumber() == null || room.getRoomNumber().isBlank()) {
            room.setRoomNumber("R" + (service.getAllRooms().size() + 1));
        }
        room.setAvailable(true);
        Room savedRoom = service.addRoom(room);
        return ResponseEntity.ok(savedRoom);
    }

    // ✅ Get all rooms
    @GetMapping
    public ResponseEntity<List<Room>> getAllRooms() {
        return ResponseEntity.ok(service.getAllRooms());
    }

    // ✅ Get available rooms
    @GetMapping("/available")
    public ResponseEntity<List<Room>> getAvailableRooms() {
        return ResponseEntity.ok(service.availableRooms());
    }

    // ✅ Get room by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getRoomById(@PathVariable String id) {
        Optional<Room> room = service.getRoomById(id);

        if (room.isPresent()) {
            return ResponseEntity.ok(room.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // ✅ Update room
    @PutMapping("/{id}")
    public ResponseEntity<?> updateRoom(@PathVariable String id,
                                        @RequestBody Room updatedRoom) {
        Optional<Room> roomOptional = service.getRoomById(id);

        if (roomOptional.isPresent()) {
            Room room = roomOptional.get();
            if (updatedRoom.getRoomNumber() != null) room.setRoomNumber(updatedRoom.getRoomNumber());
            if (updatedRoom.getType() != null) room.setType(updatedRoom.getType());
            if (updatedRoom.getPrice() > 0) room.setPrice(updatedRoom.getPrice());
            room.setAvailable(updatedRoom.isAvailable());
            if (updatedRoom.getImageBase64() != null) room.setImageBase64(updatedRoom.getImageBase64());

            Room saved = service.addRoom(room);
            return ResponseEntity.ok(saved);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // ✅ Delete room
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRoom(@PathVariable String id) {
        service.deleteRoom(id);
        return ResponseEntity.ok("Room deleted successfully");
    }
}
