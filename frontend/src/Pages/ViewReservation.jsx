import React, { useEffect, useState } from "react";
import api from "../services/api";

const ViewReservation = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await api.get("/reservations/my");
        setReservations(response.data);
      } catch (err) {
        setError("Failed to load reservations");
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  if (loading) {
    return <p className="p-6">Loading reservations...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-600">{error}</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Reservations</h1>

      {reservations.length === 0 ? (
        <p>No reservations found.</p>
      ) : (
        <div className="grid gap-4">
          {reservations.map((res) => (
            <div
              key={res.reservationNumber}
              className="border rounded-lg p-4 shadow"
            >
              <p>
                <strong>Reservation No:</strong>{" "}
                {res.reservationNumber}
              </p>
              <p>
                <strong>Guest Name:</strong> {res.guestName}
              </p>
              <p>
                <strong>Room Type:</strong> {res.roomType}
              </p>
              <p>
                <strong>Check-in:</strong> {res.checkInDate}
              </p>
              <p>
                <strong>Check-out:</strong> {res.checkOutDate}
              </p>
              <p>
                <strong>Total Bill:</strong> LKR {res.totalBill}
              </p>

              <a
                href={`http://localhost:8080/api/bills/${res.reservationNumber}`}
                className="inline-block mt-3 text-blue-600 underline"
              >
                Download Bill (PDF)
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewReservation;
