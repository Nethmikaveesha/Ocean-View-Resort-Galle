import { Navigate } from "react-router-dom";
import { ROLE_ADMIN } from "../constants/roles";

/**
 * Protects routes by role. Redirects to login if not authenticated.
 * On role mismatch: admin→admin-dashboard, customer→customer-dashboard.
 */
export default function ProtectedRoute({ children, role }) {
  const userRole = localStorage.getItem("userRole");
  const token = localStorage.getItem("token");

  if (!token || !userRole) {
    return <Navigate to="/login" replace />;
  }

  if (role && userRole !== role) {
    if (userRole === ROLE_ADMIN) return <Navigate to="/admin-dashboard" replace />;
    return <Navigate to="/customer-dashboard" replace />;
  }

  return children;
}
