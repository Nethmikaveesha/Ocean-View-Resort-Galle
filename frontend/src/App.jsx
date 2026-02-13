import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ROLE_ADMIN, ROLE_MANAGER, ROLE_RECEPTIONIST, ROLE_CUSTOMER } from "./constants/roles";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import CheckAvailability from "./pages/CheckAvailability";
import About from "./pages/About";
import Help from "./pages/Help";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CustomerDashboard from "./pages/CustomerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import ReceptionistDashboard from "./pages/ReceptionistDashboard";
import AddReservation from "./pages/AddReservation";
import ViewReservation from "./pages/ViewReservation";

const STAFF_DASHBOARD_PATHS = ["/admin-dashboard", "/manager-dashboard", "/receptionist-dashboard"];

function AppContent() {
  const location = useLocation();
  const isStaffDashboard = STAFF_DASHBOARD_PATHS.some((p) => location.pathname.startsWith(p));

  return (
    <>
      {!isStaffDashboard && <Navbar />}
      <div className={isStaffDashboard ? "" : "p-4"}>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/check" element={<CheckAvailability />} />
            <Route path="/about" element={<About />} />
            <Route path="/help" element={<Help />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Customer Protected Routes */}
            <Route
              path="/customer-dashboard"
              element={
                <ProtectedRoute role={ROLE_CUSTOMER}>
                  <CustomerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-reservation"
              element={
                <ProtectedRoute role={ROLE_CUSTOMER}>
                  <AddReservation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/view-reservation"
              element={
                <ProtectedRoute role={ROLE_CUSTOMER}>
                  <ViewReservation />
                </ProtectedRoute>
              }
            />

            {/* Admin Protected Routes */}
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute role={ROLE_ADMIN}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager-dashboard"
              element={
                <ProtectedRoute role={ROLE_MANAGER}>
                  <ManagerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/receptionist-dashboard"
              element={
                <ProtectedRoute role={ROLE_RECEPTIONIST}>
                  <ReceptionistDashboard />
                </ProtectedRoute>
              }
            />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
