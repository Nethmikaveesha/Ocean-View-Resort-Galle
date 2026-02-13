import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../Services/api";

export default function Register() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionStorage.getItem("availabilityVerified") || !sessionStorage.getItem("selectedRoom")) {
      navigate("/check", { replace: true });
    }
  }, [navigate]);

  const formik = useFormik({
    initialValues: {
      name: "",
      address: "",
      contactNumber: "",
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      address: Yup.string().required("Address is required"),
      contactNumber: Yup.string()
        .matches(/^[0-9]{10}$/, "Contact must be 10 digits")
        .required("Contact number is required"),
      username: Yup.string().required("Username is required"),
      password: Yup.string().min(6, "Minimum 6 characters").required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        await api.post("/auth/register", values);
        alert("Registration successful! Please log in.");
        navigate("/login");
      } catch (err) {
        const msg = err?.response?.data?.message || err?.response?.data?.errors?.username;
        alert("Registration failed: " + (msg || "Username might be taken."));
      }
    },
  });

  return (
    <div className="p-8 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Customer Register</h2>
      <p className="text-sm text-gray-600 mb-4">
        Create an account to make reservations and view your bookings.
      </p>
      <form onSubmit={formik.handleSubmit} className="space-y-3">
        <input
          name="name"
          placeholder="Full Name"
          className="border p-2 w-full rounded"
          value={formik.values.name}
          onChange={formik.handleChange}
        />
        {formik.errors.name && <div className="text-red-500 text-sm">{formik.errors.name}</div>}

        <input
          name="address"
          placeholder="Address"
          className="border p-2 w-full rounded"
          value={formik.values.address}
          onChange={formik.handleChange}
        />
        {formik.errors.address && <div className="text-red-500 text-sm">{formik.errors.address}</div>}

        <input
          name="contactNumber"
          placeholder="Contact Number (10 digits)"
          className="border p-2 w-full rounded"
          value={formik.values.contactNumber}
          onChange={formik.handleChange}
        />
        {formik.errors.contactNumber && <div className="text-red-500 text-sm">{formik.errors.contactNumber}</div>}

        <input
          name="username"
          placeholder="Username"
          className="border p-2 w-full rounded"
          value={formik.values.username}
          onChange={formik.handleChange}
        />
        {formik.errors.username && <div className="text-red-500 text-sm">{formik.errors.username}</div>}

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border p-2 w-full rounded"
          value={formik.values.password}
          onChange={formik.handleChange}
        />
        {formik.errors.password && <div className="text-red-500 text-sm">{formik.errors.password}</div>}

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded w-full hover:bg-green-700">
          Register
        </button>
        <p className="mt-3 text-sm text-gray-600">
          Already have an account? <Link to="/login" className="text-blue-600 underline">Login here</Link>
        </p>
      </form>
    </div>
  );
}
