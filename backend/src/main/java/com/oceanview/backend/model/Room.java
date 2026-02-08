package com.oceanview.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Getter;
import lombok.Setter;

@Document(collection = "rooms")
@Getter
@Setter
public class Room {

    @Id
    private String id;

    private String roomType;

    private double price;

    private boolean available;

    private String imageUrl; // for admin to add room images
}