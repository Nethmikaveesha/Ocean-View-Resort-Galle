// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getRooms, getReservations, getCustomers, getAdmins, addRoom, addAdmin, deleteAdmin, deleteRoom, addReservation, getAvailableRoomsForDates } from "../Services/api";
// import { AuthContext } from "../context/AuthContext";
// import StaffDashboardLayout, { MetricCard } from "../components/StaffDashboardLayout";
// import { ROLE_ADMIN, ADMIN_ROLE_OPTIONS, ADMIN_SUBROLES } from "../constants/roles";

// const ROOM_TYPES = ["Single", "Double", "Deluxe"];
// const TIME_OPTIONS = ["12:00 AM", "6:00 AM", "9:00 AM", "12:00 PM", "3:00 PM", "6:00 PM", "9:00 PM"];

// const ADMIN_NAV = [
//   { id: "dashboard", label: "Dashboard", icon: "📊" },
//   { id: "manage-admins", label: "Manage Admins", icon: "👥" },
//   { id: "rooms", label: "View Rooms", icon: "🛏️" },
//   { id: "reservations", label: "View Reservations", icon: "📅" },
//   { id: "customers", label: "View Customers", icon: "👤" },
// ];

// export default function AdminDashboard() {
//   const navigate = useNavigate();
//   const { logout } = React.useContext(AuthContext);
//   const [loading, setLoading] = useState(true);
//   const [activeSection, setActiveSection] = useState("dashboard");
//   const [rooms, setRooms] = useState([]);
//   const [reservations, setReservations] = useState([]);
//   const [customers, setCustomers] = useState([]);
//   const [admins, setAdmins] = useState([]);
//   const [newAdmin, setNewAdmin] = useState({ username: "", password: "", role: ADMIN_SUBROLES.RECEPTIONIST });
//   const [newRoom, setNewRoom] = useState({ type: "Single", price: 10000, imageBase64: "" });
//   const [addResModal, setAddResModal] = useState(false);
//   const [newRes, setNewRes] = useState({ guestName: "", address: "", contactNumber: "", roomType: "Single", roomId: "", checkIn: "", checkOut: "", checkInTime: "12:00 PM", checkOutTime: "11:00 AM" });
//   const [availableRoomsForRes, setAvailableRoomsForRes] = useState([]);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const [r, res, c, a] = await Promise.all([getRooms(), getReservations(), getCustomers(), getAdmins().catch(() => [])]);
//       setRooms(r || []);
//       setReservations(res || []);
//       setCustomers(c || []);
//       setAdmins(a || []);
//     } catch (err) {
//       if (err?.response?.status === 403 || err?.response?.status === 401) {
//         localStorage.removeItem("token");
//         localStorage.removeItem("userRole");
//         navigate("/login");
//       } else {
//         console.error(err);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (localStorage.getItem("userRole") === ROLE_ADMIN && !localStorage.getItem("token")) {
//       navigate("/login");
//       return;
//     }
//     fetchData();
//   }, [navigate]);

//   const handleImageChange = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onloadend = () => setNewRoom((prev) => ({ ...prev, imageBase64: reader.result }));
//     reader.readAsDataURL(file);
//   };

//   const handleAddRoom = async () => {
//     if (!newRoom.type || !newRoom.price) {
//       alert("Type and price are required.");
//       return;
//     }
//     try {
//       await addRoom({ type: newRoom.type, price: Number(newRoom.price), imageBase64: newRoom.imageBase64 || undefined, available: true });
//       alert("Room added successfully!");
//       setNewRoom({ type: "Single", price: 10000, imageBase64: "" });
//       fetchData();
//     } catch (err) {
//       alert("Failed to add room: " + (err?.response?.data?.message || "Try again."));
//     }
//   };

//   const handleDeleteRoom = async (id) => {
//     if (!window.confirm("Delete this room?")) return;
//     try {
//       await deleteRoom(id);
//       alert("Room deleted.");
//       fetchData();
//     } catch (_) {
//       alert("Failed to delete.");
//     }
//   };

