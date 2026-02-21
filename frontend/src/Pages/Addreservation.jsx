// import { useState, useEffect } from "react";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { addReservation, getAvailableRoomsForDates, getBill } from "../Services/api";

// const TIME_OPTIONS = ["12:00 AM", "6:00 AM", "9:00 AM", "12:00 PM", "3:00 PM", "6:00 PM", "9:00 PM"];

// function getInitialValuesFromSession() {
//   const today = new Date().toISOString().split("T")[0];
//   const availableDates = sessionStorage.getItem("availableDates");
//   const selectedRoom = sessionStorage.getItem("selectedRoom");
//   let checkIn = today;
//   let checkOut = "";
//   let checkInTime = "12:00 PM";
//   let roomType = "Single";
//   let roomId = "";
//   if (availableDates) {
//     try {
//       const parsed = JSON.parse(availableDates);
//       if (parsed.checkIn) checkIn = parsed.checkIn;
//       if (parsed.checkOut) checkOut = parsed.checkOut;
//       if (parsed.checkInTime) checkInTime = parsed.checkInTime;
//     } catch (_) {}
//   }
//   if (selectedRoom) {
//     try {
//       const parsed = JSON.parse(selectedRoom);
//       if (parsed.type) roomType = parsed.type;
//       if (parsed.id) roomId = parsed.id;
//     } catch (_) {}
//   }
//   return { checkIn, checkOut, checkInTime, roomType, roomId };
// }

// export default function AddReservation() {
//   const [availableRooms, setAvailableRooms] = useState([]);
//   const [previewBill, setPreviewBill] = useState(0);
//   const username = localStorage.getItem("username") || "";
//   const today = new Date().toISOString().split("T")[0];
//   const sessionData = getInitialValuesFromSession();

//   const formik = useFormik({
//     initialValues: {
//       guestName: "",
//       address: "",
//       contactNumber: "",
//       roomType: sessionData.roomType,
//       roomId: sessionData.roomId,
//       checkIn: sessionData.checkIn,
//       checkOut: sessionData.checkOut,
//       checkInTime: sessionData.checkInTime,
//       checkOutTime: "11:00 AM",
//     },
//     validationSchema: Yup.object({
//       guestName: Yup.string().required("Required"),
//       address: Yup.string().required("Required"),
//       contactNumber: Yup.string().matches(/^[0-9]{10}$/, "Must be 10 digits").required("Required"),
//       roomType: Yup.string().required("Required"),
//       roomId: Yup.string().required("Select a room"),
//       checkIn: Yup.date().min(today, "Check-in must be today").required("Required"),
//       checkOut: Yup.date().min(Yup.ref("checkIn"), "Check-out must be after check-in").required("Required"),
//       checkInTime: Yup.string().required("Required"),
//       checkOutTime: Yup.string().required("Required"),
//     }),
//     onSubmit: async (values) => {
//       try {
//         const data = {
//           guestName: values.guestName,
//           address: values.address,
//           contactNumber: values.contactNumber,
//           roomId: values.roomId,
//           checkIn: values.checkIn,
//           checkOut: values.checkOut,
//           checkInTime: values.checkInTime,
//           checkOutTime: values.checkOutTime,
//           customerUsername: username,
//         };
//         const saved = await addReservation(data);
//         sessionStorage.removeItem("availabilityVerified");
//         sessionStorage.removeItem("availableDates");
//         sessionStorage.removeItem("selectedRoom");
//         if (saved?.reservationNumber) {
//           try {
//             const blob = await getBill(saved.reservationNumber);
//             const url = window.URL.createObjectURL(blob);
//             const a = document.createElement("a");
//             a.href = url;
//             a.download = `bill-${saved.reservationNumber}.pdf`;
//             a.click();
//             alert("Thank you! Your reservation has been added. Bill calculated by server and downloaded.");
//           } catch (_) {
//             alert("Thank you! Your reservation has been added. Go to View Reservation to download your bill.");
//           }
//         } else {
//           alert("Thank you! Your reservation has been added successfully.");
//         }
//         formik.resetForm({ values: { ...formik.initialValues, checkIn: today, checkOut: "", roomId: "", roomType: "Single" } });
//         setAvailableRooms([]);
//       } catch (err) {
//         const msg = err?.response?.data?.message
//           || (typeof err?.response?.data?.errors === "object"
//             ? Object.values(err.response.data.errors || {}).join(", ")
//             : null)
//           || err?.message
//           || "Please try again.";
//         alert("Error adding reservation: " + msg);
//       }
//     },
//   });

