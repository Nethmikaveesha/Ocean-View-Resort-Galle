import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRooms, getReservations, getCustomers, addRoom, deleteRoom, addReservation, getAvailableRoomsForDates } from "../Services/api";
import { AuthContext } from "../context/AuthContext";

const ROOM_TYPES = ["Single", "Double", "Deluxe"];
const TIME_OPTIONS = ["12:00 AM", "6:00 AM", "9:00 AM", "12:00 PM", "3:00 PM", "6:00 PM", "9:00 PM"];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = React.useContext(AuthContext);
  const [rooms, setRooms] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [newRoom, setNewRoom] = useState({ type: "Single", price: 10000, imageBase64: "" });
  const [addResModal, setAddResModal] = useState(false);
  const [newRes, setNewRes] = useState({ guestName: "", address: "", contactNumber: "", roomType: "Single", roomId: "", checkIn: "", checkOut: "", checkInTime: "12:00 PM", checkOutTime: "11:00 AM" });
  const [availableRoomsForRes, setAvailableRoomsForRes] = useState([]);

  const fetchData = async () => {
    try {
      const [r, res, c] = await Promise.all([getRooms(), getReservations(), getCustomers()]);
      setRooms(r || []);
      setReservations(res || []);
      setCustomers(c || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setNewRoom((prev) => ({ ...prev, imageBase64: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleAddRoom = async () => {
    if (!newRoom.type || !newRoom.price) {
      alert("Type and price are required.");
      return;
    }
    try {
      await addRoom({
        type: newRoom.type,
        price: Number(newRoom.price),
        imageBase64: newRoom.imageBase64 || undefined,
        available: true,
      });
      alert("Room added successfully!");
      setNewRoom({ type: "Single", price: 10000, imageBase64: "" });
      fetchData();
    } catch (err) {
      alert("Failed to add room.");
    }
  };

  const handleDeleteRoom = async (id) => {
    if (!window.confirm("Delete this room?")) return;
    try {
      await deleteRoom(id);
      alert("Room deleted.");
      fetchData();
    } catch (_) {
      alert("Failed to delete.");
    }
  };

  const handleAddReservation = async () => {
    if (!newRes.guestName || !newRes.checkIn || !newRes.checkOut || !newRes.roomId) {
      alert("Please fill guest name, dates, and select a room.");
      return;
    }
    try {
      await addReservation({
        ...newRes,
        customerUsername: null,
      });
      alert("Reservation added successfully!");
      setAddResModal(false);
      setNewRes({ guestName: "", address: "", contactNumber: "", roomType: "Single", roomId: "", checkIn: "", checkOut: "", checkInTime: "12:00 PM", checkOutTime: "11:00 AM" });
      fetchData();
    } catch (err) {
      alert("Failed to add reservation: " + (err?.response?.data?.message || "Try again."));
    }
  };

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!addResModal || !newRes.checkIn || !newRes.checkOut || !newRes.roomType) return;
    getAvailableRoomsForDates(newRes.roomType, newRes.checkIn, newRes.checkOut)
      .then((r) => setAvailableRoomsForRes(r || []))
      .catch(() => setAvailableRoomsForRes([]));
  }, [addResModal, newRes.checkIn, newRes.checkOut, newRes.roomType]);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>

      {/* Add Room */}
      <section className="mb-8 p-4 border rounded bg-gray-50">
        <h3 className="font-semibold mb-3">Add New Room</h3>
        <div className="flex flex-wrap gap-3 items-end">
          <select value={newRoom.type} onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value })} className="border p-2 rounded">
            {ROOM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <input type="number" placeholder="Price (LKR)" value={newRoom.price} onChange={(e) => setNewRoom({ ...newRoom, price: e.target.value })} className="border p-2 rounded" />
          <input type="file" accept="image/*" onChange={handleImageChange} className="border p-2 rounded" />
          <button onClick={handleAddRoom} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Add Room</button>
        </div>
      </section>

      {/* Rooms */}
      <section className="mb-8">
        <h3 className="font-semibold mb-2">Rooms</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <div key={room.id} className="border rounded p-4 bg-white">
              {room.imageBase64 && <img src={room.imageBase64} alt={room.type} className="w-full h-32 object-cover rounded mb-2" />}
              <p className="font-medium">{room.type} - LKR {room.price}</p>
              <p className="text-sm text-gray-600">#{room.roomNumber || room.id}</p>
              <button onClick={() => handleDeleteRoom(room.id)} className="mt-2 text-red-600 text-sm">Delete</button>
            </div>
          ))}
        </div>
      </section>

      {/* Add Reservation (walk-in) */}
      <section className="mb-8">
        <button onClick={() => setAddResModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4">Add Reservation (Walk-in)</button>
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
                <input type="date" value={newRes.checkIn} min={today} onChange={(e) => setNewRes({ ...newRes, checkIn: e.target.value })} placeholder="Check-in" className="border p-2 w-full rounded" />
                <input type="date" value={newRes.checkOut} min={newRes.checkIn || today} onChange={(e) => setNewRes({ ...newRes, checkOut: e.target.value })} placeholder="Check-out" className="border p-2 w-full rounded" />
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

      {/* Customers */}
      <section className="mb-8">
        <h3 className="font-semibold mb-2">Customers</h3>
        <ul className="border rounded divide-y max-h-48 overflow-y-auto">
          {customers.map((cust) => (
            <li key={cust.id} className="p-3">
              {cust.name || cust.username} - {cust.username} - {cust.contactNumber || "N/A"}
            </li>
          ))}
        </ul>
      </section>

      {/* Admin Logout - only at bottom of dashboard */}
      <section className="pt-8 border-t mt-8">
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </section>
    </div>
  );
}
