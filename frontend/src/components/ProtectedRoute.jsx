import { Navigate } from "react-router-dom";

// role = "admin" or "customer"
export default function ProtectedRoute({ children, role }) {
  const userRole = localStorage.getItem("userRole");

  if (!userRole) {
    // Not logged in
    return <Navigate to="/login" />;
  }

  if (role && userRole !== role) {
    // Role mismatch
    return <Navigate to="/login" />;
  }

  return children;
}
