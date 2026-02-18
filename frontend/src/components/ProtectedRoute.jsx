import { Navigate } from "react-router-dom";
import { ROLE_ADMIN, ROLE_MANAGER, ROLE_RECEPTIONIST } from "../constants/roles";

const ROLE_TO_DASHBOARD = {
  [ROLE_ADMIN]: "/admin",
  [ROLE_MANAGER]: "/admin/manager",
  [ROLE_RECEPTIONIST]: "/admin/receptionist",
};

/**
 * Protects routes by role. Redirects to login if not authenticated.
 * On role mismatch: redirect to user's dashboard.
 */
export default function ProtectedRoute({ children, role }) {
  const userRole = localStorage.getItem("userRole");
  const token = localStorage.getItem("token");

  if (!token || !userRole) {
    return <Navigate to="/login" replace />;
  }

  if (role && userRole !== role) {
    const redirect = ROLE_TO_DASHBOARD[userRole] || "/customer-dashboard";
    return <Navigate to={redirect} replace />;
  }

  return children;
}
