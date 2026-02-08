// src/services/api.js
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080", // your Spring Boot backend
});

// Add token automatically to request headers if it exists
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default instance;
