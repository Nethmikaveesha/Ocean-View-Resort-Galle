package com.oceanview.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "rooms")
public class Room {

    @Id
    private String id;
    private String roomType;
    private double price;
    private boolean available;
    private String imageUrl;

    // getters & setters
}