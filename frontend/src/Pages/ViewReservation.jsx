// import React, { useEffect, useState } from "react";
// import { getMyReservations, getBill, updateReservation, deleteReservation } from "../Services/api";

// const TIME_OPTIONS = ["12:00 AM", "6:00 AM", "9:00 AM", "12:00 PM", "3:00 PM", "6:00 PM", "9:00 PM"];

// export default function ViewReservation() {
//   const [reservations, setReservations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [editing, setEditing] = useState(null);
//   const [form, setForm] = useState({});

//   const username = localStorage.getItem("username") || "";
//   const today = new Date().toISOString().split("T")[0];

//   const fetchReservations = async () => {
//     try {
//       const data = await getMyReservations(username);
//       setReservations(data || []);
//       setError("");
//     } catch (err) {
//       setError("Failed to load reservations");
//       setReservations([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchReservations();
//   }, [username]);

//   const handleEdit = (r) => {
//     setEditing(r.reservationNumber);
//     setForm({
//       guestName: r.guestName,
//       address: r.address,
//       contactNumber: r.contactNumber,
//       roomType: r.roomType,
//       roomId: r.roomId,
//       checkIn: r.checkIn || r.checkInDate || today,
//       checkOut: r.checkOut || r.checkOutDate || today,
//       checkInTime: r.checkInTime || "12:00 PM",
//       checkOutTime: r.checkOutTime || "11:00 AM",
//     });
//   };

//   const handleUpdate = async () => {
//     const resNumber = editing;
//     try {
//       await updateReservation(resNumber, form);
//       setEditing(null);
//       await fetchReservations();
//       try {
//         const blob = await getBill(resNumber);
//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement("a");
//         a.href = url;
//         a.download = `bill-${resNumber}-updated.pdf`;
//         a.click();
//         alert("Reservation updated. Bill recalculated and downloaded.");
//       } catch (_) {
//         alert("Reservation updated. You can download the updated bill using the button below.");
//       }
//     } catch (err) {
//       alert("Failed to update: " + (err?.message || "Try again."));
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this reservation?")) return;
//     try {
//       await deleteReservation(id);
//       alert("Reservation deleted.");
//       fetchReservations();
//     } catch (err) {
//       alert("Failed to delete.");
//     }
//   };

//   const handleDownloadBill = async (reservationNumber) => {
//     try {
//       const blob = await getBill(reservationNumber);
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `bill-${reservationNumber}.pdf`;
//       a.click();
//     } catch (err) {
//       alert("Failed to download bill.");
//     }
//   };

//   if (loading) return <p className="p-6">Loading reservations...</p>;
//   if (error) return <p className="p-6 text-red-600">{error}</p>;

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">My Reservations</h1>