//   useEffect(() => {
//     const { checkIn, checkOut, roomType } = formik.values;
//     if (!checkIn || !checkOut || !roomType) {
//       setAvailableRooms([]);
//       formik.setFieldValue("roomId", "");
//       return;
//     }
//     getAvailableRoomsForDates(roomType, checkIn, checkOut)
//       .then((rooms) => {
//         setAvailableRooms(rooms || []);
//         if (!rooms?.some((r) => r.id === formik.values.roomId)) {
//           formik.setFieldValue("roomId", "");
//         }
//       })
//       .catch(() => setAvailableRooms([]));
//   }, [formik.values.checkIn, formik.values.checkOut, formik.values.roomType]);

//   useEffect(() => {
//     const { roomId, checkIn, checkOut } = formik.values;
//     if (!roomId || !checkIn || !checkOut) {
//       setPreviewBill(0);
//       return;
//     }
//     const room = availableRooms.find((r) => r.id === roomId);
//     if (!room) {
//       setPreviewBill(0);
//       return;
//     }
//     const start = new Date(checkIn);
//     const end = new Date(checkOut);
//     const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) || 1;
//     setPreviewBill(nights * room.price);
//   }, [formik.values.roomId, formik.values.checkIn, formik.values.checkOut, availableRooms]);

//   const roomAvailable = availableRooms.length > 0;

//   return (
//     <div className="p-8 max-w-xl mx-auto">
//       <h2 className="text-2xl font-bold mb-4">Add New Reservation</h2>
//       <p className="text-sm text-gray-600 mb-4">Bill is calculated by the server from room prices in the database. Preview only.</p>
//       <form onSubmit={formik.handleSubmit} className="space-y-3">
//         <input
//           type="text"
//           name="guestName"
//           placeholder="Guest Name"
//           className="border p-2 w-full rounded"
//           onChange={formik.handleChange}
//           value={formik.values.guestName}
//         />
//         {formik.errors.guestName && <p className="text-red-500 text-sm">{formik.errors.guestName}</p>}

//         <input
//           type="text"
//           name="address"
//           placeholder="Address"
//           className="border p-2 w-full rounded"
//           onChange={formik.handleChange}
//           value={formik.values.address}
//         />
//         {formik.errors.address && <p className="text-red-500 text-sm">{formik.errors.address}</p>}

//         <input
//           type="text"
//           name="contactNumber"
//           placeholder="Contact Number (10 digits)"
//           className="border p-2 w-full rounded"
//           onChange={formik.handleChange}
//           value={formik.values.contactNumber}
//         />
//         {formik.errors.contactNumber && <p className="text-red-500 text-sm">{formik.errors.contactNumber}</p>}

//         <div>
//           <label className="block text-sm mb-1">Room Type</label>
//           <select
//             name="roomType"
//             className="border p-2 w-full rounded"
//             onChange={(e) => {
//               formik.handleChange(e);
//               formik.setFieldValue("roomId", "");
//             }}
//             value={formik.values.roomType}
//           >
//             <option value="Single">Single</option>
//             <option value="Double">Double</option>
//             <option value="Deluxe">Deluxe</option>
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm mb-1">Select Room (by ID)</label>
//           <select
//             name="roomId"
//             className="border p-2 w-full rounded"
//             onChange={formik.handleChange}
//             value={formik.values.roomId}
//           >
//             <option value="">-- Select a room --</option>
//             {availableRooms.map((room) => (
//               <option key={room.id} value={room.id}>
//                 {room.type} - #{room.roomNumber || room.id} - LKR {room.price?.toLocaleString()}/night
//               </option>
//             ))}
//           </select>
//           {!roomAvailable && formik.values.checkIn && formik.values.checkOut && (
//             <p className="text-red-500 text-sm mt-1">No rooms available for selected dates.</p>
//           )}
//           {formik.errors.roomId && <p className="text-red-500 text-sm">{formik.errors.roomId}</p>}
//         </div>

