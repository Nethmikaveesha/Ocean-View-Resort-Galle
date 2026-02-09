// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../Services/api";

export default function AdminDashboard() {
  const [rooms, setRooms] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [newRoom, setNewRoom] = useState({ type: "", rate: "", image: "" });

  // Fetch all data from backend
  useEffect(() => {
    fetchRooms();
    fetchReservations();
    fetchCustomers();
  }, []);

  const fetchRooms = async () => {
    const res = await api.get("/rooms");
    setRooms(res.data);
  };

  const fetchReservations = async () => {
    const res = await api.get("/reservations");
    setReservations(res.data);
  };

  const fetchCustomers = async () => {
    const res = await api.get("/customers");
    setCustomers(res.data);
  };

  const handleAddRoom = async () => {
    const formData = new FormData();
    formData.append("type", newRoom.type);
    formData.append("rate", newRoom.rate);
    formData.append("image", newRoom.image);

    try {
      await api.post("/rooms", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Room added successfully!");
      setNewRoom({ type: "", rate: "", image: "" });
      fetchRooms();
    } catch (err) {
      alert("Failed to add room.");
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

      {/* Add Room */}
      <div className="mb-8 p-4 border rounded">
        <h3 className="font-semibold mb-2">Add New Room</h3>
        <input
          placeholder="Room Type"
          value={newRoom.type}
          onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="number"
          placeholder="Rate"
          value={newRoom.rate}
          onChange={(e) => setNewRoom({ ...newRoom, rate: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="file"
          onChange={(e) => setNewRoom({ ...newRoom, image: e.target.files[0] })}
          className="border p-2 mr-2"
        />
        <button
          onClick={handleAddRoom}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Add Room
        </button>
      </div>

      {/* Rooms List */}
      <div className="mb-8">
        <h3 className="font-semibold mb-2">Rooms</h3>
        <ul className="border p-2 rounded">
          {rooms.map((room) => (
            <li key={room.id}>
              {room.type} - LKR {room.rate}
            </li>
          ))}
        </ul>
      </div>

      {/* Reservations List */}
      <div className="mb-8">
        <h3 className="font-semibold mb-2">Reservations</h3>
        <ul className="border p-2 rounded">
          {reservations.map((resv) => (
            <li key={resv.reservationNumber}>
              {resv.guestName} - {resv.roomType} - {resv.checkIn} to {resv.checkOut} - LKR {resv.bill}
            </li>
          ))}
        </ul>
      </div>

      {/* Customers List */}
      <div>
        <h3 className="font-semibold mb-2">Customers</h3>
        <ul className="border p-2 rounded">
          {customers.map((cust) => (
            <li key={cust.id}>
              {cust.name} - {cust.username} - {cust.contactNumber}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
