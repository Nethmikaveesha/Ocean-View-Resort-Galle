import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getRooms, checkRoomAvailability } from "../Services/api";

const TIME_OPTIONS = ["12:00 AM", "6:00 AM", "9:00 AM", "12:00 PM", "3:00 PM", "6:00 PM", "9:00 PM"];

export default function CheckAvailability() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [checkInTime, setCheckInTime] = useState("12:00 PM");
  const [loading, setLoading] = useState(false);
  const [roomAvailability, setRoomAvailability] = useState({}); // { "Single": true, "Double": false }
  const [hasChecked, setHasChecked] = useState(false);
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await getRooms();
        setRooms(data || []);
      } catch (_) {
        setRooms([]);
      }
    };
    fetchRooms();
  }, []);

  const uniqueRoomTypes = [...new Set(rooms.map((r) => r.type).filter(Boolean))];
  const typesToCheck = uniqueRoomTypes.length > 0 ? uniqueRoomTypes : ["Single", "Double", "Deluxe"];

  const handleCheck = async (e) => {
    e.preventDefault();
    setError("");
    setRoomAvailability({});
    setHasChecked(false);

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
      const results = {};
      for (const type of typesToCheck) {
        try {
          const res = await checkRoomAvailability(type, checkIn, checkOut);
          results[type] = res.available;
        } catch (_) {
          results[type] = false;
        }
      }
      setRoomAvailability(results);
      setHasChecked(true);
    } catch (err) {
      setError("Failed to check availability.");
    } finally {
      setLoading(false);
    }
  };

  const anyAvailable = Object.values(roomAvailability).some((v) => v === true);

  const handleRegister = () => {
    sessionStorage.setItem("availabilityVerified", "true");
    sessionStorage.setItem("availableDates", JSON.stringify({ checkIn, checkOut }));
    navigate("/customer-register");
  };

  const handleLogin = () => {
    sessionStorage.setItem("availabilityVerified", "true");
    sessionStorage.setItem("availableDates", JSON.stringify({ checkIn, checkOut }));
    navigate("/customer-login");
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Check Room Availability</h2>
      <p className="text-gray-600 mb-6">
        Select your dates to see which rooms are available. Only if rooms are available can you register and make a reservation.
      </p>

      {/* Rooms display */}
      {rooms.length > 0 && (
        <section className="mb-8">
          <h3 className="font-semibold mb-3">Available Room Types</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {rooms.map((room) => (
              <div key={room.id} className="border rounded-lg overflow-hidden bg-white">
                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                  {room.imageBase64 ? (
                    <img src={room.imageBase64} alt={room.type} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-400 text-2xl">{room.type?.charAt(0) || "R"}</span>
                  )}
                </div>
                <div className="p-2 text-sm">
                  <p className="font-medium">{room.type}</p>
                  <p className="text-gray-600">LKR {room.price?.toLocaleString()}</p>
                  {hasChecked && (
                    <p
                      className={`mt-1 font-medium ${
                        roomAvailability[room.type] ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {roomAvailability[room.type] ? "Available" : "Not available"}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <form onSubmit={handleCheck} className="space-y-4 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Check-in Date (today or future)</label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              min={today}
              className="border p-2 w-full rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Check-out Date (must be after check-in)</label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={checkIn || today}
              className="border p-2 w-full rounded"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Check-in Time (AM/PM)</label>
          <select
            value={checkInTime}
            onChange={(e) => setCheckInTime(e.target.value)}
            className="border p-2 w-full rounded max-w-xs"
          >
            {TIME_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
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

      {hasChecked && anyAvailable && (
        <div className="p-4 bg-green-100 border border-green-400 rounded">
          <p className="text-green-800 font-semibold">Rooms are available for your selected dates!</p>
          <p className="text-green-700 mt-2">You may now register and log in to add a reservation.</p>
          <div className="mt-4 flex gap-3">
            <button onClick={handleRegister} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Register
            </button>
            <button onClick={handleLogin} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Login
            </button>
          </div>
        </div>
      )}

      {hasChecked && !anyAvailable && !loading && (
        <div className="p-4 bg-red-100 border border-red-400 rounded">
          <p className="text-red-800 font-semibold">No rooms available for the selected dates.</p>
          <p className="text-red-700 mt-1">Please try different dates.</p>
        </div>
      )}
    </div>
  );
}
