import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

// Normal user API client
export const userApiClient = axios.create({
  baseURL,
});

// Admin API client
export const adminApiClient = axios.create({
  baseURL,
});

// Interceptor for user API client
userApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("user_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor for admin API client
adminApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptors can be added if needed, e.g., for error handling
userApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors, e.g., redirect on 401
    return Promise.reject(error);
  },
);

adminApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors, e.g., redirect on 401
    return Promise.reject(error);
  },
);
