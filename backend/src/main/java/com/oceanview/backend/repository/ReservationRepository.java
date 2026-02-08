package com.oceanview.backend.repository;

import com.oceanview.backend.model.Reservation;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ReservationRepository
        extends MongoRepository<Reservation, String> {
}
