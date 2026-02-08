import { useState } from "react";
import api from "./services/api";

const ROOM_RATES = {
  Single: 10000,
  Double: 15000,
  Deluxe: 25000,
};

export default function AddReservation() {
  const [form, setForm] = useState({
    guestName: "",
    address: "",
    contactNumber: "",
    roomType: "Single",
    checkInDate: "",
    checkOutDate: "",
  });

  const [bill, setBill] = useState(0);

  // ---------------- BILL CALCULATION ----------------
  const calculateBill = (ci, co, type) => {
    if (!ci || !co) return 0;

    const start = new Date(ci);
    const end = new Date(co);

    const nights =
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);

    if (nights <= 0) return 0;

    return nights * ROOM_RATES[type];
  };

  // ---------------- INPUT HANDLER ----------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedForm = { ...form, [name]: value };
    setForm(updatedForm);

    if (name === "roomType" || name === "checkInDate" || name === "checkOutDate") {
      const total = calculateBill(
        updatedForm.checkInDate,
        updatedForm.checkOutDate,
        updatedForm.roomType
      );
      setBill(total);
    }
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = async () => {
    if (bill <= 0) {
      alert("Please select valid dates");
      return;
    }

    try {
      const payload = {
        ...form,
        totalBill: bill,
      };

      await api.post("/reservations", payload);

      alert(`Thank you!\nYour total bill is LKR ${bill}`);

      // Reset form
      setForm({
        guestName: "",
        address: "",
        contactNumber: "",
        roomType: "Single",
        checkInDate: "",
        checkOutDate: "",
      });
      setBill(0);
    } catch (error) {
      console.error(error);
      alert("Failed to add reservation");
    }
  };

  // ---------------- UI ----------------
  return (
    <div className="p-8 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add Reservation</h2>

      <input
        name="guestName"
        value={form.guestName}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
        placeholder="Guest Name"
      />

      <input
        name="address"
        value={form.address}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
        placeholder="Address"
      />

      <input
        name="contactNumber"
        value={form.contactNumber}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
        placeholder="Contact Number"
      />

      <select
        name="roomType"
        value={form.roomType}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
      >
        <option>Single</option>
        <option>Double</option>
        <option>Deluxe</option>
      </select>

      <label className="block mt-2">Check-in Date</label>
      <input
        type="date"
        name="checkInDate"
        min={new Date().toISOString().split("T")[0]}
        value={form.checkInDate}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
      />

      <label className="block mt-2">Check-out Date</label>
      <input
        type="date"
        name="checkOutDate"
        value={form.checkOutDate}
        onChange={handleChange}
        className="border p-2 w-full mb-4"
      />

      {/* BILL */}
      <div className="bg-gray-100 p-4 rounded mb-4">
        <p className="font-semibold">Total Bill</p>
        <p className="text-xl text-green-600">LKR {bill}</p>
      </div>

      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-6 py-2 rounded w-full"
      >
        Add Reservation
      </button>
    </div>
  );
}
