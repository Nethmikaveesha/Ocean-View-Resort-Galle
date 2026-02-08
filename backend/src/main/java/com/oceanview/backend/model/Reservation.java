package com.oceanview.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document(collection = "reservations")
public class Reservation {

    @Id
    private String reservationNumber;

    private String guestName;
    private String address;
    private String contactNumber;
    private String roomType;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private String time; // AM / PM
    private double totalBill;

    // getters & setters
}