// import React, { useEffect, useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { getRooms, getReservations, addReservation, getAvailableRoomsForDates } from "../Services/api";
// import { AuthContext } from "../context/AuthContext";
// import StaffDashboardLayout, { MetricCard } from "../components/StaffDashboardLayout";
// import { ROLE_RECEPTIONIST } from "../constants/roles";

// const ROOM_TYPES = ["Single", "Double", "Deluxe"];
// const TIME_OPTIONS = ["12:00 AM", "6:00 AM", "9:00 AM", "12:00 PM", "3:00 PM", "6:00 PM", "9:00 PM"];

// const RECEPTIONIST_NAV = [
//   { id: "dashboard", label: "Dashboard", icon: "📊" },
//   { id: "walk-in", label: "Walk-in Reservation", icon: "📝" },
//   { id: "reservations", label: "View Reservations", icon: "📅" },
//   { id: "availability", label: "Check Availability", icon: "✓" },
//   { id: "rooms", label: "View Rooms", icon: "🛏️" },
// ];

// export default function ReceptionistDashboard() {
//   const navigate = useNavigate();
//   const { logout } = React.useContext(AuthContext);
//   const [loading, setLoading] = useState(true);
//   const [activeSection, setActiveSection] = useState("dashboard");
//   const [rooms, setRooms] = useState([]);
//   const [reservations, setReservations] = useState([]);
//   const [addResModal, setAddResModal] = useState(false);
//   const [newRes, setNewRes] = useState({ guestName: "", address: "", contactNumber: "", roomType: "Single", roomId: "", checkIn: "", checkOut: "", checkInTime: "12:00 PM", checkOutTime: "11:00 AM" });
//   const [availableRoomsForRes, setAvailableRoomsForRes] = useState([]);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const [r, res] = await Promise.all([getRooms(), getReservations()]);
//       setRooms(r || []);
//       setReservations(res || []);
//     } catch (err) {
//       if (err?.response?.status === 403 || err?.response?.status === 401) {
//         localStorage.removeItem("token");
//         localStorage.removeItem("userRole");
//         navigate("/staff-login");
//       } else {
//         console.error(err);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (localStorage.getItem("userRole") !== ROLE_RECEPTIONIST || !localStorage.getItem("token")) {
//       navigate("/staff-login");
//       return;
//     }
//     fetchData();
//   }, [navigate]);

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

//   const today = new Date().toISOString().split("T")[0];

//   useEffect(() => {
//     if (!addResModal || !newRes.checkIn || !newRes.checkOut || !newRes.roomType) return;
//     getAvailableRoomsForDates(newRes.roomType, newRes.checkIn, newRes.checkOut)
//       .then((r) => setAvailableRoomsForRes(r || []))
//       .catch(() => setAvailableRoomsForRes([]));
//   }, [addResModal, newRes.checkIn, newRes.checkOut, newRes.roomType]);

//   const todayCheckIns = reservations.filter((r) => r.checkIn === today).length;
//   const availableRooms = rooms.filter((r) => r.available !== false).length;
//   const occupiedRooms = reservations.filter((r) => {
//     const todayDate = new Date().toISOString().split("T")[0];
//     return r.checkIn <= todayDate && r.checkOut >= todayDate;
//   }).length;

//   if (loading && rooms.length === 0 && reservations.length === 0) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <div className="text-center">
//           <div className="inline-block w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
//           <p className="text-gray-600">Loading dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <StaffDashboardLayout
//       roleLabel="RECEPTIONIST"
//       badgeColor="bg-emerald-500"
//       navItems={RECEPTIONIST_NAV}
//       activeSection={activeSection}
//       onSectionChange={setActiveSection}
//       headerTitle="Receptionist Dashboard"
//       headerSubtitle={localStorage.getItem("username") || "Receptionist User"}
//       headerDescription="Front desk operations"
//     >
//       {activeSection === "dashboard" && (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//           <MetricCard icon="📅" label="Today's Check-ins" value={todayCheckIns} iconBg="bg-blue-500" />
//           <MetricCard icon="✓" label="Available Rooms" value={availableRooms} iconBg="bg-emerald-500" />
//           <MetricCard icon="🛏️" label="Occupied Rooms" value={occupiedRooms} iconBg="bg-pink-500" />
//         </div>
//       )}

//       {(activeSection === "walk-in" || activeSection === "reservations") && (
//         <section className="mb-8">
//           <button onClick={() => setAddResModal(true)} className="mb-6 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700">Create Walk-in Reservation</button>
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

//       {activeSection === "availability" && (
//         <section className="mb-8">
//           <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-6 shadow-sm">
//             <h2 className="text-xl font-bold mb-2">Check Availability</h2>
//             <p className="text-gray-600 mb-4">Select your dates and room type to see which rooms are available.</p>
//             <Link to="/check" className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 font-medium">
//               <span>✓</span> Go to Check Availability
//             </Link>
//           </div>
//         </section>
//       )}

