import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getRooms, getReservations, addReservation, getAvailableRoomsForDates } from "../Services/api";
import { AuthContext } from "../context/AuthContext";
import { ROLE_RECEPTIONIST } from "../constants/roles";

const ROOM_TYPES = ["Single", "Double", "Deluxe"];
const TIME_OPTIONS = ["12:00 AM", "6:00 AM", "9:00 AM", "12:00 PM", "3:00 PM", "6:00 PM", "9:00 PM"];

export default function ReceptionistDashboard() {
  const navigate = useNavigate();
  const { logout } = React.useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [addResModal, setAddResModal] = useState(false);
  const [newRes, setNewRes] = useState({ guestName: "", address: "", contactNumber: "", roomType: "Single", roomId: "", checkIn: "", checkOut: "", checkInTime: "12:00 PM", checkOutTime: "11:00 AM" });
  const [availableRoomsForRes, setAvailableRoomsForRes] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [r, res] = await Promise.all([getRooms(), getReservations()]);
      setRooms(r || []);
      setReservations(res || []);
    } catch (err) {
      if (err?.response?.status === 403 || err?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        navigate("/login");
      } else {
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("userRole") !== ROLE_RECEPTIONIST || !localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    fetchData();
  }, [navigate]);

  const handleAddReservation = async () => {
    if (!newRes.guestName || !newRes.checkIn || !newRes.checkOut || !newRes.roomId) {
      alert("Please fill guest name, dates, and select a room.");
      return;
    }
    try {
      await addReservation({ ...newRes, customerUsername: null });
      alert("Reservation added successfully!");
      setAddResModal(false);
      setNewRes({ guestName: "", address: "", contactNumber: "", roomType: "Single", roomId: "", checkIn: "", checkOut: "", checkInTime: "12:00 PM", checkOutTime: "11:00 AM" });
      fetchData();
    } catch (err) {
      alert("Failed: " + (err?.response?.data?.message || "Try again."));
    }
  };

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!addResModal || !newRes.checkIn || !newRes.checkOut || !newRes.roomType) return;
    getAvailableRoomsForDates(newRes.roomType, newRes.checkIn, newRes.checkOut)
      .then((r) => setAvailableRoomsForRes(r || []))
      .catch(() => setAvailableRoomsForRes([]));
  }, [addResModal, newRes.checkIn, newRes.checkOut, newRes.roomType]);

  if (loading && rooms.length === 0 && reservations.length === 0) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-2" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">🧑‍💼 Receptionist Dashboard</h2>
      <p className="text-sm text-gray-600 mb-6">Create reservations, view rooms and bookings. Check availability via the link below.</p>

      {/* Check Availability */}
      <section className="mb-8 p-4 border rounded bg-blue-50">
        <h3 className="font-semibold mb-2">Check Availability</h3>
        <Link to="/check" className="text-blue-600 underline font-medium">Go to Check Availability →</Link>
      </section>

      {/* Add Reservation (walk-in) */}
      <section className="mb-8">
        <button onClick={() => setAddResModal(true)} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-4">Create Reservation (Walk-in)</button>
        {addResModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <h3 className="font-semibold mb-4">Add Reservation for Walk-in Customer</h3>
              <div className="space-y-2">
                <input placeholder="Guest Name" value={newRes.guestName} onChange={(e) => setNewRes({ ...newRes, guestName: e.target.value })} className="border p-2 w-full rounded" />
                <input placeholder="Address" value={newRes.address} onChange={(e) => setNewRes({ ...newRes, address: e.target.value })} className="border p-2 w-full rounded" />
                <input placeholder="Contact Number" value={newRes.contactNumber} onChange={(e) => setNewRes({ ...newRes, contactNumber: e.target.value })} className="border p-2 w-full rounded" />
                <select value={newRes.roomType} onChange={(e) => setNewRes({ ...newRes, roomType: e.target.value, roomId: "" })} className="border p-2 w-full rounded">
                  {ROOM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <div>
                  <label className="text-sm">Select Room</label>
                  <select value={newRes.roomId} onChange={(e) => setNewRes({ ...newRes, roomId: e.target.value })} className="border p-2 w-full rounded">
                    <option value="">-- Select room --</option>
                    {availableRoomsForRes.map((room) => (
                      <option key={room.id} value={room.id}>{room.type} #{room.roomNumber || room.id} - LKR {room.price}</option>
                    ))}
                  </select>
                </div>
                <input type="date" value={newRes.checkIn} min={today} onChange={(e) => setNewRes({ ...newRes, checkIn: e.target.value })} className="border p-2 w-full rounded" />
                <input type="date" value={newRes.checkOut} min={newRes.checkIn || today} onChange={(e) => setNewRes({ ...newRes, checkOut: e.target.value })} className="border p-2 w-full rounded" />
                <select value={newRes.checkInTime} onChange={(e) => setNewRes({ ...newRes, checkInTime: e.target.value })} className="border p-2 w-full rounded">
                  {TIME_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <select value={newRes.checkOutTime} onChange={(e) => setNewRes({ ...newRes, checkOutTime: e.target.value })} className="border p-2 w-full rounded">
                  {TIME_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="mt-4 flex gap-2">
                <button onClick={handleAddReservation} className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
                <button onClick={() => setAddResModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Reservations */}
      <section className="mb-8">
        <h3 className="font-semibold mb-2">Reservations</h3>
        <ul className="border rounded divide-y max-h-48 overflow-y-auto">
          {reservations.map((resv) => (
            <li key={resv.reservationNumber} className="p-3">
              {resv.guestName} - {resv.roomType} - {resv.checkIn} to {resv.checkOut} - LKR {resv.totalBill}
            </li>
          ))}
        </ul>
      </section>

      {/* Rooms (view only) */}
      <section className="mb-8">
        <h3 className="font-semibold mb-2">Rooms</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <div key={room.id} className="border rounded p-4 bg-white">
              {room.imageBase64 && <img src={room.imageBase64} alt={room.type} className="w-full h-32 object-cover rounded mb-2" />}
              <p className="font-medium">{room.type} - LKR {room.price}</p>
              <p className="text-sm text-gray-600">#{room.roomNumber || room.id}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pt-8 border-t mt-8">
        <button onClick={() => { logout(); navigate("/login"); }} className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700">
          Logout
        </button>
      </section>
    </div>
  );
}