//       {reservations.length === 0 ? (
//         <p>No reservations found.</p>
//       ) : (
//         <div className="grid gap-4">
//           {reservations.map((res) => (
//             <div key={res.reservationNumber} className="border rounded-lg p-4 shadow bg-white">
//               {editing === res.reservationNumber ? (
//                 <div className="space-y-2">
//                   <input
//                     className="border p-2 w-full rounded"
//                     placeholder="Guest Name"
//                     value={form.guestName}
//                     onChange={(e) => setForm({ ...form, guestName: e.target.value })}
//                   />
//                   <input
//                     className="border p-2 w-full rounded"
//                     placeholder="Address"
//                     value={form.address}
//                     onChange={(e) => setForm({ ...form, address: e.target.value })}
//                   />
//                   <input
//                     className="border p-2 w-full rounded"
//                     placeholder="Contact"
//                     value={form.contactNumber}
//                     onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
//                   />
//                   {form.roomId && <input type="hidden" name="roomId" value={form.roomId} />}
//                   <p className="text-sm text-gray-600">Room: {form.roomType} (ID: {form.roomId || "N/A"})</p>
//                   <input type="date" value={form.checkIn} onChange={(e) => setForm({ ...form, checkIn: e.target.value })} className="border p-2 w-full rounded" />
//                   <input type="date" value={form.checkOut} onChange={(e) => setForm({ ...form, checkOut: e.target.value })} className="border p-2 w-full rounded" />
//                   <div className="flex gap-2 mt-2">
//                     <button onClick={handleUpdate} className="bg-green-600 text-white px-4 py-1 rounded">Save (Bill will be recalculated)</button>
//                     <button onClick={() => setEditing(null)} className="bg-gray-500 text-white px-4 py-1 rounded">Cancel</button>
//                   </div>
//                 </div>
//               ) : (
//                 <>
//                   <p><strong>Reservation No:</strong> {res.reservationNumber}</p>
//                   <p><strong>Guest Name:</strong> {res.guestName}</p>
//                   <p><strong>Room Type:</strong> {res.roomType}</p>
//                   <p><strong>Check-in:</strong> {res.checkIn || res.checkInDate} {res.checkInTime && `(${res.checkInTime})`}</p>
//                   <p><strong>Check-out:</strong> {res.checkOut || res.checkOutDate} {res.checkOutTime && `(${res.checkOutTime})`}</p>
//                   <p><strong>Total Bill:</strong> LKR {res.totalBill?.toLocaleString()}</p>
//                   <div className="mt-3 flex flex-wrap gap-2">
//                     <button onClick={() => handleDownloadBill(res.reservationNumber)} className="bg-blue-600 text-white px-3 py-1 rounded text-sm">Print / Download Bill</button>
//                     <button onClick={() => handleEdit(res)} className="bg-amber-500 text-white px-3 py-1 rounded text-sm">Edit</button>
//                     <button onClick={() => handleDelete(res.reservationNumber)} className="bg-red-600 text-white px-3 py-1 rounded text-sm">Delete</button>
//                   </div>
//                 </>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { getMyReservations, getBill, updateReservation, deleteReservation } from "../Services/api";
import toast from "react-hot-toast";

const TIME_OPTIONS = ["12:00 AM", "6:00 AM", "9:00 AM", "12:00 PM", "3:00 PM", "6:00 PM", "9:00 PM"];