//   const handleAddReservation = async () => {
//     if (!newRes.guestName || !newRes.checkIn || !newRes.checkOut || !newRes.roomId) {
//       alert("Please fill guest name, dates, and select a room.");
//       return;
//     }
//     try {
//       await addReservation({ ...newRes, customerUsername: null });
//       alert("Reservation added successfully!");
//       setAddResModal(false);
//       setNewRes({ guestName: "", address: "", contactNumber: "", roomType: "Single", roomId: "", checkIn: "", checkOut: "", checkInTime: "12:00 PM", checkOutTime: "11:00 AM" });
//       fetchData();
//     } catch (err) {
//       alert("Failed: " + (err?.response?.data?.message || "Try again."));
//     }
//   };

//   const handleDeleteAdmin = async (adminToDelete) => {
//     if (adminToDelete.username === localStorage.getItem("username")) {
//       alert("You cannot delete yourself.");
//       return;
//     }
//     if (!window.confirm(`Delete admin "${adminToDelete.username}"?`)) return;
//     try {
//       await deleteAdmin(adminToDelete.id);
//       alert("Admin deleted.");
//       fetchData();
//     } catch (err) {
//       alert("Failed: " + (err?.response?.data?.message || "Cannot delete."));
//     }
//   };

//   const handleAddAdmin = async () => {
//     if (!newAdmin.username || !newAdmin.password || newAdmin.password.length < 6) {
//       alert("Username and password (min 6 chars) required.");
//       return;
//     }
//     try {
//       await addAdmin(newAdmin);
//       alert("Admin created successfully!");
//       setNewAdmin({ username: "", password: "", role: ADMIN_SUBROLES.RECEPTIONIST });
//       fetchData();
//     } catch (err) {
//       alert("Failed: " + (err?.response?.data?.message || "Username may already exist."));
//     }
//   };

//   const today = new Date().toISOString().split("T")[0];

//   useEffect(() => {
//     if (!addResModal || !newRes.checkIn || !newRes.checkOut || !newRes.roomType) return;
//     getAvailableRoomsForDates(newRes.roomType, newRes.checkIn, newRes.checkOut)
//       .then((r) => setAvailableRoomsForRes(r || []))
//       .catch(() => setAvailableRoomsForRes([]));
//   }, [addResModal, newRes.checkIn, newRes.checkOut, newRes.roomType]);

//   const staffCount = admins.length;
//   const todayDate = new Date().toISOString().split("T")[0];
//   const activeReservations = reservations.filter((r) => r.checkIn <= todayDate && r.checkOut >= todayDate).length;

//   if (loading && rooms.length === 0 && reservations.length === 0) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <div className="text-center">
//           <div className="inline-block w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mb-4" />
//           <p className="text-gray-600">Loading dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <StaffDashboardLayout
//       roleLabel="ADMIN"
//       badgeColor="bg-pink-500"
//       navItems={ADMIN_NAV}
//       activeSection={activeSection}
//       onSectionChange={setActiveSection}
//       headerTitle="Admin Dashboard"
//       headerSubtitle={localStorage.getItem("username") || "Admin User"}
//       headerDescription="Full system access"
//     >
//       {activeSection === "dashboard" && (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//           <MetricCard icon="👥" label="Total Staff" value={staffCount} iconBg="bg-purple-500" />
//           <MetricCard icon="🛏️" label="Total Rooms" value={rooms.length} iconBg="bg-pink-500" />
//           <MetricCard icon="📅" label="Active Reservations" value={activeReservations} iconBg="bg-blue-500" />
//         </div>
//       )}

//       {activeSection === "manage-admins" && (
//         <section className="mb-8">
//           <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm">
//             <h2 className="text-xl font-bold mb-4">Manage Admins</h2>
//             <div className="flex flex-wrap gap-3 items-end mb-6">
//               <input placeholder="Username" value={newAdmin.username} onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })} className="border p-2 rounded-lg" />
//               <input type="password" placeholder="Password (min 6)" value={newAdmin.password} onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })} className="border p-2 rounded-lg" />
//               <select value={newAdmin.role} onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })} className="border p-2 rounded-lg">
//                 {ADMIN_ROLE_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
//               </select>
//               <button onClick={handleAddAdmin} className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600">Add Admin</button>
//             </div>
//             <ul className="space-y-2">
//               {admins.map((a) => (
//                 <li key={a.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
//                   <span>{a.username} ({a.role})</span>
//                   <button onClick={() => handleDeleteAdmin(a)} className="text-red-600 text-sm hover:underline">Delete</button>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </section>
//       )}

