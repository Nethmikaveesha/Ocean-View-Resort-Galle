package com.oceanview.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Document(collection = "reservations")
@Getter
@Setter
public class Reservation {

    @Id
    private String reservationNumber; // auto-generated

    private String guestName;

    private String address;

    private String contactNumber;

    private LocalDate checkInDate;

    private LocalDate checkOutDate;

    private String time; // AM / PM

    private double totalBill;

    @DBRef
    private Room room; // MongoDB reference
}