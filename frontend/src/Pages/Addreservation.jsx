import { useState } from "react";
import api from "./services/api";

const ROOM_RATES = {
  Single: 10000,
  Double: 15000,
  Deluxe: 25000,
};

export default function AddReservation() {
  const [roomType, setRoomType] = useState("Single");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [bill, setBill] = useState(0);

  const calculateBill = (ci, co, type) => {
    if (!ci || !co) return 0;

    const nights =
      (new Date(co) - new Date(ci)) / (1000 * 60 * 60 * 24);

    return nights > 0 ? nights * ROOM_RATES[type] : 0;
  };

  const handleSubmit = async () => {
    try {
      await api.post("/reservations", {
        roomType,
        checkIn,
        checkOut,
        bill,
      });

      alert(`Reservation added! Bill: LKR ${bill}`);
    } catch (error) {
      alert("You must be logged in");
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add Reservation</h2>

      <select
        className="border p-2 w-full mb-2"
        value={roomType}
        onChange={(e) => {
          setRoomType(e.target.value);
          setBill(calculateBill(checkIn, checkOut, e.target.value));
        }}
      >
        <option>Single</option>
        <option>Double</option>
        <option>Deluxe</option>
      </select>

      <input
        type="date"
        className="border p-2 w-full mb-2"
        onChange={(e) => setCheckIn(e.target.value)}
      />

      <input
        type="date"
        className="border p-2 w-full mb-4"
        onChange={(e) => {
          setCheckOut(e.target.value);
          setBill(calculateBill(checkIn, e.target.value, roomType));
        }}
      />

      <div className="bg-gray-100 p-4 rounded mb-4">
        <p>Total Bill</p>
        <p className="text-xl text-green-600">LKR {bill}</p>
      </div>

      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-6 py-2 rounded"
      >
        Add Reservation
      </button>
    </div>
  );
}
