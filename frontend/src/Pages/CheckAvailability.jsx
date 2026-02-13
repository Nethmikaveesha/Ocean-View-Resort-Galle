import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getRooms, checkRoomAvailability, getAvailableRoomsForDates } from "../Services/api";

const TIME_OPTIONS = ["12:00 AM", "6:00 AM", "9:00 AM", "12:00 PM", "3:00 PM", "6:00 PM", "9:00 PM"];

export default function CheckAvailability() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [checkInTime, setCheckInTime] = useState("12:00 PM");
  const [loading, setLoading] = useState(false);
  const [roomAvailability, setRoomAvailability] = useState({}); // { "Single": true, "Double": false }
  const [availableRoomsList, setAvailableRoomsList] = useState([]); // [{ id, type, price, ... }]
  const [selectedRoom, setSelectedRoom] = useState(null); // { id, type, price }
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
    setAvailableRoomsList([]);
    setSelectedRoom(null);
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

      // Fetch actual available rooms for each available type
      const allRooms = [];
      for (const type of typesToCheck) {
        if (results[type]) {
          try {
            const roomsForType = await getAvailableRoomsForDates(type, checkIn, checkOut);
            if (roomsForType?.length) allRooms.push(...roomsForType);
          } catch (_) {}
        }
      }
      setAvailableRoomsList(allRooms);
      setHasChecked(true);
    } catch (err) {
      setError("Failed to check availability.");
    } finally {
      setLoading(false);
    }
  };

  const anyAvailable = availableRoomsList.length > 0;

  const handleRegister = () => {
    if (!selectedRoom) {
      setError("Please select a room before continuing.");
      return;
    }
    sessionStorage.setItem("availabilityVerified", "true");
    sessionStorage.setItem("availableDates", JSON.stringify({ checkIn, checkOut, checkInTime }));
    sessionStorage.setItem("selectedRoom", JSON.stringify({ id: selectedRoom.id, type: selectedRoom.type, price: selectedRoom.price }));
    navigate("/register");
  };

  const handleLogin = () => {
    if (!selectedRoom) {
      setError("Please select a room before continuing.");
      return;
    }
    sessionStorage.setItem("availabilityVerified", "true");
    sessionStorage.setItem("availableDates", JSON.stringify({ checkIn, checkOut, checkInTime }));
    sessionStorage.setItem("selectedRoom", JSON.stringify({ id: selectedRoom.id, type: selectedRoom.type, price: selectedRoom.price }));
    navigate("/login");
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
        <div className="p-6 bg-green-50 border border-green-200 rounded-xl">
          <p className="text-green-800 font-semibold mb-2">Rooms are available for your selected dates!</p>
          <p className="text-green-700 mb-4">Select the room you want, then register or log in to complete your reservation.</p>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Choose your room:</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {availableRoomsList.map((room) => (
                <button
                  key={room.id}
                  type="button"
                  onClick={() => setSelectedRoom(room)}
                  className={`text-left border-2 rounded-lg overflow-hidden transition-all ${
                    selectedRoom?.id === room.id
                      ? "border-blue-600 ring-2 ring-blue-200 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:shadow"
                  }`}
                >
                  <div className="aspect-video bg-gray-100 flex items-center justify-center">
                    {room.imageBase64 ? (
                      <img src={room.imageBase64} alt={room.type} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-400 text-2xl">{room.type?.charAt(0) || "R"}</span>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="font-semibold">{room.type} - #{room.roomNumber || room.id}</p>
                    <p className="text-gray-600 text-sm">LKR {room.price?.toLocaleString()}/night</p>
                    {selectedRoom?.id === room.id && (
                      <p className="text-blue-600 text-sm font-medium mt-1">✓ Selected</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {!selectedRoom && (
            <p className="text-amber-700 text-sm mb-3">Please select a room above before continuing.</p>
          )}
          <div className="flex gap-3">
            <button
              onClick={handleRegister}
              disabled={!selectedRoom}
              className={`px-4 py-2 rounded font-medium ${selectedRoom ? "bg-green-600 text-white hover:bg-green-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
            >
              Register
            </button>
            <button
              onClick={handleLogin}
              disabled={!selectedRoom}
              className={`px-4 py-2 rounded font-medium ${selectedRoom ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
            >
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
