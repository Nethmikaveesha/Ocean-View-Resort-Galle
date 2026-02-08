package com.oceanview.backend.controller;

import com.oceanview.backend.model.Room;
import com.oceanview.backend.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin
public class RoomController {

    @Autowired
    private RoomService service;

    @PostMapping
    public Room addRoom(@RequestBody Room room) {
        return service.addRoom(room);
    }

    @GetMapping("/available")
    public List<Room> availableRooms() {
        return service.availableRooms();
    }
}
