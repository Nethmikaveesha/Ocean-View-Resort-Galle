import React, { useEffect, useState } from "react";
import { getMyReservations, getBill, updateReservation, deleteReservation } from "../Services/api";

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
      checkIn: r.checkIn || r.checkInDate || today,
      checkOut: r.checkOut || r.checkOutDate || today,
      checkInTime: r.checkInTime || "12:00 PM",
      checkOutTime: r.checkOutTime || "11:00 AM",
    });
  };

  const handleUpdate = async () => {
    try {
      await updateReservation(editing, form);
      alert("Reservation updated successfully.");
      setEditing(null);
      fetchReservations();
    } catch (err) {
      alert("Failed to update: " + (err?.message || "Try again."));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this reservation?")) return;
    try {
      await deleteReservation(id);
      alert("Reservation deleted.");
      fetchReservations();
    } catch (err) {
      alert("Failed to delete.");
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
      alert("Failed to download bill.");
    }
  };

  if (loading) return <p className="p-6">Loading reservations...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Reservations</h1>

      {reservations.length === 0 ? (
        <p>No reservations found.</p>
      ) : (
        <div className="grid gap-4">
          {reservations.map((res) => (
            <div key={res.reservationNumber} className="border rounded-lg p-4 shadow bg-white">
              {editing === res.reservationNumber ? (
                <div className="space-y-2">
                  <input
                    className="border p-2 w-full rounded"
                    placeholder="Guest Name"
                    value={form.guestName}
                    onChange={(e) => setForm({ ...form, guestName: e.target.value })}
                  />
                  <input
                    className="border p-2 w-full rounded"
                    placeholder="Address"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                  />
                  <input
                    className="border p-2 w-full rounded"
                    placeholder="Contact"
                    value={form.contactNumber}
                    onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
                  />
                  <select
                    value={form.roomType}
                    onChange={(e) => setForm({ ...form, roomType: e.target.value })}
                    className="border p-2 w-full rounded"
                  >
                    <option>Single</option>
                    <option>Double</option>
                    <option>Deluxe</option>
                  </select>
                  <input type="date" value={form.checkIn} onChange={(e) => setForm({ ...form, checkIn: e.target.value })} className="border p-2 w-full rounded" />
                  <input type="date" value={form.checkOut} onChange={(e) => setForm({ ...form, checkOut: e.target.value })} className="border p-2 w-full rounded" />
                  <div className="flex gap-2">
                    <button onClick={handleUpdate} className="bg-green-600 text-white px-4 py-1 rounded">Save</button>
                    <button onClick={() => setEditing(null)} className="bg-gray-500 text-white px-4 py-1 rounded">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <p><strong>Reservation No:</strong> {res.reservationNumber}</p>
                  <p><strong>Guest Name:</strong> {res.guestName}</p>
                  <p><strong>Room Type:</strong> {res.roomType}</p>
                  <p><strong>Check-in:</strong> {res.checkIn || res.checkInDate} {res.checkInTime && `(${res.checkInTime})`}</p>
                  <p><strong>Check-out:</strong> {res.checkOut || res.checkOutDate} {res.checkOutTime && `(${res.checkOutTime})`}</p>
                  <p><strong>Total Bill:</strong> LKR {res.totalBill}</p>
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => handleDownloadBill(res.reservationNumber)} className="text-blue-600 underline">Download Bill (PDF)</button>
                    <button onClick={() => handleEdit(res)} className="text-amber-600 underline">Update</button>
                    <button onClick={() => handleDelete(res.reservationNumber)} className="text-red-600 underline">Delete</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
