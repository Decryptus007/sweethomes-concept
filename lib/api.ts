import axios from "axios";
import { RoomType } from "./roomTypes";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://api.sweethomes.com.ng/api";

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
  images?: File[];
}) => {
  const formData = new FormData();

  // Append basic room data
  formData.append("name", data.name);
  formData.append("room_number", data.room_number);
  formData.append("type", data.type);
  formData.append("price_per_night", data.price_per_night.toString());
  formData.append("capacity", data.capacity.toString());
  formData.append("description", data.description);
  formData.append("status", data.status);

  // Append arrays
  data.amenities.forEach((amenityId) => {
    formData.append("amenities[]", amenityId.toString());
  });

  data.facilities.forEach((facilityId) => {
    formData.append("facilities[]", facilityId.toString());
  });

  // Append images if provided
  if (data.images && data.images.length > 0) {
    data.images.forEach((image) => {
      formData.append("images[]", image);
    });
  }

  return adminApiClient.post("/rooms", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

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
    images?: File[];
  }>,
) => {
  const formData = new FormData();

  // Add _method for Laravel PUT request simulation
  formData.append("_method", "PUT");

  // Append basic room data if provided
  if (data.name !== undefined) formData.append("name", data.name);
  if (data.room_number !== undefined)
    formData.append("room_number", data.room_number);
  if (data.type !== undefined) formData.append("type", data.type);
  if (data.price_per_night !== undefined)
    formData.append("price_per_night", data.price_per_night.toString());
  if (data.capacity !== undefined)
    formData.append("capacity", data.capacity.toString());
  if (data.description !== undefined)
    formData.append("description", data.description);
  if (data.status !== undefined) formData.append("status", data.status);

  // Append arrays if provided
  if (data.amenities !== undefined) {
    data.amenities.forEach((amenityId) => {
      formData.append("amenities[]", amenityId.toString());
    });
  }

  if (data.facilities !== undefined) {
    data.facilities.forEach((facilityId) => {
      formData.append("facilities[]", facilityId.toString());
    });
  }

  // Append images if provided
  if (data.images && data.images.length > 0) {
    data.images.forEach((image) => {
      formData.append("images[]", image);
    });
  }

  return adminApiClient.post(`/rooms/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteRoom = (id: number) => adminApiClient.delete(`/rooms/${id}`);

// Bookings API
export const getBookings = () => adminApiClient.get("/bookings");

export const getBookingStatistics = () =>
  adminApiClient.get("/bookings/statistics");

export const addBooking = (data: {
  name: string;
  email: string;
  phone: string;
  password: string;
  room_id: number;
  check_in: string;
  check_out: string;
  adults: number;
  children: number;
  special_requests?: string;
}) => adminApiClient.post("/bookings", data);

export const updateBooking = (
  id: number,
  data: Partial<{
    check_in: string;
    check_out: string;
    adults: number;
    children: number;
    status: string;
    special_requests: string;
  }>,
) => adminApiClient.put(`/bookings/${id}`, data);

export const deleteBooking = (id: number) =>
  adminApiClient.delete(`/bookings/${id}`);

// User Authentication API
export const userRegister = (data: {
  name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
}) => userApiClient.post("/user/register", data);

export const userLogin = (data: { email: string; password: string }) =>
  userApiClient.post("/user/login", data);

export const userLogout = () => userApiClient.post("/user/logout");

// User Bookings API
export const getUserBookings = () => userApiClient.get("/user/bookings");

export const createUserBooking = (data: {
  room_id: number;
  check_in: string;
  check_out: string;
  adults: number;
  children: number;
  special_requests?: string;
}) => userApiClient.post("/user/bookings", data);

// Public API (no authentication required)
export const getPublicRooms = () => userApiClient.get("/rooms");

// Public booking creation (uses user authentication)
export const createPublicBooking = (data: {
  name: string;
  email: string;
  phone: string;
  password: string;
  room_id: number;
  check_in: string;
  check_out: string;
  adults: number;
  children: number;
  special_requests?: string;
}) => userApiClient.post("/bookings", data);
