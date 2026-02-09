// src/pages/Register.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../Services/api";

export default function Register() {
  const navigate = useNavigate();

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
        alert("Registration failed. Username might be taken.");
      }
    },
  });

  return (
    <div className="p-8 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={formik.handleSubmit} className="space-y-3">
        <input
          name="name"
          placeholder="Full Name"
          className="border p-2 w-full"
          value={formik.values.name}
          onChange={formik.handleChange}
        />
        {formik.errors.name && <div className="text-red-500">{formik.errors.name}</div>}

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

        <input
          name="username"
          placeholder="Username"
          className="border p-2 w-full"
          value={formik.values.username}
          onChange={formik.handleChange}
        />
        {formik.errors.username && <div className="text-red-500">{formik.errors.username}</div>}

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border p-2 w-full"
          value={formik.values.password}
          onChange={formik.handleChange}
        />
        {formik.errors.password && <div className="text-red-500">{formik.errors.password}</div>}

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
}
