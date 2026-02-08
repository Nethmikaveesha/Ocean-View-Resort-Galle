package com.oceanview.backend.service;



import com.oceanview.backend.model.Room;
import com.oceanview.backend.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomService {

    @Autowired
    private RoomRepository repo;

    public Room addRoom(Room room) {
        room.setAvailable(true);
        return repo.save(room);
    }

    public List<Room> availableRooms() {
        return repo.findByAvailableTrue();
    }
}
