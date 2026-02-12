import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkRoomAvailability } from "../Services/api";

const ROOM_TYPES = ["Single", "Double", "Deluxe"];
const TIME_OPTIONS = ["12:00 AM", "6:00 AM", "9:00 AM", "12:00 PM", "3:00 PM", "6:00 PM", "9:00 PM"];

export default function CheckAvailability() {
  const navigate = useNavigate();
  const [roomType, setRoomType] = useState("Single");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [checkInTime, setCheckInTime] = useState("12:00 PM");
  const [loading, setLoading] = useState(false);
  const [available, setAvailable] = useState(null);
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const handleCheck = async (e) => {
    e.preventDefault();
    setError("");
    setAvailable(null);
    if (!checkIn || !checkOut) {
      setError("Please select both check-in and check-out dates.");
      return;
    }
    if (checkIn < today) {
      setError("Check-in date must be today or in the future.");
      return;
    }
    if (checkOut <= checkIn) {
      setError("Check-out date must be after check-in.");
      return;
    }
    setLoading(true);
    try {
      const res = await checkRoomAvailability(roomType, checkIn, checkOut);
      setAvailable(res.available);
    } catch (err) {
      setError("Failed to check availability.");
      setAvailable(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Check Room Availability</h2>
      <p className="text-gray-600 mb-6">
        Check if your desired room is available before registering. Only if available, you may register and log in.
      </p>

      <form onSubmit={handleCheck} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Room Type</label>
          <select
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            className="border p-2 w-full rounded"
          >
            {ROOM_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Check-in Date (must be today or future)</label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            min={today}
            className="border p-2 w-full rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Check-in Time (AM/PM)</label>
          <select
            value={checkInTime}
            onChange={(e) => setCheckInTime(e.target.value)}
            className="border p-2 w-full rounded"
          >
            {TIME_OPTIONS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Check-out Date (must be in the future)</label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            min={checkIn || today}
            className="border p-2 w-full rounded"
          />
        </div>

        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Checking..." : "Check Availability"}
        </button>
      </form>

      {available === true && (
        <div className="mt-6 p-4 bg-green-100 border border-green-400 rounded">
          <p className="text-green-800 font-semibold">Rooms are available for your selected dates!</p>
          <p className="text-green-700 mt-2">You may now register and log in to add a reservation.</p>
          <div className="mt-4 flex gap-3">
            <button
              onClick={() => navigate("/register")}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Register
            </button>
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Login
            </button>
          </div>
        </div>
      )}

      {available === false && !loading && (
        <div className="mt-6 p-4 bg-red-100 border border-red-400 rounded">
          <p className="text-red-800 font-semibold">No rooms available for the selected dates.</p>
          <p className="text-red-700 mt-1">Please try different dates or room type.</p>
        </div>
      )}
    </div>
  );
}
