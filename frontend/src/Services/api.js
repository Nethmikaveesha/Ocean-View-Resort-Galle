import axios from "axios";

// Base URL of your Spring Boot backend
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ===== USER AUTH =====

// Customer login
export const loginCustomer = async (username, password) => {
  try {
    const res = await api.post("/auth/login", { username, password });
    return res.data; // { token, username, role, ... }
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// Admin login
export const loginAdmin = async (username, password) => {
  // Hardcoded admin credentials
  if (username === "admin" && password === "admin123") {
    return { username, role: "ADMIN" };
  } else {
    throw { message: "Invalid admin credentials" };
  }
};

// ===== RESERVATIONS =====

// Add a new reservation
export const addReservation = async (reservationData) => {
  try {
    const res = await api.post("/reservations", reservationData);
    return res.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// Get reservation by reservation number
export const getReservation = async (reservationNumber) => {
  try {
    const res = await api.get(`/reservations/${reservationNumber}`);
    return res.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// Check room availability
export const checkRoomAvailability = async (roomType, checkIn, checkOut) => {
  try {
    const res = await api.get("/reservations/availability", {
      params: { roomType, checkIn, checkOut },
    });
    return res.data; // { available: true/false }
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// ===== BILL =====

// Download or get bill PDF for a reservation
export const getBill = async (reservationNumber) => {
  try {
    const res = await api.get(`/bills/${reservationNumber}`, {
      responseType: "blob", // Important for PDF
    });
    return res.data; // Blob data for PDF
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export default api;
