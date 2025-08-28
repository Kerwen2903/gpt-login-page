import axios from "axios";

const API_BASE_URL = "http://192.168.100.20:8000/api/v1";

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken) {
          console.log("[v0] Token expired, attempting refresh...");

          const response = await fetch("/api/refresh", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              refresh_token: refreshToken,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            localStorage.setItem("access_token", data.access_token);
            localStorage.setItem("refresh_token", data.refresh_token);

            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
            return api(originalRequest);
          } else {
            throw new Error("Token refresh failed");
          }
        }
      } catch (refreshError) {
        console.error("[v0] Token refresh failed:", refreshError);
        // Clear tokens and redirect to login
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
