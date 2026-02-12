import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ===== USER AUTH =====
export const loginCustomer = async (username, password) => {
  try {
    const res = await api.post("/auth/login", { username, password });
    return res.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// ===== RESERVATIONS =====
export const addReservation = async (reservationData) => {
  const res = await api.post("/reservations", reservationData);
  return res.data;
};

export const getReservation = async (reservationNumber) => {
  const res = await api.get(`/reservations/${reservationNumber}`);
  return res.data;
};

export const getMyReservations = async (username) => {
  const res = await api.get("/reservations/my", { params: { username } });
  return res.data;
};

export const getReservations = async () => {
  const res = await api.get("/reservations");
  return res.data;
};

export const updateReservation = async (id, data) => {
  const res = await api.put(`/reservations/${id}`, data);
  return res.data;
};

export const deleteReservation = async (id) => {
  await api.delete(`/reservations/${id}`);
};

export const checkRoomAvailability = async (roomType, checkIn, checkOut) => {
  const res = await api.get("/reservations/availability", {
    params: { roomType, checkIn, checkOut },
  });
  return res.data;
};

// ===== ROOMS =====
export const getRooms = async () => {
  const res = await api.get("/rooms");
  return res.data;
};

export const getAvailableRooms = async () => {
  const res = await api.get("/rooms/available");
  return res.data;
};

export const addRoom = async (roomData) => {
  const res = await api.post("/rooms", roomData);
  return res.data;
};

export const updateRoom = async (id, roomData) => {
  const res = await api.put(`/rooms/${id}`, roomData);
  return res.data;
};

export const deleteRoom = async (id) => {
  await api.delete(`/rooms/${id}`);
};

// ===== CUSTOMERS =====
export const getCustomers = async () => {
  const res = await api.get("/customers");
  return res.data;
};

// ===== BILL =====
export const getBill = async (reservationNumber) => {
  const res = await api.get(`/bills/${reservationNumber}`, { responseType: "blob" });
  return res.data;
};

export default api;
