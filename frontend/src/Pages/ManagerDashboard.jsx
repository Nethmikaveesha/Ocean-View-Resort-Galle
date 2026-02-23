import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  getRooms,
  getReservations,
  getCustomers,
  addRoom,
  updateRoom,
  deleteRoom,
  addReservation,
  deleteReservation,
  getAvailableRoomsForDates,
} from "../Services/api";
import { AuthContext } from "../context/AuthContext";
import StaffDashboardLayout, { MetricCard } from "../components/StaffDashboardLayout";
import { ROLE_MANAGER } from "../constants/roles";

const ROOM_TYPES = ["Single", "Double", "Deluxe"];
const TIME_OPTIONS = ["12:00 AM", "6:00 AM", "9:00 AM", "12:00 PM", "3:00 PM", "6:00 PM", "9:00 PM"];

const MANAGER_NAV = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "add-room", label: "Add Room", icon: "➕" },
  { id: "reservations", label: "View Reservations", icon: "📅" },
  { id: "create-res", label: "Create Reservation", icon: "➕" },
  { id: "customers", label: "View Customers", icon: "👤" },
  { id: "help", label: "Help", icon: "❓" },
];

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const { logout } = React.useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [rooms, setRooms] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [newRoom, setNewRoom] = useState({ type: "Single", price: 10000, imageBase64: "" });
  const [editingRoom, setEditingRoom] = useState(null);
  const [addResModal, setAddResModal] = useState(false);
  const [newRes, setNewRes] = useState({ guestName: "", address: "", contactNumber: "", roomType: "Single", roomId: "", checkIn: "", checkOut: "", checkInTime: "12:00 PM", checkOutTime: "11:00 AM" });
  const [availableRoomsForRes, setAvailableRoomsForRes] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [r, res, c] = await Promise.all([getRooms(), getReservations(), getCustomers()]);
      setRooms(r || []);
      setReservations(res || []);
      setCustomers(c || []);
    } catch (err) {
      if (err?.response?.status === 403 || err?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        navigate("/staff-login");
      } else {
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("userRole") !== ROLE_MANAGER || !localStorage.getItem("token")) {
      navigate("/staff-login");
      return;
    }
    fetchData();
  }, [navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setNewRoom((prev) => ({ ...prev, imageBase64: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleEditRoomImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || !editingRoom) return;
    const reader = new FileReader();
    reader.onloadend = () => setEditingRoom((prev) => ({ ...prev, imageBase64: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleAddRoom = async () => {
    if (!newRoom.type || !newRoom.price) {
      toast.error("Type and price are required.");
      return;
    }
    try {
      await addRoom({ type: newRoom.type, price: Number(newRoom.price), imageBase64: newRoom.imageBase64 || undefined, available: true });
      toast.success("Room added successfully!");
      setNewRoom({ type: "Single", price: 10000, imageBase64: "" });
      fetchData();
    } catch (err) {
      toast.error("Failed: " + (err?.response?.data?.message || "Try again."));
    }
  };

  const handleUpdateRoom = async () => {
    if (!editingRoom?.id || !editingRoom?.type || editingRoom?.price === "" || editingRoom?.price == null) return;
    try {
      const payload = {
        type: editingRoom.type,
        price: Number(editingRoom.price),
        available: editingRoom.available ?? true,
      };
      if (editingRoom.imageBase64) {
        payload.imageBase64 = editingRoom.imageBase64;
      }
      await updateRoom(editingRoom.id, payload);
      toast.success("Room updated!");
      setEditingRoom(null);
      fetchData();
    } catch (err) {
      toast.error("Failed: " + (err?.response?.data?.message || "Try again."));
    }
  };

  const handleDeleteRoom = async (id) => {
    if (!window.confirm("Delete this room?")) return;
    try {
      await deleteRoom(id);
      toast.success("Room deleted.");
      fetchData();
    } catch (_) {
      toast.error("Failed to delete.");
    }
  };

  const handleCancelReservation = async (resv) => {
    if (!window.confirm(`Cancel reservation ${resv.reservationNumber}?`)) return;
    try {
      await deleteReservation(resv.reservationNumber);
      toast.success("Reservation cancelled.");
      fetchData();
    } catch (err) {
      toast.error("Failed: " + (err?.response?.data?.message || "Try again."));
    }
  };

  const handleAddReservation = async () => {
    if (!newRes.guestName?.trim()) {
      toast.error("Please fill guest name.");
      return;
    }
    if (!newRes.address?.trim()) {
      toast.error("Please fill address.");
      return;
    }
    const contact = (newRes.contactNumber || "").replace(/\s/g, "");
    if (!contact) {
      toast.error("Please fill contact number.");
      return;
    }
    if (!/^[0-9]{10}$/.test(contact)) {
      toast.error("Contact number must be exactly 10 digits.");
      return;
    }
    if (!newRes.checkIn || !newRes.checkOut) {
      toast.error("Please select check-in and check-out dates.");
      return;
    }
    if (!newRes.roomId) {
      toast.error("Please select a room.");
      return;
    }
    try {
      await addReservation({
        ...newRes,
        contactNumber: contact,
        customerUsername: null,
      });
      toast.success("Reservation added successfully!");
      setAddResModal(false);
      setNewRes({ guestName: "", address: "", contactNumber: "", roomType: "Single", roomId: "", checkIn: "", checkOut: "", checkInTime: "12:00 PM", checkOutTime: "11:00 AM" });
      fetchData();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        (err?.response?.data?.errors && typeof err.response.data.errors === "object"
          ? Object.values(err.response.data.errors).flat().filter(Boolean).join(", ")
          : null) ||
        "Try again.";
      toast.error("Failed: " + msg);
    }
  };

  const today = new Date().toISOString().split("T")[0];
  const todayDate = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const isCreateResActive = activeSection === "create-res" || addResModal;
    if (!isCreateResActive || !newRes.checkIn || !newRes.checkOut || !newRes.roomType) return;
    getAvailableRoomsForDates(newRes.roomType, newRes.checkIn, newRes.checkOut)
      .then((r) => setAvailableRoomsForRes(r || []))
      .catch(() => setAvailableRoomsForRes([]));
  }, [activeSection, addResModal, newRes.checkIn, newRes.checkOut, newRes.roomType]);

  const roomsOfType = rooms.filter((r) => r.type === newRes.roomType);
  const availableRoomIds = new Set(availableRoomsForRes.map((r) => r.id));

  useEffect(() => {
    const isCreateResActive = activeSection === "create-res" || addResModal;
    if (isCreateResActive && newRes.roomId && newRes.checkIn && newRes.checkOut) {
      const stillAvailable = availableRoomsForRes.some((r) => r.id === newRes.roomId);
      if (!stillAvailable) {
        setNewRes((prev) => ({ ...prev, roomId: "" }));
      }
    }
  }, [activeSection, addResModal, newRes.roomId, newRes.checkIn, newRes.checkOut, availableRoomsForRes]);

  const availableRooms = rooms.filter((r) => r.available !== false).length;
  const activeReservations = reservations.filter((r) => r.checkIn <= todayDate && r.checkOut >= todayDate).length;
  
  if (loading && rooms.length === 0 && reservations.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-slate-600 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <StaffDashboardLayout
      roleLabel="MANAGER"
      badgeColor="bg-sky-500"
      navItems={MANAGER_NAV}
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      headerTitle="Manager Dashboard"
      headerSubtitle={localStorage.getItem("username") || "Manager User"}
      headerDescription="Hotel operations"
    >
      {activeSection === "dashboard" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <MetricCard icon="🛏️" label="Total Rooms" value={rooms.length} iconBg="bg-purple-500" />
          <MetricCard icon="✓" label="Available Rooms" value={availableRooms} iconBg="bg-emerald-500" />
          <MetricCard icon="📅" label="Active Reservations" value={activeReservations} iconBg="bg-blue-500" />
        </div>
      )}

      {activeSection === "add-room" && (
        <section className="mb-8 space-y-6">
          <div className="rounded-3xl bg-white/70 backdrop-blur-lg border border-white/20 p-8 shadow-xl">
            <h2 className="text-2xl font-serif text-slate-900 mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Add New Room
            </h2>
            <div className="flex flex-wrap gap-3 items-end max-w-3xl">
              <select
                value={newRoom.type}
                onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value })}
                className="px-4 py-2.5 rounded-xl border-2 border-slate-200 bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 transition-all duration-300 outline-none"
              >
                {ROOM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <input
                type="number"
                placeholder="Price (LKR)"
                value={newRoom.price}
                onChange={(e) => setNewRoom({ ...newRoom, price: e.target.value })}
                className="px-4 py-2.5 rounded-xl border-2 border-slate-200 bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 transition-all duration-300 outline-none"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="px-4 py-2.5 rounded-xl border-2 border-slate-200 bg-white focus:border-sky-500 transition-all duration-300 outline-none file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
              />
              <button
                onClick={handleAddRoom}
                className="px-6 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl hover:shadow-lg hover:shadow-teal-500/50 transition-all duration-300 hover:scale-105 font-medium"
              >
                Add Room
              </button>
            </div>
          </div>

          <div className="rounded-3xl bg-white/70 backdrop-blur-lg border border-white/20 p-8 shadow-xl">
            <h3 className="text-xl font-serif text-slate-900 mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Added Rooms
            </h3>
            <p className="text-slate-600 text-sm mb-6">
              Rooms you add appear here. Update price, edit details, or delete.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {rooms.map((room, index) => (
                <div
                  key={room.id}
                  className="rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                    {((editingRoom?.id === room.id ? editingRoom.imageBase64 : null) || room.imageBase64) ? (
                      <img src={(editingRoom?.id === room.id ? editingRoom.imageBase64 : null) || room.imageBase64} alt={room.type} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-5xl text-slate-400">{(editingRoom?.id === room.id ? editingRoom?.type : room.type)?.charAt(0)}</span>
                    )}
                  </div>
                  <div className="p-4">
                    {editingRoom?.id === room.id ? (
                      <div className="space-y-3">
                        <select
                          value={editingRoom.type}
                          onChange={(e) => setEditingRoom({ ...editingRoom, type: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 focus:border-sky-500 outline-none text-sm"
                        >
                          {ROOM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <input
                          type="number"
                          value={editingRoom.price}
                          onChange={(e) => setEditingRoom({ ...editingRoom, price: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 focus:border-sky-500 outline-none"
                          placeholder="Price (LKR)"
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleEditRoomImageChange}
                          className="w-full text-sm file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-sky-50 file:text-sky-700"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={handleUpdateRoom}
                            className="flex-1 px-3 py-1.5 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700 font-medium"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingRoom(null)}
                            className="flex-1 px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-sm hover:bg-slate-300 font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-lg font-serif text-slate-900" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                          {room.type}
                        </p>
                        <p className="text-slate-700 font-semibold">LKR {room.price?.toLocaleString()}</p>
                        <p className="text-sm text-slate-500 mb-3">Room #{room.roomNumber || room.id}</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingRoom({ id: room.id, roomNumber: room.roomNumber, type: room.type, price: room.price, available: room.available ?? true })}
                            className="flex-1 px-3 py-1.5 bg-sky-50 text-sky-700 rounded-lg text-sm hover:bg-sky-100 font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteRoom(room.id)}
                            className="flex-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm hover:bg-red-100 font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {rooms.length === 0 && (
              <p className="text-slate-500 text-sm italic py-4">No rooms yet. Add your first room above.</p>
            )}
          </div>
        </section>
      )}

      {activeSection === "reservations" && (
        <section className="mb-8">
          <div className="rounded-3xl bg-white/70 backdrop-blur-lg border border-white/20 p-8 shadow-xl">
            <h2 className="text-2xl font-serif text-slate-900 mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              View Reservations
            </h2>
            <p className="text-slate-600 mb-6">
              All reservations across the resort. Use Cancel to cancel a booking.
            </p>
            <ul className="space-y-3 max-h-[600px] overflow-y-auto">
              {reservations.map((resv, index) => (
                <li
                  key={resv.reservationNumber}
                  className="p-5 rounded-xl bg-white border border-slate-200 hover:shadow-md transition-all duration-300 hover:scale-102"
                  style={{ animationDelay: `${index * 0.03}s` }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 text-lg mb-1">{resv.guestName}</p>
                      <p className="text-slate-600 text-sm mb-2">
                        {resv.roomType} • {resv.checkIn} to {resv.checkOut}
                      </p>
                      <p className="text-cyan-700 font-semibold">LKR {resv.totalBill?.toLocaleString()}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold">
                        {resv.roomType?.charAt(0)}
                      </div>
                      <button
                        onClick={() => handleCancelReservation(resv)}
                        className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-xs hover:bg-red-100 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {activeSection === "create-res" && (
        <section className="mb-8">
          <div className="rounded-3xl bg-white/70 backdrop-blur-lg border border-white/20 p-8 shadow-xl">
            <h2 className="text-2xl font-serif text-slate-900 mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Create Reservation
            </h2>
            <p className="text-slate-600 mb-6">
              Add a new walk-in or phone reservation. Select room type and dates first to see available rooms.
            </p>
            <div className="max-w-2xl space-y-4">
              <input
                placeholder="Guest Name *"
                value={newRes.guestName}
                onChange={(e) => setNewRes({ ...newRes, guestName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 transition-all duration-300 outline-none"
              />
              <input
                placeholder="Address *"
                value={newRes.address}
                onChange={(e) => setNewRes({ ...newRes, address: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 transition-all duration-300 outline-none"
              />
              <input
                placeholder="Contact (10 digits) *"
                value={newRes.contactNumber}
                onChange={(e) => setNewRes({ ...newRes, contactNumber: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                maxLength={10}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 transition-all duration-300 outline-none"
              />
              <select
                value={newRes.roomType}
                onChange={(e) => setNewRes({ ...newRes, roomType: e.target.value, roomId: "" })}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 transition-all duration-300 outline-none"
              >
                {ROOM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Select Room</label>
                <select
                  value={newRes.roomId}
                  onChange={(e) => setNewRes({ ...newRes, roomId: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 transition-all duration-300 outline-none"
                >
                  <option value="">Select room</option>
                  {roomsOfType.map((room) => {
                    const hasDates = newRes.checkIn && newRes.checkOut;
                    const isAvailable = !hasDates || availableRoomIds.has(room.id);
                    const price = room.price != null ? Number(room.price).toLocaleString() : "—";
                    const roomNum = room.roomNumber || `#${(room.id || "").slice(-6)}`;
                    const status = hasDates ? (isAvailable ? "✓ Available" : "✗ Booked") : "";
                    return (
                      <option
                        key={room.id}
                        value={room.id}
                        disabled={!isAvailable}
                      >
                        {room.type} • Room {roomNum} • LKR {price} {status && `(${status})`}
                      </option>
                    );
                  })}
                </select>
                <p className="text-xs text-slate-500 mt-1">
                  {roomsOfType.length} {newRes.roomType} room(s). {newRes.checkIn && newRes.checkOut ? "Available rooms only shown as selectable." : "Select check-in and check-out dates to see availability."}
                </p>
              </div>
              <input
                type="date"
                value={newRes.checkIn}
                min={today}
                onChange={(e) => setNewRes({ ...newRes, checkIn: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 transition-all duration-300 outline-none"
              />
              <input
                type="date"
                value={newRes.checkOut}
                min={newRes.checkIn || today}
                onChange={(e) => setNewRes({ ...newRes, checkOut: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 transition-all duration-300 outline-none"
              />
              <select
                value={newRes.checkInTime}
                onChange={(e) => setNewRes({ ...newRes, checkInTime: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 transition-all duration-300 outline-none"
              >
                {TIME_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <select
                value={newRes.checkOutTime}
                onChange={(e) => setNewRes({ ...newRes, checkOutTime: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 transition-all duration-300 outline-none"
              >
                {TIME_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <button
                onClick={handleAddReservation}
                className="w-full py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl hover:shadow-lg hover:shadow-teal-500/50 transition-all duration-300 hover:scale-105 font-medium"
              >
                Save Reservation
              </button>
            </div>
          </div>
        </section>
      )}

      {activeSection === "help" && (
        <section className="mb-8 space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-8 shadow-2xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl mb-6">👔</div>
                <h2 className="text-2xl font-serif mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Your Permissions</h2>
                <ul className="space-y-2 text-sm text-amber-50">
                  <li className="flex items-start gap-2"><span className="text-white mt-1">✓</span><span>Add, edit, and delete rooms</span></li>
                  <li className="flex items-start gap-2"><span className="text-white mt-1">✓</span><span>Update room pricing</span></li>
                  <li className="flex items-start gap-2"><span className="text-white mt-1">✓</span><span>Create and cancel reservations</span></li>
                  <li className="flex items-start gap-2"><span className="text-white mt-1">✓</span><span>View customer information</span></li>
                  <li className="flex items-start gap-2"><span className="opacity-50 mt-1">✗</span><span className="opacity-90">Cannot create or delete admins</span></li>
                </ul>
              </div>
            </div>
            <div className="space-y-6">
              <div className="rounded-2xl p-8 shadow-lg border border-white/20 bg-white/70 backdrop-blur-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white text-xl flex-shrink-0">📝</div>
                  <div>
                    <h3 className="text-lg font-serif text-slate-900 mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Add Reservation</h3>
                    <p className="text-slate-600 text-sm">Select room type and dates first to see available rooms. Choose a room, enter guest details and times, then save.</p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl p-8 shadow-lg border border-white/20 bg-white/70 backdrop-blur-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xl flex-shrink-0">👥</div>
                  <div>
                    <h3 className="text-lg font-serif text-slate-900 mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Customer Flow</h3>
                    <p className="text-slate-600 text-sm">Guests can book online or via reception. Use Create Reservation for walk-ins or phone bookings.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-2xl p-6 shadow-lg border border-white/20 bg-white/70 backdrop-blur-lg">
            <h3 className="text-lg font-serif text-slate-900 mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>🛏️ Add Room</h3>
            <p className="text-slate-600 text-sm">Use <strong>Add Room</strong> to add new rooms. Edit or delete existing rooms from the room cards. Changes apply immediately to new reservations.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl p-8 shadow-lg border-2 border-red-200 bg-gradient-to-br from-red-50 to-orange-50">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center text-xl flex-shrink-0">🔒</div>
                <div>
                  <h3 className="text-lg font-serif text-slate-900 mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Security</h3>
                  <p className="text-slate-700 text-sm">Log out when leaving your workstation. Never share credentials. Report any unauthorized access to IT.</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl p-8 shadow-lg border border-white/20 bg-white/70 backdrop-blur-lg text-center flex flex-col justify-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xl mx-auto mb-2">💬</div>
              <h3 className="text-lg font-serif text-slate-900 mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>IT Support</h3>
              <p className="text-slate-600 text-sm mb-3">Contact the IT department for technical support or password reset.</p>
              <button className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-full font-medium hover:shadow-lg text-sm self-center">Contact IT</button>
            </div>
          </div>
        </section>
      )}

      {activeSection === "customers" && (
        <section className="mb-8">
          <div className="rounded-3xl bg-white/70 backdrop-blur-lg border border-white/20 p-8 shadow-xl">
            <h2 className="text-2xl font-serif text-slate-900 mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Customers
            </h2>
            <ul className="space-y-3 max-h-[600px] overflow-y-auto">
              {customers.map((cust, index) => (
                <li
                  key={cust.id}
                  className="p-5 rounded-xl bg-white border border-slate-200 hover:shadow-md transition-all duration-300 hover:scale-102"
                  style={{ animationDelay: `${index * 0.03}s` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                      {(cust.name || cust.username)?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">{cust.name || cust.username}</p>
                      <p className="text-sm text-slate-600">{cust.username} • {cust.contactNumber || "N/A"}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Walk-in Reservation Modal */}
      {addResModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-[fadeIn_0.3s_ease-out]">
          <div className="bg-white/90 backdrop-blur-lg p-8 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20 animate-[slideUp_0.3s_ease-out]">
            <h3 className="text-2xl font-serif text-slate-900 mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Add Walk-in Reservation
            </h3>
            <div className="space-y-4">
              <input
                placeholder="Guest Name *"
                value={newRes.guestName}
                onChange={(e) => setNewRes({ ...newRes, guestName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 transition-all duration-300 outline-none"
              />
              <input
                placeholder="Address *"
                value={newRes.address}
                onChange={(e) => setNewRes({ ...newRes, address: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 transition-all duration-300 outline-none"
              />
              <input
                placeholder="Contact (10 digits) *"
                value={newRes.contactNumber}
                onChange={(e) => setNewRes({ ...newRes, contactNumber: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                maxLength={10}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 transition-all duration-300 outline-none"
              />
              <select
                value={newRes.roomType}
                onChange={(e) => setNewRes({ ...newRes, roomType: e.target.value, roomId: "" })}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 transition-all duration-300 outline-none"
              >
                {ROOM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Select Room</label>
                <select
                  value={newRes.roomId}
                  onChange={(e) => setNewRes({ ...newRes, roomId: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 transition-all duration-300 outline-none"
                >
                  <option value="">Select room</option>
                  {roomsOfType.map((room) => {
                    const hasDates = newRes.checkIn && newRes.checkOut;
                    const isAvailable = !hasDates || availableRoomIds.has(room.id);
                    const price = room.price != null ? Number(room.price).toLocaleString() : "—";
                    const roomNum = room.roomNumber || `#${(room.id || "").slice(-6)}`;
                    const status = hasDates ? (isAvailable ? "✓ Available" : "✗ Booked") : "";
                    return (
                      <option
                        key={room.id}
                        value={room.id}
                        disabled={!isAvailable}
                      >
                        {room.type} • Room {roomNum} • LKR {price} {status && `(${status})`}
                      </option>
                    );
                  })}
                </select>
                <p className="text-xs text-slate-500 mt-1">
                  {roomsOfType.length} {newRes.roomType} room(s). {newRes.checkIn && newRes.checkOut ? "Available rooms only shown as selectable." : "Select check-in and check-out dates to see availability."}
                </p>
              </div>
              <input
                type="date"
                value={newRes.checkIn}
                min={today}
                onChange={(e) => setNewRes({ ...newRes, checkIn: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 transition-all duration-300 outline-none"
              />
              <input
                type="date"
                value={newRes.checkOut}
                min={newRes.checkIn || today}
                onChange={(e) => setNewRes({ ...newRes, checkOut: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 transition-all duration-300 outline-none"
              />
              <select
                value={newRes.checkInTime}
                onChange={(e) => setNewRes({ ...newRes, checkInTime: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 transition-all duration-300 outline-none"
              >
                {TIME_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <select
                value={newRes.checkOutTime}
                onChange={(e) => setNewRes({ ...newRes, checkOutTime: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 transition-all duration-300 outline-none"
              >
                {TIME_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="mt-8 flex gap-3">
              <button
                onClick={handleAddReservation}
                className="flex-1 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl hover:shadow-lg hover:shadow-teal-500/50 transition-all duration-300 hover:scale-105 font-medium"
              >
                Save Reservation
              </button>
              <button
                onClick={() => setAddResModal(false)}
                className="flex-1 py-3 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-all duration-300 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Styles */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&display=swap');
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
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
    </StaffDashboardLayout>
  );
}