

import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import toast from "react-hot-toast";
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
        toast.success("Registration successful! Please log in.");
        navigate("/login");
      } catch (err) {
        const msg = err?.response?.data?.message || err?.response?.data?.errors?.username;
        toast.error("Registration failed: " + (msg || "Username might be taken."));
      }
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-amber-50 flex items-center justify-center px-4 py-12">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-tl from-amber-400 to-orange-600 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-md w-full">
        <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl p-8 sm:p-10 border border-white/20 animate-[fadeInUp_0.6s_ease-out]">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-4xl mx-auto mb-4 shadow-lg">
              ✨
            </div>
            <h2 className="text-3xl font-serif text-slate-900 mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Customer Register
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-cyan-600 to-amber-600 mx-auto mb-4"></div>
            <p className="text-slate-600 text-sm leading-relaxed">
              Create an account to make reservations and view your bookings.
            </p>
          </div>

          {/* Registration Form */}
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
              <input
                name="name"
                placeholder="Enter your full name"
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white/50 backdrop-blur-sm focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all duration-300 outline-none"
                value={formik.values.name}
                onChange={formik.handleChange}
              />
              {formik.errors.name && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <span>⚠️</span> {formik.errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
              <input
                name="address"
                placeholder="Enter your address"
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white/50 backdrop-blur-sm focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all duration-300 outline-none"
                value={formik.values.address}
                onChange={formik.handleChange}
              />
              {formik.errors.address && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <span>⚠️</span> {formik.errors.address}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Contact Number</label>
              <input
                name="contactNumber"
                placeholder="10 digit number"
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white/50 backdrop-blur-sm focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all duration-300 outline-none"
                value={formik.values.contactNumber}
                onChange={formik.handleChange}
              />
              {formik.errors.contactNumber && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <span>⚠️</span> {formik.errors.contactNumber}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
              <input
                name="username"
                placeholder="Choose a username"
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white/50 backdrop-blur-sm focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all duration-300 outline-none"
                value={formik.values.username}
                onChange={formik.handleChange}
              />
              {formik.errors.username && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <span>⚠️</span> {formik.errors.username}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Minimum 6 characters"
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white/50 backdrop-blur-sm focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all duration-300 outline-none"
                value={formik.values.password}
                onChange={formik.handleChange}
              />
              {formik.errors.password && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <span>⚠️</span> {formik.errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl font-medium hover:shadow-2xl hover:shadow-teal-500/50 transition-all duration-300 hover:scale-105 text-lg mt-6"
            >
              Create Account
            </button>

            <div className="text-center pt-4 border-t border-slate-200 mt-6">
              <p className="text-sm text-slate-600">
                Already have an account?{" "}
                <Link to="/login" className="text-cyan-600 font-semibold hover:text-cyan-700 transition-colors">
                  Login here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Global Styles */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');
        
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
