import api from "./api";

export const loginUser = (loginData) => {
  return api.post("/auth/login", loginData);
};

export const registerUser = (userData) => {
  return api.post("/auth/register", userData);
};

export const logoutUser = () => {
  return api.post("/auth/logout");
};