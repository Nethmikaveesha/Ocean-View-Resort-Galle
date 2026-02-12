import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { addReservation, checkRoomAvailability, getBill } from "../Services/api";

const ROOM_RATES = { Single: 10000, Double: 15000, Deluxe: 25000 };
const TIME_OPTIONS = ["12:00 AM", "6:00 AM", "9:00 AM", "12:00 PM", "3:00 PM", "6:00 PM", "9:00 PM"];

export default function AddReservation() {
  const [bill, setBill] = useState(0);
  const [roomAvailable, setRoomAvailable] = useState(true);
  const username = localStorage.getItem("username") || "";

  const today = new Date().toISOString().split("T")[0];

  const formik = useFormik({
    initialValues: {
      guestName: "",
      address: "",
      contactNumber: "",
      roomType: "Single",
      checkIn: today,
      checkOut: "",
      checkInTime: "12:00 PM",
      checkOutTime: "11:00 AM",
    },
    validationSchema: Yup.object({
      guestName: Yup.string().required("Required"),
      address: Yup.string().required("Required"),
      contactNumber: Yup.string().matches(/^[0-9]{10}$/, "Must be 10 digits").required("Required"),
      roomType: Yup.string().required("Required"),
      checkIn: Yup.date().min(today, "Check-in must be today").required("Required"),
      checkOut: Yup.date().min(Yup.ref("checkIn"), "Check-out must be after check-in").required("Required"),
      checkInTime: Yup.string().required("Required"),
      checkOutTime: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        const data = {
          ...values,
          customerUsername: username,
        };
        const saved = await addReservation(data);
        sessionStorage.removeItem("availabilityVerified");
        sessionStorage.removeItem("availableDates");
        if (saved?.reservationNumber) {
          try {
            const blob = await getBill(saved.reservationNumber);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `bill-${saved.reservationNumber}.pdf`;
            a.click();
            alert("Thank you! Your reservation has been added. Bill calculated and downloaded.");
          } catch (_) {
            alert("Thank you! Your reservation has been added. Go to View Reservation to download your bill.");
          }
        } else {
          alert("Thank you! Your reservation has been added successfully.");
        }
        formik.resetForm({ values: { ...formik.initialValues, checkIn: today, checkOut: "" } });
      } catch (err) {
        const msg = err?.response?.data?.message
          || (typeof err?.response?.data?.errors === "object"
            ? Object.values(err.response.data.errors || {}).join(", ")
            : null)
          || err?.message
          || "Please try again.";
        alert("Error adding reservation: " + msg);
      }
    },
  });

  useEffect(() => {
    const { checkIn, checkOut, roomType } = formik.values;
    if (!checkIn || !checkOut) {
      setBill(0);
      return;
    }
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) || 1;
    const rate = ROOM_RATES[roomType] || 10000;
    setBill(nights * rate);
  }, [formik.values.checkIn, formik.values.checkOut, formik.values.roomType]);

  useEffect(() => {
    const { checkIn, checkOut, roomType } = formik.values;
    if (!checkIn || !checkOut) return;
    checkRoomAvailability(roomType, checkIn, checkOut)
      .then((r) => setRoomAvailable(r.available === true))
      .catch(() => setRoomAvailable(false));
  }, [formik.values.checkIn, formik.values.checkOut, formik.values.roomType]);

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add New Reservation</h2>
      <form onSubmit={formik.handleSubmit} className="space-y-3">
        <input
          type="text"
          name="guestName"
          placeholder="Guest Name"
          className="border p-2 w-full rounded"
          onChange={formik.handleChange}
          value={formik.values.guestName}
        />
        {formik.errors.guestName && <p className="text-red-500 text-sm">{formik.errors.guestName}</p>}

        <input
          type="text"
          name="address"
          placeholder="Address"
          className="border p-2 w-full rounded"
          onChange={formik.handleChange}
          value={formik.values.address}
        />
        {formik.errors.address && <p className="text-red-500 text-sm">{formik.errors.address}</p>}

        <input
          type="text"
          name="contactNumber"
          placeholder="Contact Number (10 digits)"
          className="border p-2 w-full rounded"
          onChange={formik.handleChange}
          value={formik.values.contactNumber}
        />
        {formik.errors.contactNumber && <p className="text-red-500 text-sm">{formik.errors.contactNumber}</p>}

        <div>
          <label className="block text-sm mb-1">Room Type</label>
          <select name="roomType" className="border p-2 w-full rounded" onChange={formik.handleChange} value={formik.values.roomType}>
            <option value="Single">Single</option>
            <option value="Double">Double</option>
            <option value="Deluxe">Deluxe</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Check-in Date (today only)</label>
          <input
            type="date"
            name="checkIn"
            min={today}
            className="border p-2 w-full rounded"
            onChange={formik.handleChange}
            value={formik.values.checkIn}
          />
        </div>
        {formik.errors.checkIn && <p className="text-red-500 text-sm">{formik.errors.checkIn}</p>}

        <div>
          <label className="block text-sm mb-1">Check-in Time (AM/PM)</label>
          <select name="checkInTime" className="border p-2 w-full rounded" onChange={formik.handleChange} value={formik.values.checkInTime}>
            {TIME_OPTIONS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Check-out Date (future)</label>
          <input
            type="date"
            name="checkOut"
            min={formik.values.checkIn || today}
            className="border p-2 w-full rounded"
            onChange={formik.handleChange}
            value={formik.values.checkOut}
          />
        </div>
        {formik.errors.checkOut && <p className="text-red-500 text-sm">{formik.errors.checkOut}</p>}

        <div>
          <label className="block text-sm mb-1">Check-out Time (AM/PM)</label>
          <select name="checkOutTime" className="border p-2 w-full rounded" onChange={formik.handleChange} value={formik.values.checkOutTime}>
            {TIME_OPTIONS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {!roomAvailable && <p className="text-red-600">Room not available for selected dates!</p>}

        <div className="bg-gray-100 p-4 rounded">
          <p className="font-semibold">Total Bill: LKR {bill}</p>
        </div>

        <button
          type="submit"
          disabled={!roomAvailable}
          className={`px-6 py-2 rounded text-white ${roomAvailable ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"}`}
        >
          Add Reservation
        </button>
      </form>
    </div>
  );
}
