import React, { createContext, useState } from "react";
import toast from "react-hot-toast";

// Create AuthContext
export const AuthContext = createContext();

// Provide context to the app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    toast.success("You have logged out successfully.");
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    sessionStorage.removeItem("availabilityVerified");
    sessionStorage.removeItem("availableDates");
  };

  // Load user from localStorage on refresh
  React.useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      const role = localStorage.getItem("userRole");
      if (role) {
        setUser({ role, username: localStorage.getItem("username") });
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
};