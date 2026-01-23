"use client";

import { useState, useEffect } from "react";
import { useUserAuth } from "@/hooks/useUserAuth";
import { getUserBookings } from "@/lib/api";
import { Calendar, User, Mail, Phone, BedDouble, Clock, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface Booking {
  id: number;
  check_in: string;
  check_out: string;
  adults: number;
  children: number;
  status: "pending" | "confirmed" | "checked_in" | "checked_out" | "cancelled";
  special_requests?: string;
  total_price: number;
  created_at: string;
  updated_at: string;
  room: {
    id: number;
    name: string;
    room_number: string;
    type: string;
    price_per_night: string;
    capacity: number;
    description: string;
  };
}

export default function UserDashboard() {
  const { user, logout, isAuthenticated } = useUserAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }
    fetchBookings();
  }, [isAuthenticated, router]);

  const fetchBookings = async () => {
    try {
      const response = await getUserBookings();
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
    toast.success("Logged out successfully");
  };

  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    checked_in: "bg-green-100 text-green-800",
    checked_out: "bg-gray-100 text-gray-800",
    cancelled: "bg-red-100 text-red-800",
  };

  const statusLabels = {
    pending: "Pending",
    confirmed: "Confirmed",
    checked_in: "Checked In",
    checked_out: "Checked Out",
    cancelled: "Cancelled",
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="size-8 animate-spin rounded-full border-2 border-gray-300 border-t-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
              <p className="mt-1 text-gray-600">Welcome back, {user.name}!</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="mt-4 sm:mt-0"
            >
              <LogOut className="size-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <User className="size-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium text-gray-900">{user.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="size-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="size-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium text-gray-900">{user.phone}</p>
              </div>
            </div>
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Login Tip:</strong> Use your email ({user.email}) as both username and password to access your account anytime.
            </p>
          </div>
        </div>

        {/* Bookings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">My Bookings</h2>
            <Button
              onClick={() => router.push('/')}
              variant="outline"
            >
              Book Another Room
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="size-8 animate-spin rounded-full border-2 border-gray-300 border-t-black"></div>
              <p className="ml-4 text-gray-600">Loading bookings...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12">
              <BedDouble className="size-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900">No bookings yet</p>
              <p className="text-gray-600 mb-6">Start by booking your first room with us!</p>
              <Button onClick={() => router.push('/')}>
                Browse Rooms
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {booking.room.name}
                        </h3>
                        <span
                          className={cn(
                            "inline-block rounded-full px-2.5 py-1 text-xs font-medium",
                            statusStyles[booking.status],
                          )}
                        >
                          {statusLabels[booking.status]}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <BedDouble className="size-4 text-gray-400" />
                          <span className="text-gray-600">Room {booking.room.room_number}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="size-4 text-gray-400" />
                          <span className="text-gray-600">
                            {formatDate(booking.check_in)} - {formatDate(booking.check_out)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="size-4 text-gray-400" />
                          <span className="text-gray-600">
                            {booking.adults} Adult(s), {booking.children} Child(ren)
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="size-4 text-gray-400" />
                          <span className="text-gray-600">
                            Booked {formatDate(booking.created_at)}
                          </span>
                        </div>
                      </div>

                      {booking.special_requests && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">
                            <strong>Special Requests:</strong> {booking.special_requests}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 lg:mt-0 lg:ml-6 text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        {formatPrice(booking.total_price)}
                      </p>
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Booking ID: #{booking.id}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}