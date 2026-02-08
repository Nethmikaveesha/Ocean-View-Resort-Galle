import api from "./api";

export const addReservation = (reservation) => {
  return api.post("/reservations", reservation);
};

export const getReservationById = (id) => {
  return api.get(`/reservations/${id}`);
};

export const getAvailableRooms = (checkIn, checkOut, roomType) => {
  return api.get("/rooms/available", {
    params: { checkIn, checkOut, roomType },
  });
};

export const getAllReservations = () => {
  return api.get("/reservations");
};