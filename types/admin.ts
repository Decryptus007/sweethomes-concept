// Admin User Types
export interface AdminUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  email_verified_at: string | null;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface AdminLoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: AdminUser;
}

export interface AdminLoginPayload {
  email: string;
  password: string;
}

// API Error Response
export interface ApiError {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

// Dashboard Analytics Types
export interface DashboardStats {
  totalRooms: number;
  totalBookings: number;
  totalRevenue: number;
  occupancyRate: number;
  pendingBookings: number;
  activeGuests: number;
}

// Room Types
export interface Room {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  capacity: number;
  status: "available" | "occupied" | "maintenance";
  images: string[];
  amenities: Amenity[];
  created_at: string;
  updated_at: string;
}

// Amenity Types
export interface Amenity {
  id: number;
  name: string;
  icon: string;
  description: string;
  created_at: string;
  updated_at: string;
}

// Facility Types
export interface Facility {
  id: number;
  name: string;
  icon: string;
  description: string;
  image: string;
  created_at: string;
  updated_at: string;
}

// Booking Types
export interface Booking {
  id: number;
  room: Room;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  check_in: string;
  check_out: string;
  total_price: number;
  status: "pending" | "confirmed" | "checked_in" | "checked_out" | "cancelled";
  payment_status: "pending" | "paid" | "refunded";
  created_at: string;
  updated_at: string;
}

// Paginated Response
export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}