//         <div>
//           <label className="block text-sm mb-1">Check-in Date (today only)</label>
//           <input
//             type="date"
//             name="checkIn"
//             min={today}
//             className="border p-2 w-full rounded"
//             onChange={formik.handleChange}
//             value={formik.values.checkIn}
//           />
//         </div>
//         {formik.errors.checkIn && <p className="text-red-500 text-sm">{formik.errors.checkIn}</p>}

//         <div>
//           <label className="block text-sm mb-1">Check-in Time (AM/PM)</label>
//           <select name="checkInTime" className="border p-2 w-full rounded" onChange={formik.handleChange} value={formik.values.checkInTime}>
//             {TIME_OPTIONS.map((t) => (
//               <option key={t} value={t}>{t}</option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm mb-1">Check-out Date (future)</label>
//           <input
//             type="date"
//             name="checkOut"
//             min={formik.values.checkIn || today}
//             className="border p-2 w-full rounded"
//             onChange={formik.handleChange}
//             value={formik.values.checkOut}
//           />
//         </div>
//         {formik.errors.checkOut && <p className="text-red-500 text-sm">{formik.errors.checkOut}</p>}

//         <div>
//           <label className="block text-sm mb-1">Check-out Time (AM/PM)</label>
//           <select name="checkOutTime" className="border p-2 w-full rounded" onChange={formik.handleChange} value={formik.values.checkOutTime}>
//             {TIME_OPTIONS.map((t) => (
//               <option key={t} value={t}>{t}</option>
//             ))}
//           </select>
//         </div>

//         <div className="bg-gray-100 p-4 rounded">
//           <p className="font-semibold">Estimated Bill (preview): LKR {previewBill.toLocaleString()}</p>
//           <p className="text-xs text-gray-500">Final amount calculated by server on submit</p>
//         </div>

//         <button
//           type="submit"
//           disabled={!roomAvailable || !formik.values.roomId}
//           className={`px-6 py-2 rounded text-white ${roomAvailable && formik.values.roomId ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"}`}
//         >
//           Add Reservation
//         </button>
//       </form>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { addReservation, getAvailableRoomsForDates, getBill } from "../Services/api";

const TIME_OPTIONS = ["12:00 AM", "6:00 AM", "9:00 AM", "12:00 PM", "3:00 PM", "6:00 PM", "9:00 PM"];

function getInitialValuesFromSession() {
  const today = new Date().toISOString().split("T")[0];
  const availableDates = sessionStorage.getItem("availableDates");
  const selectedRoom = sessionStorage.getItem("selectedRoom");
  let checkIn = today;
  let checkOut = "";
  let checkInTime = "12:00 PM";
  let roomType = "Single";
  let roomId = "";
  if (availableDates) {
    try {
      const parsed = JSON.parse(availableDates);
      if (parsed.checkIn) checkIn = parsed.checkIn;
      if (parsed.checkOut) checkOut = parsed.checkOut;
      if (parsed.checkInTime) checkInTime = parsed.checkInTime;
    } catch (_) {}
  }
  if (selectedRoom) {
    try {
      const parsed = JSON.parse(selectedRoom);
      if (parsed.type) roomType = parsed.type;
      if (parsed.id) roomId = parsed.id;
    } catch (_) {}
  }
  return { checkIn, checkOut, checkInTime, roomType, roomId };
}

