// src/api/api.js
import axios from "axios";

const base = import.meta.env.VITE_API || "http://localhost:5000/api";

const api = axios.create({
  baseURL: base,
  headers: {
    "Content-Type": "application/json"
  }
});

// attach token if exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
