import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRooms, getReservations, getCustomers, addRoom, updateRoom, deleteRoom, addReservation, deleteReservation, getAvailableRoomsForDates } from "../Services/api";
import { AuthContext } from "../context/AuthContext";
import StaffDashboardLayout, { MetricCard } from "../components/StaffDashboardLayout";
import { ROLE_MANAGER } from "../constants/roles";

const ROOM_TYPES = ["Single", "Double", "Deluxe"];
const TIME_OPTIONS = ["12:00 AM", "6:00 AM", "9:00 AM", "12:00 PM", "3:00 PM", "6:00 PM", "9:00 PM"];

const MANAGER_NAV = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "rooms", label: "Manage Rooms", icon: "🛏️" },
  { id: "add-room", label: "Add Room", icon: "➕" },
  { id: "pricing", label: "Update Pricing", icon: "💰" },
  { id: "reservations", label: "View Reservations", icon: "📅" },
  { id: "create-res", label: "Create Reservation", icon: "➕" },
  { id: "customers", label: "View Customers", icon: "👤" },
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
        navigate("/login");
      } else {
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("userRole") !== ROLE_MANAGER || !localStorage.getItem("token")) {
      navigate("/login");
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

  const handleAddRoom = async () => {
    if (!newRoom.type || !newRoom.price) {
      alert("Type and price are required.");
      return;
    }
    try {
      await addRoom({ type: newRoom.type, price: Number(newRoom.price), imageBase64: newRoom.imageBase64 || undefined, available: true });
      alert("Room added successfully!");
      setNewRoom({ type: "Single", price: 10000, imageBase64: "" });
      fetchData();
    } catch (err) {
      alert("Failed: " + (err?.response?.data?.message || "Try again."));
    }
  };

  const handleUpdateRoom = async () => {
    if (!editingRoom || !editingRoom.price) return;
    try {
      await updateRoom(editingRoom.id, { ...editingRoom, price: Number(editingRoom.price) });
      alert("Room updated!");
      setEditingRoom(null);
      fetchData();
    } catch (err) {
      alert("Failed: " + (err?.response?.data?.message || "Try again."));
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

  const handleCancelReservation = async (resv) => {
    if (!window.confirm(`Cancel reservation ${resv.reservationNumber}?`)) return;
    try {
      await deleteReservation(resv.reservationNumber);
      alert("Reservation cancelled.");
      fetchData();
    } catch (err) {
      alert("Failed: " + (err?.response?.data?.message || "Try again."));
    }
  };

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
  const todayDate = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!addResModal || !newRes.checkIn || !newRes.checkOut || !newRes.roomType) return;
    getAvailableRoomsForDates(newRes.roomType, newRes.checkIn, newRes.checkOut)
      .then((r) => setAvailableRoomsForRes(r || []))
      .catch(() => setAvailableRoomsForRes([]));
  }, [addResModal, newRes.checkIn, newRes.checkOut, newRes.roomType]);

  const availableRooms = rooms.filter((r) => r.available !== false).length;
  const activeReservations = reservations.filter((r) => r.checkIn <= todayDate && r.checkOut >= todayDate).length;
  if (loading && rooms.length === 0 && reservations.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
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

      {(activeSection === "rooms" || activeSection === "pricing") && (
        <section className="mb-8">
          <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">{activeSection === "pricing" ? "Update Room Price" : "Manage Rooms"}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {rooms.map((room) => (
                <div key={room.id} className="rounded-xl border border-gray-200 p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                  {room.imageBase64 && <img src={room.imageBase64} alt={room.type} className="w-full h-32 object-cover rounded-lg mb-3" />}
                  {editingRoom?.id === room.id ? (
                    <div>
                      <input type="number" value={editingRoom.price} onChange={(e) => setEditingRoom({ ...editingRoom, price: e.target.value })} className="border p-2 w-full rounded-lg mb-2" placeholder="Price (LKR)" />
                      <button onClick={handleUpdateRoom} className="text-green-600 text-sm mr-2">Save</button>
                      <button onClick={() => setEditingRoom(null)} className="text-gray-600 text-sm">Cancel</button>
                    </div>
                  ) : (
                    <>
                      <p className="font-semibold">{room.type} - LKR {room.price?.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">#{room.roomNumber || room.id}</p>
                      <div className="mt-2 flex gap-2">
                        <button onClick={() => setEditingRoom({ ...room })} className="text-sky-600 text-sm hover:underline">Update price</button>
                        <button onClick={() => handleDeleteRoom(room.id)} className="text-red-600 text-sm hover:underline">Delete</button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {activeSection === "add-room" && (
        <section className="mb-8">
          <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Add New Room</h2>
            <div className="flex flex-wrap gap-3 items-end max-w-2xl">
              <select value={newRoom.type} onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value })} className="border p-2 rounded-lg">
                {ROOM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <input type="number" placeholder="Price (LKR)" value={newRoom.price} onChange={(e) => setNewRoom({ ...newRoom, price: e.target.value })} className="border p-2 rounded-lg" />
              <input type="file" accept="image/*" onChange={handleImageChange} className="border p-2 rounded-lg" />
              <button onClick={handleAddRoom} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">Add Room</button>
            </div>
          </div>
        </section>
      )}

      {(activeSection === "reservations" || activeSection === "create-res") && (
        <section className="mb-8">
          <button onClick={() => setAddResModal(true)} className="mb-6 bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700">Create Walk-in Reservation</button>
          <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Reservations</h2>
            <ul className="divide-y divide-gray-100 max-h-96 overflow-y-auto rounded-lg border border-gray-100">
              {reservations.map((resv) => (
                <li key={resv.reservationNumber} className="p-4 hover:bg-gray-50 flex justify-between items-center">
                  <span><span className="font-medium">{resv.guestName}</span> — {resv.roomType} | {resv.checkIn} to {resv.checkOut} | LKR {resv.totalBill?.toLocaleString()}</span>
                  <button onClick={() => handleCancelReservation(resv)} className="text-red-600 text-sm hover:underline">Cancel</button>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {activeSection === "customers" && (
        <section className="mb-8">
          <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Customers</h2>
            <ul className="divide-y divide-gray-100 max-h-96 overflow-y-auto rounded-lg border border-gray-100">
              {customers.map((cust) => (
                <li key={cust.id} className="p-4 hover:bg-gray-50">
                  {cust.name || cust.username} — {cust.username} — {cust.contactNumber || "N/A"}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {addResModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <h3 className="font-bold text-lg mb-4">Add Walk-in Reservation</h3>
            <div className="space-y-3">
              <input placeholder="Guest Name" value={newRes.guestName} onChange={(e) => setNewRes({ ...newRes, guestName: e.target.value })} className="border p-2 w-full rounded-lg" />
              <input placeholder="Address" value={newRes.address} onChange={(e) => setNewRes({ ...newRes, address: e.target.value })} className="border p-2 w-full rounded-lg" />
              <input placeholder="Contact" value={newRes.contactNumber} onChange={(e) => setNewRes({ ...newRes, contactNumber: e.target.value })} className="border p-2 w-full rounded-lg" />
              <select value={newRes.roomType} onChange={(e) => setNewRes({ ...newRes, roomType: e.target.value, roomId: "" })} className="border p-2 w-full rounded-lg">
                {ROOM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <select value={newRes.roomId} onChange={(e) => setNewRes({ ...newRes, roomId: e.target.value })} className="border p-2 w-full rounded-lg">
                <option value="">Select room</option>
                {availableRoomsForRes.map((room) => (
                  <option key={room.id} value={room.id}>{room.type} #{room.roomNumber || room.id} - LKR {room.price}</option>
                ))}
              </select>
              <input type="date" value={newRes.checkIn} min={today} onChange={(e) => setNewRes({ ...newRes, checkIn: e.target.value })} className="border p-2 w-full rounded-lg" />
              <input type="date" value={newRes.checkOut} min={newRes.checkIn || today} onChange={(e) => setNewRes({ ...newRes, checkOut: e.target.value })} className="border p-2 w-full rounded-lg" />
              <select value={newRes.checkInTime} onChange={(e) => setNewRes({ ...newRes, checkInTime: e.target.value })} className="border p-2 w-full rounded-lg">
                {TIME_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <select value={newRes.checkOutTime} onChange={(e) => setNewRes({ ...newRes, checkOutTime: e.target.value })} className="border p-2 w-full rounded-lg">
                {TIME_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={handleAddReservation} className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">Save</button>
              <button onClick={() => setAddResModal(false)} className="flex-1 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </StaffDashboardLayout>
  );
}
