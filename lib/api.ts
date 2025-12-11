import axios from "axios";
import { RoomType } from "./roomTypes";

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

// Amenities API
export const getAmenities = () => adminApiClient.get("/amenities");
export const addAmenity = (data: { name: string }) =>
  adminApiClient.post("/amenities", data);
export const updateAmenity = (id: number, name: string) =>
  adminApiClient.put(`/amenities/${id}?name=${encodeURIComponent(name)}`);
export const deleteAmenity = (id: number) =>
  adminApiClient.delete(`/amenities/${id}`);

// Facilities API
export const getFacilities = () => adminApiClient.get("/facilities");
export const addFacility = (data: { name: string }) =>
  adminApiClient.post("/facilities", data);
export const updateFacility = (id: number, name: string) =>
  adminApiClient.put(`/facilities/${id}?name=${encodeURIComponent(name)}`);
export const deleteFacility = (id: number) =>
  adminApiClient.delete(`/facilities/${id}`);

// Rooms API
export const getRooms = () => adminApiClient.get("/rooms");
export const addRoom = (data: {
  name: string;
  room_number: string;
  type: RoomType;
  price_per_night: number;
  capacity: number;
  description: string;
  status: "available" | "occupied" | "maintenance";
  amenities: number[];
  facilities: number[];
}) => adminApiClient.post("/rooms", data);
export const updateRoom = (
  id: number,
  data: Partial<{
    name: string;
    room_number: string;
    type: RoomType;
    price_per_night: number;
    capacity: number;
    description: string;
    status: "available" | "occupied" | "maintenance";
    amenities: number[];
    facilities: number[];
  }>,
) => adminApiClient.put(`/rooms/${id}`, data);
export const deleteRoom = (id: number) => adminApiClient.delete(`/rooms/${id}`);
