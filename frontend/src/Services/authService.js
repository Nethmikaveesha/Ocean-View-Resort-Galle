import api from "./services/api";

export const loginUser = (loginData) => {
  return api.post("/auth/login", loginData);
};

export const registerUser = (userData) => {
  return api.post("/auth/register", userData);
};

export const logoutUser = () => {
  return api.post("/auth/logout");
};

export const checkAuth = () => {
  return api.get("/auth/check");
};