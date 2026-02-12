package com.oceanview.backend.model;

import jakarta.validation.constraints.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;

@Document(collection = "reservations")
public class Reservation {
    @Id
    private String reservationNumber; // Primary key, auto-generated
    @NotBlank(message = "Guest name is required")
    @Size(min = 2, max = 100)
    private String guestName;
    @NotBlank(message = "Address is required")
    @Size(max = 200)
    private String address;
    @NotBlank(message = "Contact number is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Contact must be 10 digits")
    private String contactNumber;
    @NotBlank(message = "Room ID is required")
    private String roomId;   // Specific room (required for booking)
    private String roomType; // Derived from room, for display
    @NotNull(message = "Check-in date is required")
    private LocalDate checkIn;
    @NotNull(message = "Check-out date is required")
    private LocalDate checkOut;
    private String checkInTime;  // AM/PM format e.g. "2:00 PM"
    private String checkOutTime; // AM/PM format e.g. "11:00 AM"
    private double totalBill;
    private String customerUsername; // Link to customer for "my reservations"

    // Getters & Setters
    public String getReservationNumber() { return reservationNumber; }
    public void setReservationNumber(String reservationNumber) { this.reservationNumber = reservationNumber; }

    public String getGuestName() { return guestName; }
    public void setGuestName(String guestName) { this.guestName = guestName; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }

    public String getRoomId() { return roomId; }
    public void setRoomId(String roomId) { this.roomId = roomId; }
    public String getRoomType() { return roomType; }
    public void setRoomType(String roomType) { this.roomType = roomType; }

    public LocalDate getCheckIn() { return checkIn; }
    public void setCheckIn(LocalDate checkIn) { this.checkIn = checkIn; }

    public LocalDate getCheckOut() { return checkOut; }
    public void setCheckOut(LocalDate checkOut) { this.checkOut = checkOut; }

    public double getTotalBill() { return totalBill; }
    public void setTotalBill(double totalBill) { this.totalBill = totalBill; }

    public String getCheckInTime() { return checkInTime; }
    public void setCheckInTime(String checkInTime) { this.checkInTime = checkInTime; }

    public String getCheckOutTime() { return checkOutTime; }
    public void setCheckOutTime(String checkOutTime) { this.checkOutTime = checkOutTime; }

    public String getCustomerUsername() { return customerUsername; }
    public void setCustomerUsername(String customerUsername) { this.customerUsername = customerUsername; }
}