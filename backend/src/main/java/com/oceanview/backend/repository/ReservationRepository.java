package com.oceanview.backend.repository;

import com.oceanview.backend.model.Reservation;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ReservationRepository extends MongoRepository<Reservation, String> {
    List<Reservation> findByCustomerUsername(String customerUsername);
}