//       {activeSection === "rooms" && (
//         <section className="mb-8">
//           <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm mb-6">
//             <h2 className="text-xl font-bold mb-4">Add New Room</h2>
//             <div className="flex flex-wrap gap-3 items-end">
//               <select value={newRoom.type} onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value })} className="border p-2 rounded-lg">
//                 {ROOM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
//               </select>
//               <input type="number" placeholder="Price (LKR)" value={newRoom.price} onChange={(e) => setNewRoom({ ...newRoom, price: e.target.value })} className="border p-2 rounded-lg" />
//               <input type="file" accept="image/*" onChange={handleImageChange} className="border p-2 rounded-lg" />
//               <button onClick={handleAddRoom} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">Add Room</button>
//             </div>
//           </div>
//           <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//             {rooms.map((room) => (
//               <div key={room.id} className="rounded-xl border border-gray-200 p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
//                 {room.imageBase64 && <img src={room.imageBase64} alt={room.type} className="w-full h-32 object-cover rounded-lg mb-3" />}
//                 <p className="font-semibold">{room.type} - LKR {room.price?.toLocaleString()}</p>
//                 <p className="text-sm text-gray-600">#{room.roomNumber || room.id}</p>
//                 <button onClick={() => handleDeleteRoom(room.id)} className="mt-2 text-red-600 text-sm hover:underline">Delete</button>
//               </div>
//             ))}
//           </div>
//           <button onClick={() => setAddResModal(true)} className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Add Walk-in Reservation</button>
//         </section>
//       )}

//       {activeSection === "reservations" && (
//         <section className="mb-8">
//           <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm">
//             <h2 className="text-xl font-bold mb-4">Reservations</h2>
//             <ul className="divide-y divide-gray-100 max-h-96 overflow-y-auto rounded-lg border border-gray-100">
//               {reservations.map((resv) => (
//                 <li key={resv.reservationNumber} className="p-4 hover:bg-gray-50">
//                   <span className="font-medium">{resv.guestName}</span> — {resv.roomType} | {resv.checkIn} to {resv.checkOut} | LKR {resv.totalBill?.toLocaleString()}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </section>
//       )}

//       {activeSection === "customers" && (
//         <section className="mb-8">
//           <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm">
//             <h2 className="text-xl font-bold mb-4">Customers</h2>
//             <ul className="divide-y divide-gray-100 max-h-96 overflow-y-auto rounded-lg border border-gray-100">
//               {customers.map((cust) => (
//                 <li key={cust.id} className="p-4 hover:bg-gray-50">
//                   {cust.name || cust.username} — {cust.username} — {cust.contactNumber || "N/A"}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </section>
//       )}

