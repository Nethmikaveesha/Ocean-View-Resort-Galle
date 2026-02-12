import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const userRole = user?.role || localStorage.getItem("userRole");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <div className="text-xl font-bold">
        <Link to="/">Ocean View Resort</Link>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/about" className="hover:underline">About</Link>
        <Link to="/help" className="hover:underline">Help</Link>

        {userRole === "admin" ? (
          <>
            <Link to="/admin-dashboard" className="hover:underline">Admin Dashboard</Link>
            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded">
              Logout
            </button>
          </>
        ) : userRole === "customer" ? (
          <>
            <Link to="/customer-dashboard" className="hover:underline">Dashboard</Link>
            <Link to="/add-reservation" className="hover:underline">Add Reservation</Link>
            <Link to="/view-reservation" className="hover:underline">My Reservations</Link>
            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="hover:underline">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
