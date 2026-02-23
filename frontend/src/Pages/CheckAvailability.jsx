
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getRooms, checkRoomAvailability, getAvailableRoomsForDates } from "../Services/api";
import { STAFF_ROLES } from "../constants/roles";

const TIME_OPTIONS = ["12:00 AM", "6:00 AM", "9:00 AM", "12:00 PM", "3:00 PM", "6:00 PM", "9:00 PM"];

export default function CheckAvailability() {
  const navigate = useNavigate();
  const location = useLocation();
  const [rooms, setRooms] = useState([]);
  const redirectMessage = location.state?.message;
  const preselectedRoom = location.state?.preselectedRoom; // { id, type, price, roomNumber } from Home room card
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [checkInTime, setCheckInTime] = useState("12:00 PM");
  const [loading, setLoading] = useState(false);
  const [roomAvailability, setRoomAvailability] = useState({}); // { "Single": true, "Double": false }
  const [availableRoomsList, setAvailableRoomsList] = useState([]); // [{ id, type, price, ... }]
  const [selectedRoom, setSelectedRoom] = useState(null); // room user picks after availability check (for Register/Login)
  const [selectedRoomForCheck, setSelectedRoomForCheck] = useState(null); // room user selects to check (when from hero, no preselection)
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
  const typesToCheckBase = uniqueRoomTypes.length > 0 ? uniqueRoomTypes : ["Single", "Double", "Deluxe"];
  const typesToCheck = preselectedRoom?.type
    ? [preselectedRoom.type]
    : selectedRoomForCheck
      ? [selectedRoomForCheck.type]
      : typesToCheckBase;
  const roomsToDisplay = preselectedRoom
    ? rooms.filter((r) => r.id === preselectedRoom.id)
    : rooms;
  const roomToCheck = preselectedRoom || selectedRoomForCheck; // which room we're checking for (preselected from card, or user-selected from list)

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
    if (!preselectedRoom && !selectedRoomForCheck) {
      setError("Please select a room to check availability for.");
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
      const finalList = roomToCheck
        ? allRooms.filter((r) => String(r.id) === String(roomToCheck.id))
        : allRooms;
      setAvailableRoomsList(finalList);
      setHasChecked(true);
    } catch (err) {
      setError("Failed to check availability.");
    } finally {
      setLoading(false);
    }
  };

  const anyAvailable = availableRoomsList.length > 0;
  const isStaff = STAFF_ROLES.includes(localStorage.getItem("userRole") || "");

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-amber-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-[fadeIn_0.8s_ease-out]">
          <div className="inline-block mb-4">
            <span className="text-cyan-700 text-sm font-medium tracking-[0.3em] uppercase border-b-2 border-cyan-700 pb-2">
              Find Your Perfect Room
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-serif mb-4 text-slate-900" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Check Availability
          </h2>
          {/* <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Select your dates to see which rooms are available. Only if rooms are available can you register and make a reservation.
          </p> */}
          {redirectMessage && (
            <div className="mt-4 p-4 bg-amber-100 border border-amber-300 rounded-xl text-amber-900 max-w-2xl mx-auto">
              {redirectMessage}
            </div>
          )}
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-600 to-amber-600 mx-auto mt-6"></div>
        </div>

        {/* Room Types Preview */}
        {roomsToDisplay.length > 0 && (
          <section className="mb-12 animate-[fadeInUp_0.9s_ease-out]">
            <h3 className="text-2xl font-serif text-slate-900 mb-6 text-center" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {preselectedRoom ? "Your Selected Room" : "Our Room Types"}
            </h3>
            {!preselectedRoom && (
              <p className="text-center text-slate-600 mb-4 text-sm">
                Select a room to check availability for
              </p>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {roomsToDisplay.map((room) => {
                const isSelected = !preselectedRoom && selectedRoomForCheck && String(selectedRoomForCheck.id) === String(room.id);
                return (
                  <button
                    key={room.id}
                    type="button"
                    onClick={() => !preselectedRoom && setSelectedRoomForCheck(isSelected ? null : { id: room.id, type: room.type, price: room.price, roomNumber: room.roomNumber })}
                    className={`text-left rounded-2xl overflow-hidden transition-all duration-300 ${
                      preselectedRoom
                        ? "bg-white/60 backdrop-blur-sm shadow-lg border border-white/20 hover:shadow-2xl hover:scale-105 cursor-default"
                        : isSelected
                          ? "bg-white shadow-2xl border-2 border-cyan-500 ring-4 ring-cyan-200 scale-105"
                          : "bg-white/60 backdrop-blur-sm shadow-lg border border-white/20 hover:shadow-2xl hover:scale-105 cursor-pointer"
                    }`}
                  >
                    <div className="relative aspect-video bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                      {room.imageBase64 ? (
                        <img src={room.imageBase64} alt={room.type} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-slate-400 text-3xl font-serif" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                          {room.type?.charAt(0) || "R"}
                        </span>
                      )}
                      {!preselectedRoom && isSelected && (
                        <div className="absolute inset-0 bg-cyan-500/10 flex items-center justify-center">
                          <span className="bg-cyan-600 text-white px-3 py-1 rounded-full text-sm font-medium">Selected</span>
                        </div>
                      )}
                    </div>
                    <div className="p-3 relative">
                      <p className="font-semibold text-slate-900">{room.type}</p>
                      <p className="text-cyan-700 font-medium text-sm">Room #{room.roomNumber || room.id}</p>
                      <p className="text-slate-600 text-sm">LKR {room.price?.toLocaleString()}</p>
                      {hasChecked && (
                        (() => {
                          const isThisRoomChecked = roomToCheck && String(room.id) === String(roomToCheck.id);
                          const isAvailable = isThisRoomChecked
                            ? availableRoomsList.some((r) => String(r.id) === String(room.id))
                            : roomAvailability[room.type];
                          return (
                            <p
                              className={`mt-2 font-medium text-sm ${
                                isAvailable ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {isAvailable ? "✓ Available" : "✗ Not available"}
                            </p>
                          );
                        })()
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Check Availability Form */}
        <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl p-8 sm:p-10 border border-white/20 mb-12 animate-[fadeInUp_1s_ease-out]">
          <h3 className="text-2xl font-serif text-slate-900 mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Select Your Dates
          </h3>
          
          <form onSubmit={handleCheck} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Check-in Date</label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  min={today}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white/50 backdrop-blur-sm focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all duration-300 outline-none"
                />
                <p className="text-xs text-slate-500 mt-1">Today or future dates</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Check-out Date</label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={checkIn || today}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white/50 backdrop-blur-sm focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all duration-300 outline-none"
                />
                <p className="text-xs text-slate-500 mt-1">Must be after check-in</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Check-in Time</label>
              <select
                value={checkInTime}
                onChange={(e) => setCheckInTime(e.target.value)}
                className="px-4 py-3 rounded-xl border-2 border-slate-200 bg-white/50 backdrop-blur-sm focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all duration-300 outline-none max-w-xs"
              >
                {TIME_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">⚠️</span>
                  <p className="text-red-700 text-sm flex-1">{error}</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-medium hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></span>
                  Checking...
                </span>
              ) : (
                "Check Availability"
              )}
            </button>
          </form>
        </div>

        {/* Available Rooms */}
        {hasChecked && anyAvailable && (
          <div className="bg-gradient-to-br from-teal-50 to-emerald-50 border-2 border-teal-200 rounded-3xl p-8 sm:p-10 shadow-xl animate-[fadeInUp_1.1s_ease-out]">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg">
                ✓
              </div>
              <h3 className="text-3xl font-serif text-slate-900 mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Great News!
              </h3>
              <p className="text-teal-800 text-lg font-medium">Rooms are available for your selected dates!</p>
              <p className="text-teal-700 mt-2">
                {isStaff
                  ? "These rooms are available for the selected dates. Use Walk-in Reservation in your dashboard to book for guests."
                  : "Select your preferred room, then register or log in to complete your reservation."}
              </p>
            </div>

            <div className="mb-8">
              <label className="block text-lg font-serif text-slate-900 mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Choose Your Room:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableRoomsList.map((room) => (
                  <button
                    key={room.id}
                    type="button"
                    onClick={() => setSelectedRoom(room)}
                    className={`text-left rounded-2xl overflow-hidden transition-all duration-300 ${
                      selectedRoom?.id === room.id
                        ? "ring-4 ring-teal-500 bg-white shadow-2xl scale-105"
                        : "bg-white/70 hover:bg-white hover:shadow-xl hover:scale-102"
                    }`}
                  >
                    <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                      {room.imageBase64 ? (
                        <img src={room.imageBase64} alt={room.type} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-slate-400 text-4xl font-serif" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                          {room.type?.charAt(0) || "R"}
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="font-semibold text-lg text-slate-900">{room.type}</p>
                      <p className="text-slate-600 text-sm">Room #{room.roomNumber || room.id}</p>
                      <p className="text-cyan-700 font-semibold text-lg mt-2">LKR {room.price?.toLocaleString()}/night</p>
                      {selectedRoom?.id === room.id && (
                        <div className="mt-3 flex items-center gap-2 text-teal-600 font-medium">
                          <span className="text-xl">✓</span>
                          <span>Selected</span>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {!isStaff && !selectedRoom && (
              <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 mb-6">
                <p className="text-amber-800 text-sm font-medium flex items-center gap-2">
                  <span className="text-xl">👆</span>
                  Please select a room above before continuing.
                </p>
              </div>
            )}

            {!isStaff && (
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={handleRegister}
                  disabled={!selectedRoom}
                  className={`px-8 py-4 rounded-xl font-medium text-lg transition-all duration-300 ${
                    selectedRoom
                      ? "bg-gradient-to-r from-teal-600 to-emerald-600 text-white hover:shadow-2xl hover:shadow-teal-500/50 hover:scale-105"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Register New Account
                </button>
                <button
                  onClick={handleLogin}
                  disabled={!selectedRoom}
                  className={`px-8 py-4 rounded-xl font-medium text-lg transition-all duration-300 ${
                    selectedRoom
                      ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:shadow-2xl hover:shadow-cyan-500/50 hover:scale-105"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Login to Existing Account
                </button>
              </div>
            )}
          </div>
        )}

        {/* No Rooms Available */}
        {hasChecked && !anyAvailable && !loading && (
          <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-8 sm:p-10 text-center shadow-xl animate-[fadeInUp_1.1s_ease-out]">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg">
              😔
            </div>
            <h3 className="text-2xl font-serif text-slate-900 mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              No Rooms Available
            </h3>
            <p className="text-red-800 font-semibold mb-2">Unfortunately, no rooms are available for the selected dates.</p>
            <p className="text-red-700">Please try different dates or contact us for assistance.</p>
          </div>
        )}
      </div>

      {/* Global Styles */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}