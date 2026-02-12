/**
 * Centralized role constants to avoid typos between frontend and backend.
 */

// Frontend uses lowercase for localStorage / display
export const ROLE_ADMIN = "admin";
export const ROLE_CUSTOMER = "customer";

// Admin sub-roles (backend values)
export const ADMIN_SUBROLES = {
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  RECEPTIONIST: "RECEPTIONIST",
};

export const ADMIN_ROLE_OPTIONS = [
  { value: ADMIN_SUBROLES.ADMIN, label: "Admin" },
  { value: ADMIN_SUBROLES.MANAGER, label: "Manager" },
  { value: ADMIN_SUBROLES.RECEPTIONIST, label: "Receptionist" },
];
