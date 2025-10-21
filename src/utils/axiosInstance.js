import axios from "axios";
import { isTokenValid, refreshAccessToken } from "./auth";

const api = axios.create({
  // baseURL: 'https://curriculum-backend-235222027541.us-central1.run.app',
  baseURL: "http://localhost:8080",
});

// Request interceptor: attach access token
api.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem("token");

    // If token invalid, try refresh
    if (token && !isTokenValid(token)) {
      token = await refreshAccessToken();
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const newToken = await refreshAccessToken();
      if (newToken) {
        localStorage.setItem("token", newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest); // retry request
      } else {
        // Refresh failed → logout
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
