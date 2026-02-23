package com.oceanview.backend.service;

import com.oceanview.backend.model.Room;
import com.oceanview.backend.repository.RoomRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("RoomService Tests - Avoid System Damage")
class RoomServiceTest {

    @Mock
    private RoomRepository repository;

    @InjectMocks
    private RoomService service;

    private Room room;

    @BeforeEach
    void setUp() {
        room = new Room("R1", "Single", 10000.0, true);
        room.setId("room-id-1");
    }

    @Test
    @DisplayName("Add room - saves and returns room")
    void addRoom_validRoom_savesAndReturns() {
        when(repository.save(any(Room.class))).thenAnswer(inv -> inv.getArgument(0));

        Room saved = service.addRoom(room);

        assertThat(saved.getRoomNumber()).isEqualTo("R1");
        assertThat(saved.getType()).isEqualTo("Single");
        assertThat(saved.getPrice()).isEqualTo(10000.0);
        verify(repository).save(room);
    }

    @Test
    @DisplayName("Get all rooms - returns list")
    void getAllRooms_returnsList() {
        when(repository.findAll()).thenReturn(List.of(room));

        List<Room> rooms = service.getAllRooms();

        assertThat(rooms).hasSize(1);
        assertThat(rooms.get(0).getRoomNumber()).isEqualTo("R1");
    }

    @Test
    @DisplayName("Get available rooms - returns available only")
    void availableRooms_returnsAvailableOnly() {
        when(repository.findByAvailableTrue()).thenReturn(List.of(room));

        List<Room> rooms = service.availableRooms();

        assertThat(rooms).hasSize(1);
        assertThat(rooms.get(0).isAvailable()).isTrue();
    }

    @Test
    @DisplayName("Get room by id - returns when found")
    void getRoomById_found_returnsRoom() {
        when(repository.findById("room-id-1")).thenReturn(Optional.of(room));

        Optional<Room> result = service.getRoomById("room-id-1");

        assertThat(result).isPresent();
        assertThat(result.get().getId()).isEqualTo("room-id-1");
    }

    @Test
    @DisplayName("Get room by id - empty when not found")
    void getRoomById_notFound_returnsEmpty() {
        when(repository.findById("invalid")).thenReturn(Optional.empty());

        Optional<Room> result = service.getRoomById("invalid");

        assertThat(result).isEmpty();
    }

    @Test
    @DisplayName("Delete room - calls repository delete")
    void deleteRoom_callsRepository() {
        service.deleteRoom("room-id-1");

        verify(repository).deleteById("room-id-1");
    }
}
