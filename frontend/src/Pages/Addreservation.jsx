// src/pages/AddReservation.jsx
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "./services/api";

const ROOM_RATES = { Single: 10000, Double: 15000, Deluxe: 25000 };

export default function AddReservation() {
  const [bill, setBill] = useState(0);

  const calculateBill = (checkIn, checkOut, type) => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = (end - start) / (1000 * 60 * 60 * 24);
    if (nights <= 0) return 0;
    return nights * ROOM_RATES[type];
  };

  const formik = useFormik({
    initialValues: {
      guestName: "",
      address: "",
      contactNumber: "",
      roomType: "Single",
      checkIn: new Date().toISOString().split("T")[0],
      checkOut: "",
    },
    validationSchema: Yup.object({
      guestName: Yup.string().required("Guest name is required"),
      address: Yup.string().required("Address is required"),
      contactNumber: Yup.string()
        .matches(/^[0-9]{10}$/, "Contact must be 10 digits")
        .required("Contact number is required"),
      roomType: Yup.string().required("Room type is required"),
      checkIn: Yup.date()
        .min(new Date().toISOString().split("T")[0], "Check-in cannot be in the past")
        .required("Check-in date is required"),
      checkOut: Yup.date()
        .min(Yup.ref("checkIn"), "Check-out must be after check-in")
        .required("Check-out date is required"),
    }),
    onSubmit: async (values) => {
      try {
        const totalBill = calculateBill(values.checkIn, values.checkOut, values.roomType);
        const response = await api.post("/reservations", { ...values, bill: totalBill });
        alert(`Thank you! Your reservation number is ${response.data.reservationNumber}\nTotal Bill: LKR ${totalBill}`);
        formik.resetForm();
        setBill(0);
      } catch (err) {
        alert("Reservation failed. Try again.");
      }
    },
  });

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add Reservation</h2>
      <form onSubmit={formik.handleSubmit} className="space-y-3">
        <input
          name="guestName"
          placeholder="Guest Name"
          className="border p-2 w-full"
          value={formik.values.guestName}
          onChange={formik.handleChange}
        />
        {formik.errors.guestName && <div className="text-red-500">{formik.errors.guestName}</div>}

        <input
          name="address"
          placeholder="Address"
          className="border p-2 w-full"
          value={formik.values.address}
          onChange={formik.handleChange}
        />
        {formik.errors.address && <div className="text-red-500">{formik.errors.address}</div>}

        <input
          name="contactNumber"
          placeholder="Contact Number"
          className="border p-2 w-full"
          value={formik.values.contactNumber}
          onChange={formik.handleChange}
        />
        {formik.errors.contactNumber && <div className="text-red-500">{formik.errors.contactNumber}</div>}

        <select
          name="roomType"
          className="border p-2 w-full"
          value={formik.values.roomType}
          onChange={(e) => {
            formik.handleChange(e);
            setBill(calculateBill(formik.values.checkIn, formik.values.checkOut, e.target.value));
          }}
        >
          <option>Single</option>
          <option>Double</option>
          <option>Deluxe</option>
        </select>
        {formik.errors.roomType && <div className="text-red-500">{formik.errors.roomType}</div>}

        <label>Check-in Date</label>
        <input
          type="date"
          name="checkIn"
          className="border p-2 w-full"
          value={formik.values.checkIn}
          min={new Date().toISOString().split("T")[0]}
          onChange={(e) => {
            formik.handleChange(e);
            setBill(calculateBill(e.target.value, formik.values.checkOut, formik.values.roomType));
          }}
        />
        {formik.errors.checkIn && <div className="text-red-500">{formik.errors.checkIn}</div>}

        <label>Check-out Date</label>
        <input
          type="date"
          name="checkOut"
          className="border p-2 w-full"
          value={formik.values.checkOut}
          onChange={(e) => {
            formik.handleChange(e);
            setBill(calculateBill(formik.values.checkIn, e.target.value, formik.values.roomType));
          }}
        />
        {formik.errors.checkOut && <div className="text-red-500">{formik.errors.checkOut}</div>}

        <div className="bg-gray-100 p-4 rounded mb-4">
          <p className="font-semibold">Total Bill</p>
          <p className="text-xl text-green-600">LKR {bill}</p>
        </div>

        <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded">
          Add Reservation
        </button>
      </form>
    </div>
  );
}
