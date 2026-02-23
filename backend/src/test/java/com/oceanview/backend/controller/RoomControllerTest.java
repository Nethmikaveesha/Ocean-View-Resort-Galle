package com.oceanview.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.oceanview.backend.model.Room;
import com.oceanview.backend.service.ReservationService;
import com.oceanview.backend.service.RoomService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Slice tests for RoomController - verifies API contracts without full app/MongoDB.
 * Security filters disabled for controller logic; auth is tested via manual/Postman.
 * Run: mvn test -Dtest=RoomControllerTest
 */
@WebMvcTest(RoomController.class)
@AutoConfigureMockMvc(addFilters = false)  // Bypass JWT for controller logic tests
@DisplayName("RoomController API Tests - Avoid System Damage")
class RoomControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @MockitoBean
    private RoomService roomService;

    @MockitoBean
    private ReservationService reservationService;

    @Test
    @DisplayName("GET /api/rooms - returns 200 and list")
    void getAllRooms_returns200AndList() throws Exception {
        Room room = new Room("R1", "Single", 10000, true);
        room.setId("room-1");
        when(roomService.getAllRooms()).thenReturn(List.of(room));

        mockMvc.perform(get("/api/rooms"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].roomNumber").value("R1"))
                .andExpect(jsonPath("$[0].type").value("Single"));
    }

    @Test
    @DisplayName("GET /api/rooms/{id} - found returns 200")
    void getRoomById_found_returns200() throws Exception {
        Room room = new Room("R1", "Single", 10000, true);
        room.setId("room-1");
        when(roomService.getRoomById("room-1")).thenReturn(Optional.of(room));

        mockMvc.perform(get("/api/rooms/room-1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.roomNumber").value("R1"));
    }

    @Test
    @DisplayName("GET /api/rooms/{id} - not found returns 404")
    void getRoomById_notFound_returns404() throws Exception {
        when(roomService.getRoomById("invalid")).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/rooms/invalid"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("PUT /api/rooms/{id} - updates and returns 200")
    void updateRoom_validPayload_updatesAndReturns200() throws Exception {
        Room existing = new Room("R1", "Single", 10000, true);
        existing.setId("room-1");
        Room updated = new Room("R1", "Deluxe", 15000, true);
        updated.setId("room-1");

        when(roomService.getRoomById("room-1")).thenReturn(Optional.of(existing));
        when(roomService.addRoom(any(Room.class))).thenReturn(updated);

        String json = objectMapper.writeValueAsString(updated);

        mockMvc.perform(put("/api/rooms/room-1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json)
                        )
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("PUT /api/rooms/{id} - not found returns 404")
    void updateRoom_notFound_returns404() throws Exception {
        when(roomService.getRoomById("invalid")).thenReturn(Optional.empty());

        Room payload = new Room("R1", "Single", 10000, true);
        String json = objectMapper.writeValueAsString(payload);

        mockMvc.perform(put("/api/rooms/invalid")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json)
                        )
                .andExpect(status().isNotFound());
    }
}