export default function ViewReservation() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});

  const username = localStorage.getItem("username") || "";
  const today = new Date().toISOString().split("T")[0];

  const fetchReservations = async () => {
    try {
      const data = await getMyReservations(username);
      setReservations(data || []);
      setError("");
    } catch (err) {
      setError("Failed to load reservations");
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [username]);

  const handleEdit = (r) => {
    setEditing(r.reservationNumber);
    setForm({
      guestName: r.guestName,
      address: r.address,
      contactNumber: r.contactNumber,
      roomType: r.roomType,
      roomId: r.roomId,
      checkIn: r.checkIn || r.checkInDate || today,
      checkOut: r.checkOut || r.checkOutDate || today,
      checkInTime: r.checkInTime || "12:00 PM",
      checkOutTime: r.checkOutTime || "11:00 AM",
    });
  };

  const handleUpdate = async () => {
    const resNumber = editing;
    try {
      await updateReservation(resNumber, form);
      setEditing(null);
      await fetchReservations();
      try {
        const blob = await getBill(resNumber);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `bill-${resNumber}-updated.pdf`;
        a.click();
        toast.success("Reservation updated. Bill recalculated and downloaded.");
      } catch (_) {
        toast.success("Reservation updated. You can download the updated bill using the button below.");
      }
    } catch (err) {
      toast.error("Failed to update: " + (err?.message || "Try again."));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this reservation?")) return;
    try {
      await deleteReservation(id);
      toast.success("Reservation deleted.");
      fetchReservations();
    } catch (err) {
      toast.error("Failed to delete.");
    }
  };

  const handleDownloadBill = async (reservationNumber) => {
    try {
      const blob = await getBill(reservationNumber);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `bill-${reservationNumber}.pdf`;
      a.click();
    } catch (err) {
      toast.error("Failed to download bill.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Loading reservations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-amber-50 flex items-center justify-center px-4">
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center max-w-md">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-red-600 font-medium text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-amber-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-[fadeIn_0.8s_ease-out]">
          <div className="inline-block mb-4">
            <span className="text-cyan-700 text-sm font-medium tracking-[0.3em] uppercase border-b-2 border-cyan-700 pb-2">
              Your Bookings
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif mb-4 text-slate-900" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            My Reservations
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-600 to-amber-600 mx-auto"></div>
        </div>

        {reservations.length === 0 ? (
          <div className="bg-white/60 backdrop-blur-sm border-2 border-slate-200 rounded-3xl p-12 text-center shadow-lg animate-[fadeInUp_0.9s_ease-out]">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-2xl font-serif text-slate-900 mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              No Reservations Yet
            </h3>
            <p className="text-slate-600">You haven't made any reservations. Start booking your dream vacation!</p>
          </div>
        ) : (
          <div className="grid gap-6 animate-[fadeInUp_0.9s_ease-out]">
            {reservations.map((res, index) => (
              <div
                key={res.reservationNumber}
                className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {editing === res.reservationNumber ? (
                  // Edit Mode
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-2xl">
                        ✏️
                      </div>
                      <h3 className="text-2xl font-serif text-slate-900" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        Editing Reservation
                      </h3>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Guest Name</label>
                        <input
                          className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white/50 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all duration-300 outline-none"
                          placeholder="Guest Name"
                          value={form.guestName}
                          onChange={(e) => setForm({ ...form, guestName: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
                        <input
                          className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white/50 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all duration-300 outline-none"
                          placeholder="Address"
                          value={form.address}
                          onChange={(e) => setForm({ ...form, address: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Contact</label>
                        <input
                          className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white/50 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all duration-300 outline-none"
                          placeholder="Contact"
                          value={form.contactNumber}
                          onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Room Info</label>
                        <div className="px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-600">
                          {form.roomType} (ID: {form.roomId || "N/A"})
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Check-in</label>
                        <input
                          type="date"
                          value={form.checkIn}
                          onChange={(e) => setForm({ ...form, checkIn: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white/50 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all duration-300 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Check-out</label>
                        <input
                          type="date"
                          value={form.checkOut}
                          onChange={(e) => setForm({ ...form, checkOut: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white/50 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all duration-300 outline-none"
                        />
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 mt-6">
                      <button
                        onClick={handleUpdate}
                        className="px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-teal-500/50 transition-all duration-300 hover:scale-105"
                      >
                        Save Changes (Bill will be recalculated)
                      </button>
                      <button
                        onClick={() => setEditing(null)}
                        className="px-6 py-3 bg-slate-500 text-white rounded-xl font-medium hover:bg-slate-600 transition-all duration-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-2xl">
                            🎫
                          </div>
                          <div>
                            <p className="text-sm text-slate-500">Reservation Number</p>
                            <p className="text-2xl font-serif text-slate-900" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                              {res.reservationNumber}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-500 mb-1">Total Bill</p>
                        <p className="text-3xl font-serif text-cyan-700" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                          LKR {res.totalBill?.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Guest Name</p>
                        <p className="text-lg font-medium text-slate-900">{res.guestName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Room Type</p>
                        <p className="text-lg font-medium text-slate-900">{res.roomType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Check-in</p>
                        <p className="text-lg font-medium text-slate-900">
                          {res.checkIn || res.checkInDate} 
                          {res.checkInTime && <span className="text-sm text-slate-600"> ({res.checkInTime})</span>}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Check-out</p>
                        <p className="text-lg font-medium text-slate-900">
                          {res.checkOut || res.checkOutDate}
                          {res.checkOutTime && <span className="text-sm text-slate-600"> ({res.checkOutTime})</span>}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-6 border-t border-slate-200">
                      <button
                        onClick={() => handleDownloadBill(res.reservationNumber)}
                        className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105 flex items-center gap-2"
                      >
                        <span>📄</span> Download Bill
                      </button>
                      <button
                        onClick={() => handleEdit(res)}
                        className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-amber-500/50 transition-all duration-300 hover:scale-105 flex items-center gap-2"
                      >
                        <span>✏️</span> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(res.reservationNumber)}
                        className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 hover:scale-105 flex items-center gap-2"
                      >
                        <span>🗑️</span> Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
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