//       {/* Walk-in Reservation Modal */}
//       {addResModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white p-6 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl">
//             <h3 className="font-bold text-lg mb-4">Add Walk-in Reservation</h3>
//             <div className="space-y-3">
//               <input placeholder="Guest Name" value={newRes.guestName} onChange={(e) => setNewRes({ ...newRes, guestName: e.target.value })} className="border p-2 w-full rounded-lg" />
//               <input placeholder="Address" value={newRes.address} onChange={(e) => setNewRes({ ...newRes, address: e.target.value })} className="border p-2 w-full rounded-lg" />
//               <input placeholder="Contact" value={newRes.contactNumber} onChange={(e) => setNewRes({ ...newRes, contactNumber: e.target.value })} className="border p-2 w-full rounded-lg" />
//               <select value={newRes.roomType} onChange={(e) => setNewRes({ ...newRes, roomType: e.target.value, roomId: "" })} className="border p-2 w-full rounded-lg">
//                 {ROOM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
//               </select>
//               <select value={newRes.roomId} onChange={(e) => setNewRes({ ...newRes, roomId: e.target.value })} className="border p-2 w-full rounded-lg">
//                 <option value="">Select room</option>
//                 {availableRoomsForRes.map((room) => (
//                   <option key={room.id} value={room.id}>{room.type} #{room.roomNumber || room.id} - LKR {room.price}</option>
//                 ))}
//               </select>
//               <input type="date" value={newRes.checkIn} min={today} onChange={(e) => setNewRes({ ...newRes, checkIn: e.target.value })} className="border p-2 w-full rounded-lg" />
//               <input type="date" value={newRes.checkOut} min={newRes.checkIn || today} onChange={(e) => setNewRes({ ...newRes, checkOut: e.target.value })} className="border p-2 w-full rounded-lg" />
//               <select value={newRes.checkInTime} onChange={(e) => setNewRes({ ...newRes, checkInTime: e.target.value })} className="border p-2 w-full rounded-lg">
//                 {TIME_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
//               </select>
//               <select value={newRes.checkOutTime} onChange={(e) => setNewRes({ ...newRes, checkOutTime: e.target.value })} className="border p-2 w-full rounded-lg">
//                 {TIME_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
//               </select>
//             </div>
//             <div className="mt-6 flex gap-3">
//               <button onClick={handleAddReservation} className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">Save</button>
//               <button onClick={() => setAddResModal(false)} className="flex-1 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500">Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </StaffDashboardLayout>
//   );
// }

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRooms, getReservations, getCustomers, getAdmins, addRoom, addAdmin, deleteAdmin, deleteRoom, addReservation, getAvailableRoomsForDates } from "../Services/api";
import { AuthContext } from "../context/AuthContext";
import StaffDashboardLayout, { MetricCard } from "../components/StaffDashboardLayout";
import { ROLE_ADMIN, ADMIN_ROLE_OPTIONS, ADMIN_SUBROLES } from "../constants/roles";

const ROOM_TYPES = ["Single", "Double", "Deluxe"];
const TIME_OPTIONS = ["12:00 AM", "6:00 AM", "9:00 AM", "12:00 PM", "3:00 PM", "6:00 PM", "9:00 PM"];

