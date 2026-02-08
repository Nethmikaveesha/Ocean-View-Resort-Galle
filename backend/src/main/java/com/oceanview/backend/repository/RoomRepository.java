package com.oceanview.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface RoomRepository extends MongoRepository<Room, String> {
    List<Room> findByAvailableTrue();
    Room findByRoomType(String roomType);
}