//package com.oceanview.backend.service;
//
//
//
//import com.oceanview.backend.model.Room;
//import com.oceanview.backend.repository.RoomRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//
//@Service
//public class RoomService {
//
//    @Autowired
//    private RoomRepository repo;
//
//    public Room addRoom(Room room) {
//        room.setAvailable(true);
//        return repo.save(room);
//    }
//
//    public List<Room> availableRooms() {
//        return repo.findByAvailableTrue();
//    }
//}
package com.oceanview.backend.service;

import com.oceanview.backend.model.Room;
import com.oceanview.backend.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoomService {

    @Autowired
    private RoomRepository repository;

    // ✅ Add Room
    public Room addRoom(Room room) {
        return repository.save(room);
    }

    // ✅ Get All Rooms
    public List<Room> getAllRooms() {
        return repository.findAll();
    }

    // ✅ Get Available Rooms
    public List<Room> availableRooms() {
        return repository.findByAvailableTrue();
    }

    // ✅ Get Room By ID
    public Optional<Room> getRoomById(String id) {
        return repository.findById(id);
    }

    // ✅ Delete Room
    public void deleteRoom(String id) {
        repository.deleteById(id);
    }
}
