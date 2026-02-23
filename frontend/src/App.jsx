import React from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ROLE_ADMIN, ROLE_MANAGER, ROLE_RECEPTIONIST, ROLE_CUSTOMER } from "./constants/roles";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";

// Pages
import Home from "./pages/Home";
import CheckAvailability from "./pages/CheckAvailability";
import About from "./pages/About";
import Help from "./pages/Help";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StaffLogin from "./pages/StaffLogin";
import CustomerDashboard from "./pages/CustomerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import ReceptionistDashboard from "./pages/ReceptionistDashboard";
import AddReservation from "./pages/AddReservation";
import ViewReservation from "./pages/ViewReservation";

const STAFF_DASHBOARD_PATHS = ["/admin"];

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
            <Route path="/staff-login" element={<StaffLogin />} />

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
              path="/view-reservation/:reservationNumber?"
              element={
                <ProtectedRoute role={ROLE_CUSTOMER}>
                  <ViewReservation />
                </ProtectedRoute>
              }
            />

            {/* Admin Protected Routes - all under /admin/* */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route
                index
                element={
                  <ProtectedRoute role={ROLE_ADMIN}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="manager"
                element={
                  <ProtectedRoute role={ROLE_MANAGER}>
                    <ManagerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="receptionist"
                element={
                  <ProtectedRoute role={ROLE_RECEPTIONIST}>
                    <ReceptionistDashboard />
                  </ProtectedRoute>
                }
              />
            </Route>
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
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: { background: "#1e293b", color: "#f8fafc", borderRadius: "12px" },
            success: { iconTheme: { primary: "#10b981", secondary: "#f8fafc" } },
            error: { iconTheme: { primary: "#ef4444", secondary: "#f8fafc" } },
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
