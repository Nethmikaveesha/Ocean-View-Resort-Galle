import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { addReservation, checkRoomAvailability } from "../Services/api";

// Room rates
const ROOM_RATES = {
  Single: 10000,
  Double: 15000,
  Deluxe: 25000,
};

// Generate random reservation number
const generateReservationNumber = () =>
  "RES" + Math.floor(Math.random() * 1000000);

export default function AddReservation() {
  const [bill, setBill] = useState(0);
  const [roomAvailable, setRoomAvailable] = useState(true);
  const [reservationNumber, setReservationNumber] = useState(
    generateReservationNumber()
  );

  const formik = useFormik({
    initialValues: {
      guestName: "",
      address: "",
      contactNumber: "",
      roomType: "Single",
      checkInDate: "",
      checkOutDate: "",
    },
    validationSchema: Yup.object({
      guestName: Yup.string().required("Required"),
      address: Yup.string().required("Required"),
      contactNumber: Yup.string().required("Required"),
      roomType: Yup.string().required("Required"),
      checkInDate: Yup.date()
        .min(new Date(), "Check-in date cannot be in the past")
        .required("Required"),
      checkOutDate: Yup.date()
        .min(Yup.ref("checkInDate"), "Check-out must be after check-in")
        .required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        const data = { ...values, reservationNumber };
        await addReservation(data);
        alert(
          `Reservation successful!\nReservation Number: ${reservationNumber}\nTotal Bill: LKR ${bill}`
        );
        // Reset form & bill
        formik.resetForm();
        setBill(0);
        setReservationNumber(generateReservationNumber());
      } catch (err) {
        alert("Error adding reservation: " + (err.message || err));
      }
    },
  });

  // Calculate bill whenever dates or room type change
  useEffect(() => {
    const { checkInDate, checkOutDate, roomType } = formik.values;
    if (!checkInDate || !checkOutDate) {
      setBill(0);
      return;
    }
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const nights = (end - start) / (1000 * 60 * 60 * 24);
    setBill(nights > 0 ? nights * ROOM_RATES[roomType] : 0);
  }, [formik.values.checkInDate, formik.values.checkOutDate, formik.values.roomType]);

  // Check room availability whenever dates or room type change
  useEffect(() => {
    const { checkInDate, checkOutDate, roomType } = formik.values;
    if (!checkInDate || !checkOutDate) return;

    const checkAvailability = async () => {
      try {
        const res = await checkRoomAvailability(roomType, checkInDate, checkOutDate);
        setRoomAvailable(res.available);
      } catch (err) {
        setRoomAvailable(false);
      }
    };
    checkAvailability();
  }, [formik.values.checkInDate, formik.values.checkOutDate, formik.values.roomType]);

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add Reservation</h2>
      <form onSubmit={formik.handleSubmit}>
        <input
          type="text"
          name="guestName"
          placeholder="Guest Name"
          className="border p-2 w-full mb-2"
          onChange={formik.handleChange}
          value={formik.values.guestName}
        />
        {formik.errors.guestName && <p className="text-red-500">{formik.errors.guestName}</p>}

        <input
          type="text"
          name="address"
          placeholder="Address"
          className="border p-2 w-full mb-2"
          onChange={formik.handleChange}
          value={formik.values.address}
        />
        {formik.errors.address && <p className="text-red-500">{formik.errors.address}</p>}

        <input
          type="text"
          name="contactNumber"
          placeholder="Contact Number"
          className="border p-2 w-full mb-2"
          onChange={formik.handleChange}
          value={formik.values.contactNumber}
        />
        {formik.errors.contactNumber && <p className="text-red-500">{formik.errors.contactNumber}</p>}

        <select
          name="roomType"
          className="border p-2 w-full mb-2"
          onChange={formik.handleChange}
          value={formik.values.roomType}
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
          className="border p-2 w-full mb-2"
          onChange={formik.handleChange}
          value={formik.values.checkInDate}
        />
        {formik.errors.checkInDate && <p className="text-red-500">{formik.errors.checkInDate}</p>}

        <label className="block mt-2">Check-out Date</label>
        <input
          type="date"
          name="checkOutDate"
          className="border p-2 w-full mb-4"
          onChange={formik.handleChange}
          value={formik.values.checkOutDate}
        />
        {formik.errors.checkOutDate && <p className="text-red-500">{formik.errors.checkOutDate}</p>}

        {!roomAvailable && <p className="text-red-600 mb-2">Room not available for selected dates!</p>}

        {/* BILL UI */}
        <div className="bg-gray-100 p-4 rounded mb-4">
          <p className="font-semibold">Reservation Number: {reservationNumber}</p>
          <p className="font-semibold">Total Bill</p>
          <p className="text-xl text-green-600">LKR {bill}</p>
        </div>

        <button
          type="submit"
          disabled={!roomAvailable}
          className={`px-6 py-2 rounded text-white ${roomAvailable ? "bg-green-600" : "bg-gray-400 cursor-not-allowed"}`}
        >
          Add Reservation
        </button>
      </form>
    </div>
  );
}
