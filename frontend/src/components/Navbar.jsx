import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <div className="text-xl font-bold">
        <Link to="/">Ocean View Resort</Link>
      </div>

      <div className="space-x-4">
        {/* Always visible links */}
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/help">Help</Link>

        {/* If user is not logged in */}
        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}

        {/* If user is logged in */}
        {user && user.role === "customer" && (
          <>
            <Link to="/customer-dashboard">Dashboard</Link>
            <Link to="/add-reservation">Add Reservation</Link>
            <Link to="/view-reservation">View Reservation</Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        )}

        {user && user.role === "admin" && (
          <>
            <Link to="/admin-dashboard">Admin Dashboard</Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