export default function AddReservation() {
  const [availableRooms, setAvailableRooms] = useState([]);
  const [previewBill, setPreviewBill] = useState(0);
  const username = localStorage.getItem("username") || "";
  const today = new Date().toISOString().split("T")[0];
  const sessionData = getInitialValuesFromSession();

  const formik = useFormik({
    initialValues: {
      guestName: "",
      address: "",
      contactNumber: "",
      roomType: sessionData.roomType,
      roomId: sessionData.roomId,
      checkIn: sessionData.checkIn,
      checkOut: sessionData.checkOut,
      checkInTime: sessionData.checkInTime,
      checkOutTime: "11:00 AM",
    },
    validationSchema: Yup.object({
      guestName: Yup.string().required("Required"),
      address: Yup.string().required("Required"),
      contactNumber: Yup.string().matches(/^[0-9]{10}$/, "Must be 10 digits").required("Required"),
      roomType: Yup.string().required("Required"),
      roomId: Yup.string().required("Select a room"),
      checkIn: Yup.date().min(today, "Check-in must be today").required("Required"),
      checkOut: Yup.date().min(Yup.ref("checkIn"), "Check-out must be after check-in").required("Required"),
      checkInTime: Yup.string().required("Required"),
      checkOutTime: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        const data = {
          guestName: values.guestName,
          address: values.address,
          contactNumber: values.contactNumber,
          roomId: values.roomId,
          checkIn: values.checkIn,
          checkOut: values.checkOut,
          checkInTime: values.checkInTime,
          checkOutTime: values.checkOutTime,
          customerUsername: username,
        };
        const saved = await addReservation(data);
        sessionStorage.removeItem("availabilityVerified");
        sessionStorage.removeItem("availableDates");
        sessionStorage.removeItem("selectedRoom");
        if (saved?.reservationNumber) {
          try {
            const blob = await getBill(saved.reservationNumber);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `bill-${saved.reservationNumber}.pdf`;
            a.click();
            toast.success("Thank you! Your reservation has been added. Bill calculated by server and downloaded.");
          } catch (_) {
            toast.success("Thank you! Your reservation has been added. Go to View Reservation to download your bill.");
          }
        } else {
          toast.success("Thank you! Your reservation has been added successfully.");
        }
        formik.resetForm({ values: { ...formik.initialValues, checkIn: today, checkOut: "", roomId: "", roomType: "Single" } });
        setAvailableRooms([]);
      } catch (err) {
        const msg = err?.response?.data?.message
          || (typeof err?.response?.data?.errors === "object"
            ? Object.values(err.response.data.errors || {}).join(", ")
            : null)
          || err?.message
          || "Please try again.";
        toast.error("Error adding reservation: " + msg);
      }
    },
  });

  useEffect(() => {
    const { checkIn, checkOut, roomType } = formik.values;
    if (!checkIn || !checkOut || !roomType) {
      setAvailableRooms([]);
      formik.setFieldValue("roomId", "");
      return;
    }
    getAvailableRoomsForDates(roomType, checkIn, checkOut)
      .then((rooms) => {
        setAvailableRooms(rooms || []);
        if (!rooms?.some((r) => r.id === formik.values.roomId)) {
          formik.setFieldValue("roomId", "");
        }
      })
      .catch(() => setAvailableRooms([]));
  }, [formik.values.checkIn, formik.values.checkOut, formik.values.roomType]);

  useEffect(() => {
    const { roomId, checkIn, checkOut } = formik.values;
    if (!roomId || !checkIn || !checkOut) {
      setPreviewBill(0);
      return;
    }
    const room = availableRooms.find((r) => r.id === roomId);
    if (!room) {
      setPreviewBill(0);
      return;
    }
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) || 1;
    setPreviewBill(nights * room.price);
  }, [formik.values.roomId, formik.values.checkIn, formik.values.checkOut, availableRooms]);

  const roomAvailable = availableRooms.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-amber-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 animate-[fadeIn_0.8s_ease-out]">
          <div className="inline-block mb-4">
            <span className="text-cyan-700 text-sm font-medium tracking-[0.3em] uppercase border-b-2 border-cyan-700 pb-2">
              Book Your Stay
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-serif mb-4 text-slate-900" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Add New Reservation
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-600 to-amber-600 mx-auto mb-4"></div>
          <p className="text-slate-600">
            Bill is calculated by the server from room prices in the database. Preview only.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl p-8 sm:p-10 border border-white/20 animate-[fadeInUp_0.9s_ease-out]">
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Guest Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Guest Name</label>
              <input
                type="text"
                name="guestName"
                placeholder="Enter guest name"
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white/50 backdrop-blur-sm focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all duration-300 outline-none"
                onChange={formik.handleChange}
                value={formik.values.guestName}
              />
              {formik.errors.guestName && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <span>⚠️</span> {formik.errors.guestName}
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
              <input
                type="text"
                name="address"
                placeholder="Enter address"
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white/50 backdrop-blur-sm focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all duration-300 outline-none"
                onChange={formik.handleChange}
                value={formik.values.address}
              />
              {formik.errors.address && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <span>⚠️</span> {formik.errors.address}
                </p>
              )}
            </div>

            {/* Contact Number */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Contact Number</label>
              <input
                type="text"
                name="contactNumber"
                placeholder="10 digit number"
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white/50 backdrop-blur-sm focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all duration-300 outline-none"
                onChange={formik.handleChange}
                value={formik.values.contactNumber}
              />
              {formik.errors.contactNumber && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <span>⚠️</span> {formik.errors.contactNumber}
                </p>
              )}
            </div>

            {/* Room Type */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Room Type</label>
              <select
                name="roomType"
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white/50 backdrop-blur-sm focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all duration-300 outline-none"
                onChange={(e) => {
                  formik.handleChange(e);
                  formik.setFieldValue("roomId", "");
                }}
                value={formik.values.roomType}
              >
                <option value="Single">Single</option>
                <option value="Double">Double</option>
                <option value="Deluxe">Deluxe</option>
              </select>
            </div>

            {/* Select Room */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Select Room</label>
              <select
                name="roomId"
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white/50 backdrop-blur-sm focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all duration-300 outline-none"
                onChange={formik.handleChange}
                value={formik.values.roomId}
              >
                <option value="">-- Select a room --</option>
                {availableRooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.type} - #{room.roomNumber || room.id} - LKR {room.price?.toLocaleString()}/night
                  </option>
                ))}
              </select>
              {!roomAvailable && formik.values.checkIn && formik.values.checkOut && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <span>⚠️</span> No rooms available for selected dates.
                </p>
              )}
              {formik.errors.roomId && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <span>⚠️</span> {formik.errors.roomId}
                </p>
              )}
            </div>

            {/* Dates Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Check-in Date</label>
                <input
                  type="date"
                  name="checkIn"
                  min={today}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white/50 backdrop-blur-sm focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all duration-300 outline-none"
                  onChange={formik.handleChange}
                  value={formik.values.checkIn}
                />
                <p className="text-xs text-slate-500 mt-1">Today only</p>
                {formik.errors.checkIn && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <span>⚠️</span> {formik.errors.checkIn}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Check-out Date</label>
                <input
                  type="date"
                  name="checkOut"
                  min={formik.values.checkIn || today}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white/50 backdrop-blur-sm focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all duration-300 outline-none"
                  onChange={formik.handleChange}
                  value={formik.values.checkOut}
                />
                <p className="text-xs text-slate-500 mt-1">Future date</p>
                {formik.errors.checkOut && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <span>⚠️</span> {formik.errors.checkOut}
                  </p>
                )}
              </div>
            </div>

            {/* Time Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Check-in Time</label>
                <select
                  name="checkInTime"
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white/50 backdrop-blur-sm focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all duration-300 outline-none"
                  onChange={formik.handleChange}
                  value={formik.values.checkInTime}
                >
                  {TIME_OPTIONS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Check-out Time</label>
                <select
                  name="checkOutTime"
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white/50 backdrop-blur-sm focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all duration-300 outline-none"
                  onChange={formik.handleChange}
                  value={formik.values.checkOutTime}
                >
                  {TIME_OPTIONS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Bill Preview */}
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-2xl flex-shrink-0">
                  💰
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-600 mb-1">Estimated Bill (preview)</p>
                  <p className="text-3xl font-serif text-slate-900 mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    LKR {previewBill.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500">Final amount calculated by server on submit</p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!roomAvailable || !formik.values.roomId}
              className={`w-full py-4 rounded-xl font-medium text-lg transition-all duration-300 ${
                roomAvailable && formik.values.roomId
                  ? "bg-gradient-to-r from-teal-600 to-emerald-600 text-white hover:shadow-2xl hover:shadow-teal-500/50 hover:scale-105"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Complete Reservation
            </button>
          </form>
        </div>
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
