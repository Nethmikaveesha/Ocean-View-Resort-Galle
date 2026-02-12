//package com.oceanview.backend.repository;
//
//import com.oceanview.backend.model.Room;
//import org.springframework.data.mongodb.repository.MongoRepository;
//
//import java.util.List;
//
//public interface RoomRepository extends MongoRepository<Room, String> {
//    List<Room> findByAvailableTrue();
//    Room findByRoomType(String roomType);
//}

package com.oceanview.backend.repository;

import com.oceanview.backend.model.Room;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface RoomRepository extends MongoRepository<Room, String> {

    List<Room> findByAvailableTrue();
}
