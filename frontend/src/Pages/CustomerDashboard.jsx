// src/pages/CustomerDashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../Services/api";

export default function CustomerDashboard() {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    const res = await api.get("/my-reservations"); // Backend endpoint for customer's own reservations
    setReservations(res.data);
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">My Reservations</h2>

      {reservations.length === 0 ? (
        <p>No reservations found.</p>
      ) : (
        <div className="space-y-4">
          {reservations.map((resv) => (
            <div key={resv.reservationNumber} className="border p-4 rounded">
              <p><strong>Reservation #:</strong> {resv.reservationNumber}</p>
              <p><strong>Guest Name:</strong> {resv.guestName}</p>
              <p><strong>Room Type:</strong> {resv.roomType}</p>
              <p><strong>Check-in:</strong> {resv.checkIn}</p>
              <p><strong>Check-out:</strong> {resv.checkOut}</p>
              <p><strong>Bill:</strong> LKR {resv.bill}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