//       {activeSection === "rooms" && (
//         <section className="mb-8">
//           <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm">
//             <h2 className="text-xl font-bold mb-4">Rooms (View Only)</h2>
//             <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//               {rooms.map((room) => (
//                 <div key={room.id} className="rounded-xl border border-gray-200 p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
//                   {room.imageBase64 && <img src={room.imageBase64} alt={room.type} className="w-full h-32 object-cover rounded-lg mb-3" />}
//                   <p className="font-semibold">{room.type} - LKR {room.price?.toLocaleString()}</p>
//                   <p className="text-sm text-gray-600">#{room.roomNumber || room.id}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>
//       )}

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
import { useNavigate, Link } from "react-router-dom";
import { getRooms, getReservations, addReservation, getAvailableRoomsForDates } from "../Services/api";
import { AuthContext } from "../context/AuthContext";
import StaffDashboardLayout, { MetricCard } from "../components/StaffDashboardLayout";
import { ROLE_RECEPTIONIST } from "../constants/roles";

const ROOM_TYPES = ["Single", "Double", "Deluxe"];
const TIME_OPTIONS = ["12:00 AM", "6:00 AM", "9:00 AM", "12:00 PM", "3:00 PM", "6:00 PM", "9:00 PM"];

const RECEPTIONIST_NAV = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "walk-in", label: "Walk-in Reservation", icon: "📝" },
  { id: "reservations", label: "View Reservations", icon: "📅" },
  { id: "availability", label: "Check Availability", icon: "✓" },
  { id: "rooms", label: "View Rooms", icon: "🛏️" },
];

export default function ReceptionistDashboard() {
  const navigate = useNavigate();
  const { logout } = React.useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");
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
        navigate("/staff-login");
      } else {
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("userRole") !== ROLE_RECEPTIONIST || !localStorage.getItem("token")) {
      navigate("/staff-login");
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

  const todayCheckIns = reservations.filter((r) => r.checkIn === today).length;
  const availableRooms = rooms.filter((r) => r.available !== false).length;
  const occupiedRooms = reservations.filter((r) => {
    const todayDate = new Date().toISOString().split("T")[0];
    return r.checkIn <= todayDate && r.checkOut >= todayDate;
  }).length;

  if (loading && rooms.length === 0 && reservations.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-slate-600 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <StaffDashboardLayout
      roleLabel="RECEPTIONIST"
      badgeColor="bg-emerald-500"
      navItems={RECEPTIONIST_NAV}
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      headerTitle="Receptionist Dashboard"
      headerSubtitle={localStorage.getItem("username") || "Receptionist User"}
      headerDescription="Front desk operations"
    >
      {activeSection === "dashboard" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <MetricCard icon="📅" label="Today's Check-ins" value={todayCheckIns} iconBg="bg-blue-500" />
          <MetricCard icon="✓" label="Available Rooms" value={availableRooms} iconBg="bg-emerald-500" />
          <MetricCard icon="🛏️" label="Occupied Rooms" value={occupiedRooms} iconBg="bg-pink-500" />
        </div>
      )}

      {(activeSection === "walk-in" || activeSection === "reservations") && (
        <section className="mb-8">
          <button
            onClick={() => setAddResModal(true)}
            className="mb-6 px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105 font-medium"
          >
            Create Walk-in Reservation
          </button>
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

      {activeSection === "availability" && (
        <section className="mb-8">
          <div className="rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 p-10 shadow-xl text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-4xl text-white shadow-lg mx-auto mb-6">
              ✓
            </div>
            <h2 className="text-3xl font-serif text-slate-900 mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Check Availability
            </h2>
            <p className="text-slate-700 mb-6 text-lg max-w-lg mx-auto">
              Select your dates and room type to see which rooms are available for your guests.
            </p>
            <Link
              to="/check"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105 font-medium text-lg"
            >
              <span className="text-2xl">✓</span>
              <span>Go to Check Availability</span>
            </Link>
          </div>
        </section>
      )}

      {activeSection === "rooms" && (
        <section className="mb-8">
          <div className="rounded-3xl bg-white/70 backdrop-blur-lg border border-white/20 p-8 shadow-xl">
            <h2 className="text-2xl font-serif text-slate-900 mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Rooms (View Only)
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rooms.map((room, index) => (
                <div
                  key={room.id}
                  className="rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
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
                    <p className="text-sm text-slate-500">Room #{room.roomNumber || room.id}</p>
                  </div>
                </div>
              ))}
            </div>
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
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all duration-300 outline-none"
              />
              <input
                placeholder="Address"
                value={newRes.address}
                onChange={(e) => setNewRes({ ...newRes, address: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all duration-300 outline-none"
              />
              <input
                placeholder="Contact"
                value={newRes.contactNumber}
                onChange={(e) => setNewRes({ ...newRes, contactNumber: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all duration-300 outline-none"
              />
              <select
                value={newRes.roomType}
                onChange={(e) => setNewRes({ ...newRes, roomType: e.target.value, roomId: "" })}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all duration-300 outline-none"
              >
                {ROOM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <select
                value={newRes.roomId}
                onChange={(e) => setNewRes({ ...newRes, roomId: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all duration-300 outline-none"
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
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all duration-300 outline-none"
              />
              <input
                type="date"
                value={newRes.checkOut}
                min={newRes.checkIn || today}
                onChange={(e) => setNewRes({ ...newRes, checkOut: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all duration-300 outline-none"
              />
              <select
                value={newRes.checkInTime}
                onChange={(e) => setNewRes({ ...newRes, checkInTime: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all duration-300 outline-none"
              >
                {TIME_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <select
                value={newRes.checkOutTime}
                onChange={(e) => setNewRes({ ...newRes, checkOutTime: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all duration-300 outline-none"
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