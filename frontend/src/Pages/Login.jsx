// src/pages/Login.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "./services/api";

export default function Login() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { username: "", password: "" },
    validationSchema: Yup.object({
      username: Yup.string().required("Username is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await api.post("/auth/login", values);
        localStorage.setItem("token", response.data.token);
        navigate("/customer-dashboard");
      } catch (err) {
        alert("Login failed! Check credentials.");
      }
    },
  });

  return (
    <div className="p-8 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={formik.handleSubmit} className="space-y-3">
        <input
          name="username"
          placeholder="Username"
          className="border p-2 w-full"
          value={formik.values.username}
          onChange={formik.handleChange}
        />
        {formik.errors.username && (
          <div className="text-red-500">{formik.errors.username}</div>
        )}
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border p-2 w-full"
          value={formik.values.password}
          onChange={formik.handleChange}
        />
        {formik.errors.password && (
          <div className="text-red-500">{formik.errors.password}</div>
        )}
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
}
