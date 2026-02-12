import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyReservations } from "../Services/api";

export default function CustomerDashboard() {
  const [reservations, setReservations] = useState([]);
  const username = localStorage.getItem("username") || "";

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getMyReservations(username);
        setReservations(data || []);
      } catch (_) {
        setReservations([]);
      }
    };
    fetch();
  }, [username]);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">My Reservations</h2>
      <Link to="/add-reservation" className="inline-block mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Add New Reservation</Link>

      {reservations.length === 0 ? (
        <p>No reservations found. <Link to="/add-reservation" className="text-blue-600 underline">Add one</Link>.</p>
      ) : (
        <div className="space-y-4">
          {reservations.map((resv) => (
            <div key={resv.reservationNumber} className="border p-4 rounded">
              <p><strong>Reservation #:</strong> {resv.reservationNumber}</p>
              <p><strong>Guest Name:</strong> {resv.guestName}</p>
              <p><strong>Room Type:</strong> {resv.roomType}</p>
              <p><strong>Check-in:</strong> {resv.checkIn}</p>
              <p><strong>Check-out:</strong> {resv.checkOut}</p>
              <p><strong>Bill:</strong> LKR {resv.totalBill}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex gap-4">
        <Link to="/add-reservation" className="text-blue-600 underline">Add Reservation</Link>
        <Link to="/view-reservation" className="text-blue-600 underline">View / Update / Delete Reservations</Link>
      </div>
    </div>
  );
}
