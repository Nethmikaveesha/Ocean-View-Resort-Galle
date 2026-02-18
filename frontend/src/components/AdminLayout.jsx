import { Navigate, Outlet } from "react-router-dom";
import { ROLE_ADMIN, ROLE_MANAGER, ROLE_RECEPTIONIST } from "../constants/roles";

const STAFF_ROLES = [ROLE_ADMIN, ROLE_MANAGER, ROLE_RECEPTIONIST];

/**
 * AdminLayout wraps all /admin/* routes.
 * Protects the area: only staff (Admin, Manager, Receptionist) can access.
 * Redirects unauthenticated users to /staff-login.
 * Redirects customers to home.
 */
export default function AdminLayout() {
  const userRole = localStorage.getItem("userRole");
  const token = localStorage.getItem("token");

  if (!token || !userRole) {
    return <Navigate to="/staff-login" replace />;
  }

  if (!STAFF_ROLES.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
