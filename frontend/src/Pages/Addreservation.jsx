import { useState } from "react";
import { addReservation } from "./services/reservationService";

export default function AddReservation() {
  const [form, setForm] = useState({
    name: "",
    address: "",
    contact: "",
    roomType: "",
    checkIn: "",
    checkOut: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await addReservation(form);
      alert("Thank you! Reservation added successfully.");
    } catch (err) {
      alert("Error adding reservation");
      console.error(err);
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add Reservation</h2>

      <input name="name" onChange={handleChange} placeholder="Guest Name" className="border p-2 w-full mb-2" />
      <input name="address" onChange={handleChange} placeholder="Address" className="border p-2 w-full mb-2" />
      <input name="contact" onChange={handleChange} placeholder="Contact Number" className="border p-2 w-full mb-2" />

      <select name="roomType" onChange={handleChange} className="border p-2 w-full mb-2">
        <option>Single</option>
        <option>Double</option>
        <option>Deluxe</option>
      </select>

      <input type="date" name="checkIn" onChange={handleChange} className="border p-2 w-full mb-2" />
      <input type="date" name="checkOut" onChange={handleChange} className="border p-2 w-full mb-4" />

      <button onClick={handleSubmit} className="bg-green-600 text-white px-6 py-2 rounded">
        Add Reservation
      </button>
    </div>
  );
}