const ADMIN_NAV = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "manage-admins", label: "Manage Admins", icon: "👥" },
  { id: "rooms", label: "View Rooms", icon: "🛏️" },
  { id: "reservations", label: "View Reservations", icon: "📅" },
  { id: "customers", label: "View Customers", icon: "👤" },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = React.useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [rooms, setRooms] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [newAdmin, setNewAdmin] = useState({ username: "", password: "", role: ADMIN_SUBROLES.RECEPTIONIST });
  const [newRoom, setNewRoom] = useState({ type: "Single", price: 10000, imageBase64: "" });
  const [addResModal, setAddResModal] = useState(false);
  const [newRes, setNewRes] = useState({ guestName: "", address: "", contactNumber: "", roomType: "Single", roomId: "", checkIn: "", checkOut: "", checkInTime: "12:00 PM", checkOutTime: "11:00 AM" });
  const [availableRoomsForRes, setAvailableRoomsForRes] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [r, res, c, a] = await Promise.all([getRooms(), getReservations(), getCustomers(), getAdmins().catch(() => [])]);
      setRooms(r || []);
      setReservations(res || []);
      setCustomers(c || []);
      setAdmins(a || []);
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
    if (localStorage.getItem("userRole") === ROLE_ADMIN && !localStorage.getItem("token")) {
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
      alert("Failed to add room: " + (err?.response?.data?.message || "Try again."));
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
      await addReservation({ ...newRes, customerUsername: null });
      alert("Reservation added successfully!");
      setAddResModal(false);
      setNewRes({ guestName: "", address: "", contactNumber: "", roomType: "Single", roomId: "", checkIn: "", checkOut: "", checkInTime: "12:00 PM", checkOutTime: "11:00 AM" });
      fetchData();
    } catch (err) {
      alert("Failed: " + (err?.response?.data?.message || "Try again."));
    }
  };

  const handleDeleteAdmin = async (adminToDelete) => {
    if (adminToDelete.username === localStorage.getItem("username")) {
      alert("You cannot delete yourself.");
      return;
    }
    if (!window.confirm(`Delete admin "${adminToDelete.username}"?`)) return;
    try {
      await deleteAdmin(adminToDelete.id);
      alert("Admin deleted.");
      fetchData();
    } catch (err) {
      alert("Failed: " + (err?.response?.data?.message || "Cannot delete."));
    }
  };

  const handleAddAdmin = async () => {
    if (!newAdmin.username || !newAdmin.password || newAdmin.password.length < 6) {
      alert("Username and password (min 6 chars) required.");
      return;
    }
    try {
      await addAdmin(newAdmin);
      alert("Admin created successfully!");
      setNewAdmin({ username: "", password: "", role: ADMIN_SUBROLES.RECEPTIONIST });
      fetchData();
    } catch (err) {
      alert("Failed: " + (err?.response?.data?.message || "Username may already exist."));
    }
  };

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!addResModal || !newRes.checkIn || !newRes.checkOut || !newRes.roomType) return;
    getAvailableRoomsForDates(newRes.roomType, newRes.checkIn, newRes.checkOut)
      .then((r) => setAvailableRoomsForRes(r || []))
      .catch(() => setAvailableRoomsForRes([]));
  }, [addResModal, newRes.checkIn, newRes.checkOut, newRes.roomType]);

  const staffCount = admins.length;
  const todayDate = new Date().toISOString().split("T")[0];
  const activeReservations = reservations.filter((r) => r.checkIn <= todayDate && r.checkOut >= todayDate).length;

  if (loading && rooms.length === 0 && reservations.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-slate-600 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <StaffDashboardLayout
      roleLabel="ADMIN"
      badgeColor="bg-pink-500"
      navItems={ADMIN_NAV}
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      headerTitle="Admin Dashboard"
      headerSubtitle={localStorage.getItem("username") || "Admin User"}
      headerDescription="Full system access"
    >
      {activeSection === "dashboard" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <MetricCard icon="👥" label="Total Staff" value={staffCount} iconBg="bg-purple-500" />
          <MetricCard icon="🛏️" label="Total Rooms" value={rooms.length} iconBg="bg-pink-500" />
          <MetricCard icon="📅" label="Active Reservations" value={activeReservations} iconBg="bg-blue-500" />
        </div>
      )}

      {activeSection === "manage-admins" && (
        <section className="mb-8">
          <div className="rounded-3xl bg-white/70 backdrop-blur-lg border border-white/20 p-8 shadow-xl">
            <h2 className="text-2xl font-serif text-slate-900 mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Manage Admins
            </h2>
            <div className="flex flex-wrap gap-3 items-end mb-8 p-6 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl border border-pink-100">
              <input
                placeholder="Username"
                value={newAdmin.username}
                onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
                className="px-4 py-2.5 rounded-xl border-2 border-slate-200 bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 transition-all duration-300 outline-none"
              />
              <input
                type="password"
                placeholder="Password (min 6)"
                value={newAdmin.password}
                onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                className="px-4 py-2.5 rounded-xl border-2 border-slate-200 bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 transition-all duration-300 outline-none"
              />
              <select
                value={newAdmin.role}
                onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
                className="px-4 py-2.5 rounded-xl border-2 border-slate-200 bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 transition-all duration-300 outline-none"
              >
                {ADMIN_ROLE_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
              <button
                onClick={handleAddAdmin}
                className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl hover:shadow-lg hover:shadow-pink-500/50 transition-all duration-300 hover:scale-105 font-medium"
              >
                Add Admin
              </button>
            </div>
            <ul className="space-y-2">
              {admins.map((a, index) => (
                <li
                  key={a.id}
                  className="flex justify-between items-center py-4 px-6 rounded-xl bg-white border border-slate-200 hover:shadow-md transition-all duration-300 hover:scale-102"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold">
                      {a.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{a.username}</p>
                      <p className="text-sm text-slate-500">{a.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteAdmin(a)}
                    className="px-4 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm hover:bg-red-100 transition-colors font-medium"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {activeSection === "rooms" && (
        <section className="mb-8">
          <div className="rounded-3xl bg-white/70 backdrop-blur-lg border border-white/20 p-8 shadow-xl mb-6">
            <h2 className="text-2xl font-serif text-slate-900 mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Add New Room
            </h2>
            <div className="flex flex-wrap gap-3 items-end">
              <select
                value={newRoom.type}
                onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value })}
                className="px-4 py-2.5 rounded-xl border-2 border-slate-200 bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 transition-all duration-300 outline-none"
              >
                {ROOM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <input
                type="number"
                placeholder="Price (LKR)"
                value={newRoom.price}
                onChange={(e) => setNewRoom({ ...newRoom, price: e.target.value })}
                className="px-4 py-2.5 rounded-xl border-2 border-slate-200 bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 transition-all duration-300 outline-none"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="px-4 py-2.5 rounded-xl border-2 border-slate-200 bg-white focus:border-pink-500 transition-all duration-300 outline-none file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
              />
              <button
                onClick={handleAddRoom}
                className="px-6 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl hover:shadow-lg hover:shadow-teal-500/50 transition-all duration-300 hover:scale-105 font-medium"
              >
                Add Room
              </button>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room, index) => (
              <div
                key={room.id}
                className="rounded-2xl overflow-hidden bg-white/70 backdrop-blur-lg border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                  {room.imageBase64 ? (
                    <img src={room.imageBase64} alt={room.type} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-6xl text-slate-400">{room.type?.charAt(0)}</span>
                  )}
                </div>
                <div className="p-5">
                  <p className="text-xl font-serif text-slate-900 mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {room.type}
                  </p>
                  <p className="text-lg font-semibold text-cyan-700 mb-1">LKR {room.price?.toLocaleString()}</p>
                  <p className="text-sm text-slate-500 mb-4">Room #{room.roomNumber || room.id}</p>
                  <button
                    onClick={() => handleDeleteRoom(room.id)}
                    className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm hover:bg-red-100 transition-colors font-medium"
                  >
                    Delete Room
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setAddResModal(true)}
            className="mt-8 px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105 font-medium"
          >
            Add Walk-in Reservation
          </button>
        </section>
      )}

      {activeSection === "reservations" && (
        <section className="mb-8">
          <div className="rounded-3xl bg-white/70 backdrop-blur-lg border border-white/20 p-8 shadow-xl">
            <h2 className="text-2xl font-serif text-slate-900 mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Reservations
            </h2>
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
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold">
                      {resv.roomType?.charAt(0)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
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
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg">
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
                placeholder="Guest Name"
                value={newRes.guestName}
                onChange={(e) => setNewRes({ ...newRes, guestName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 transition-all duration-300 outline-none"
              />
              <input
                placeholder="Address"
                value={newRes.address}
                onChange={(e) => setNewRes({ ...newRes, address: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 transition-all duration-300 outline-none"
              />
              <input
                placeholder="Contact"
                value={newRes.contactNumber}
                onChange={(e) => setNewRes({ ...newRes, contactNumber: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 transition-all duration-300 outline-none"
              />
              <select
                value={newRes.roomType}
                onChange={(e) => setNewRes({ ...newRes, roomType: e.target.value, roomId: "" })}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 transition-all duration-300 outline-none"
              >
                {ROOM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <select
                value={newRes.roomId}
                onChange={(e) => setNewRes({ ...newRes, roomId: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 transition-all duration-300 outline-none"
              >
                <option value="">Select room</option>
                {availableRoomsForRes.map((room) => (
                  <option key={room.id} value={room.id}>{room.type} #{room.roomNumber || room.id} - LKR {room.price}</option>
                ))}
              </select>
              <input
                type="date"
                value={newRes.checkIn}
                min={today}
                onChange={(e) => setNewRes({ ...newRes, checkIn: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 transition-all duration-300 outline-none"
              />
              <input
                type="date"
                value={newRes.checkOut}
                min={newRes.checkIn || today}
                onChange={(e) => setNewRes({ ...newRes, checkOut: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 transition-all duration-300 outline-none"
              />
              <select
                value={newRes.checkInTime}
                onChange={(e) => setNewRes({ ...newRes, checkInTime: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 transition-all duration-300 outline-none"
              >
                {TIME_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <select
                value={newRes.checkOutTime}
                onChange={(e) => setNewRes({ ...newRes, checkOutTime: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 transition-all duration-300 outline-none"
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
