import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import CheckAvailability from "./pages/CheckAvailability";
import About from "./pages/About";
import Help from "./pages/Help";
import Login from "./pages/Login";
import CustomerRegister from "./pages/CustomerRegister";
import CustomerLogin from "./pages/CustomerLogin";
import CustomerDashboard from "./pages/CustomerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AddReservation from "./pages/AddReservation";
import ViewReservation from "./pages/ViewReservation";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/check" element={<CheckAvailability />} />
            <Route path="/about" element={<About />} />
            <Route path="/help" element={<Help />} />
            <Route path="/login" element={<Login />} />
            <Route path="/customer-register" element={<CustomerRegister />} />
            <Route path="/customer-login" element={<CustomerLogin />} />

            {/* Customer Protected Routes */}
            <Route
              path="/customer-dashboard"
              element={
                <ProtectedRoute role="customer">
                  <CustomerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-reservation"
              element={
                <ProtectedRoute role="customer">
                  <AddReservation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/view-reservation"
              element={
                <ProtectedRoute role="customer">
                  <ViewReservation />
                </ProtectedRoute>
              }
            />

            {/* Admin Protected Routes */}
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
