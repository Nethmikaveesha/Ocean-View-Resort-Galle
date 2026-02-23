package com.oceanview.backend.service;

import com.oceanview.backend.model.Reservation;
import com.oceanview.backend.model.Room;
import com.oceanview.backend.repository.ReservationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("ReservationService Tests - Avoid System Damage")
class ReservationServiceTest {

    @Mock
    private ReservationRepository repository;

    @Mock
    private RoomService roomService;

    @InjectMocks
    private ReservationService service;

    private Reservation validReservation;
    private Room availableRoom;
    private LocalDate tomorrow;
    private LocalDate checkOut;

    @BeforeEach
    void setUp() {
        tomorrow = LocalDate.now().plusDays(1);
        checkOut = tomorrow.plusDays(3);

        availableRoom = new Room("R1", "Single", 10000.0, true);
        availableRoom.setId("room-123");

        validReservation = new Reservation();
        validReservation.setGuestName("Test Guest");
        validReservation.setAddress("123 Test Street");
        validReservation.setContactNumber("0771234567");
        validReservation.setRoomId("room-123");
        validReservation.setCheckIn(tomorrow);
        validReservation.setCheckOut(checkOut);
        validReservation.setCheckInTime("12:00 PM");
        validReservation.setCheckOutTime("11:00 AM");
    }

    @Test
    @DisplayName("Add reservation - valid data saves and calculates bill")
    void addReservation_validData_savesAndCalculatesBill() {
        when(roomService.getRoomById("room-123")).thenReturn(Optional.of(availableRoom));
        when(repository.findByRoomId("room-123")).thenReturn(List.of());
        when(repository.save(any(Reservation.class))).thenAnswer(inv -> inv.getArgument(0));

        Reservation saved = service.addReservation(validReservation);

        assertThat(saved.getReservationNumber()).startsWith("RES");
        assertThat(saved.getRoomType()).isEqualTo("Single");
        assertThat(saved.getTotalBill()).isEqualTo(30000.0); // 3 nights × 10000
        verify(repository).save(any(Reservation.class));
    }

    @Test
    @DisplayName("Add reservation - check-in in past throws IllegalArgumentException")
    void addReservation_checkInInPast_throws() {
        validReservation.setCheckIn(LocalDate.now().minusDays(1));

        assertThatThrownBy(() -> service.addReservation(validReservation))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("past");

        verify(repository, never()).save(any());
    }

    @Test
    @DisplayName("Add reservation - check-out before check-in throws")
    void addReservation_checkOutBeforeCheckIn_throws() {
        validReservation.setCheckOut(tomorrow.minusDays(1));

        assertThatThrownBy(() -> service.addReservation(validReservation))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("after check-in");

        verify(repository, never()).save(any());
    }

    @Test
    @DisplayName("Add reservation - missing roomId throws")
    void addReservation_missingRoomId_throws() {
        validReservation.setRoomId(null);

        assertThatThrownBy(() -> service.addReservation(validReservation))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Room ID");

        verify(repository, never()).save(any());
    }

    @Test
    @DisplayName("Add reservation - room not found throws")
    void addReservation_roomNotFound_throws() {
        when(roomService.getRoomById("room-123")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.addReservation(validReservation))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Room not found");

        verify(repository, never()).save(any());
    }

    @Test
    @DisplayName("Add reservation - room not available for dates throws")
    void addReservation_roomNotAvailableForDates_throws() {
        when(roomService.getRoomById("room-123")).thenReturn(Optional.of(availableRoom));
        Reservation existing = new Reservation();
        existing.setReservationNumber("RESEXIST1");
        existing.setRoomId("room-123");
        existing.setCheckIn(tomorrow);
        existing.setCheckOut(checkOut);
        when(repository.findByRoomId("room-123")).thenReturn(List.of(existing));

        assertThatThrownBy(() -> service.addReservation(validReservation))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("not available");

        verify(repository, never()).save(any());
    }

    @Test
    @DisplayName("Update reservation - valid data updates and recalculates bill")
    void updateReservation_validData_updatesAndRecalculatesBill() {
        Reservation existing = new Reservation();
        existing.setReservationNumber("RESUPDATE1");
        existing.setRoomId("room-123");
        existing.setGuestName("Old Name");
        existing.setCheckIn(tomorrow);
        existing.setCheckOut(checkOut);
        existing.setTotalBill(30000);

        when(repository.findById("RESUPDATE1")).thenReturn(Optional.of(existing));
        when(roomService.getRoomById("room-123")).thenReturn(Optional.of(availableRoom));
        when(repository.findByRoomId("room-123")).thenReturn(List.of(existing));
        when(repository.save(any(Reservation.class))).thenAnswer(inv -> inv.getArgument(0));

        Reservation updated = service.updateReservation("RESUPDATE1", validReservation);

        assertThat(updated.getGuestName()).isEqualTo("Test Guest");
        assertThat(updated.getTotalBill()).isEqualTo(30000.0);
        verify(repository).save(any(Reservation.class));
    }

    @Test
    @DisplayName("Update reservation - non-existent returns null")
    void updateReservation_notFound_returnsNull() {
        when(repository.findById("RESNONE")).thenReturn(Optional.empty());

        Reservation result = service.updateReservation("RESNONE", validReservation);

        assertThat(result).isNull();
        verify(repository, never()).save(any());
    }

    @Test
    @DisplayName("Update reservation - room not available for dates throws")
    void updateReservation_roomNotAvailable_throws() {
        Reservation existing = new Reservation();
        existing.setReservationNumber("RESUPDATE2");
        existing.setRoomId("room-123");

        when(repository.findById("RESUPDATE2")).thenReturn(Optional.of(existing));
        when(roomService.getRoomById("room-123")).thenReturn(Optional.of(availableRoom));
        Reservation other = new Reservation();
        other.setReservationNumber("RESOTHER");
        other.setRoomId("room-123");
        other.setCheckIn(tomorrow);
        other.setCheckOut(checkOut);
        when(repository.findByRoomId("room-123")).thenReturn(List.of(other));

        validReservation.setCheckIn(tomorrow);
        validReservation.setCheckOut(checkOut);

        assertThatThrownBy(() -> service.updateReservation("RESUPDATE2", validReservation))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("not available");

        verify(repository, never()).save(any());
    }

    @Test
    @DisplayName("Get reservation by id - returns reservation when found")
    void getReservation_found_returnsReservation() {
        Reservation r = new Reservation();
        r.setReservationNumber("RES1");
        when(repository.findById("RES1")).thenReturn(Optional.of(r));

        Reservation result = service.getReservation("RES1");

        assertThat(result).isNotNull();
        assertThat(result.getReservationNumber()).isEqualTo("RES1");
    }

    @Test
    @DisplayName("Get reservation by id - returns null when not found")
    void getReservation_notFound_returnsNull() {
        when(repository.findById("RESNONE")).thenReturn(Optional.empty());

        Reservation result = service.getReservation("RESNONE");

        assertThat(result).isNull();
    }
}
