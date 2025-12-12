// src/api/axiosInstance.js
import axios from "axios";

const api = axios.create({
    baseURL: "/api"
});

// Automatically attach token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        // Ensure headers object exists
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
