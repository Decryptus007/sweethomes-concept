"use client";

import { useState, useEffect } from "react";
import {
  CalendarCheck,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Calendar,
  User,
  Mail,
  Phone,
  BedDouble,
  Plus,
  Edit,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddBookingModal } from "@/components/admin/AddBookingModal";
import { EditBookingModal } from "@/components/admin/EditBookingModal";
import { getBookings, addBooking, updateBooking, getBookingStatistics } from "@/lib/api";
import toast from "react-hot-toast";

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
  user: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
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

export default function BookingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number, left: number } | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [statistics, setStatistics] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0,
    revenue: "0.00"
  });
  const [loading, setLoading] = useState(true);
  const [statisticsLoading, setStatisticsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchBookings();
    fetchStatistics();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await getBookings();
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      setStatisticsLoading(true);
      const response = await getBookingStatistics();
      setStatistics(response.data);
    } catch (error) {
      console.error("Error fetching statistics:", error);
      toast.error("Failed to load statistics");
    } finally {
      setStatisticsLoading(false);
    }
  };

  const handleAddBooking = async (bookingData: {
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
  }) => {
    await addBooking(bookingData);
    toast.success("Booking created successfully");
    fetchBookings();
    fetchStatistics(); // This will show loading state
    setIsAddModalOpen(false);
  };

  const handleEditBooking = async (bookingData: {
    check_in: string;
    check_out: string;
    adults: number;
    children: number;
    status: string;
    special_requests?: string;
  }) => {
    if (!selectedBooking) return;

    await updateBooking(selectedBooking.id, bookingData);
    toast.success("Booking updated successfully");
    fetchBookings();
    fetchStatistics(); // This will show loading state
    setIsEditModalOpen(false);
    setSelectedBooking(null);
  };

  const handleDropdownToggle = (bookingId: number, event: React.MouseEvent) => {
    if (openDropdown === bookingId) {
      setOpenDropdown(null);
      setDropdownPosition(null);
    } else {
      // Only set position for desktop (when we have a large screen)
      if (window.innerWidth >= 1024) {
        const rect = (event.target as HTMLElement).getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + window.scrollY + 4,
          left: rect.right + window.scrollX - 176
        });
      } else {
        setDropdownPosition(null);
      }
      setOpenDropdown(bookingId);
    }
  };

  const handleEditClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsEditModalOpen(true);
    setOpenDropdown(null);
    setDropdownPosition(null);
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.room.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-foreground font-[family-name:var(--font-gilda)] text-3xl">
            Bookings
          </h1>
          <p className="text-muted-foreground mt-1">
            View and manage all reservations
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-2">
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full sm:w-auto"
          >
            <Plus className="size-4" />
            Create Booking
          </Button>
          <Button variant="outline" className="w-full sm:w-auto">
            <Download className="size-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="border-border bg-card flex flex-col gap-4 rounded-xl border p-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            placeholder="Search by guest name, email, or room..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="text-muted-foreground size-4" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border-input bg-background focus:border-ring focus:ring-ring/50 h-10 rounded-md border px-3 text-sm focus:ring-2 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="checked_in">Checked In</option>
            <option value="checked_out">Checked Out</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <div className="border-border bg-card rounded-lg border p-4">
          <p className="text-muted-foreground text-sm">Total Bookings</p>
          {statisticsLoading ? (
            <div className="mt-1 h-8 w-16 animate-pulse rounded bg-gray-200"></div>
          ) : (
            <p className="text-foreground mt-1 text-2xl font-bold">
              {statistics.total}
            </p>
          )}
        </div>
        <div className="border-border bg-card rounded-lg border p-4">
          <p className="text-muted-foreground text-sm">Pending</p>
          {statisticsLoading ? (
            <div className="mt-1 h-8 w-12 animate-pulse rounded bg-gray-200"></div>
          ) : (
            <p className="mt-1 text-2xl font-bold text-yellow-600">
              {statistics.pending}
            </p>
          )}
        </div>
        <div className="border-border bg-card rounded-lg border p-4">
          <p className="text-muted-foreground text-sm">Confirmed</p>
          {statisticsLoading ? (
            <div className="mt-1 h-8 w-12 animate-pulse rounded bg-gray-200"></div>
          ) : (
            <p className="mt-1 text-2xl font-bold text-blue-600">
              {statistics.confirmed}
            </p>
          )}
        </div>
        <div className="border-border bg-card rounded-lg border p-4">
          <p className="text-muted-foreground text-sm">Cancelled</p>
          {statisticsLoading ? (
            <div className="mt-1 h-8 w-12 animate-pulse rounded bg-gray-200"></div>
          ) : (
            <p className="mt-1 text-2xl font-bold text-red-600">
              {statistics.cancelled}
            </p>
          )}
        </div>
        <div className="border-border bg-card col-span-2 rounded-lg border p-4 sm:col-span-1">
          <p className="text-muted-foreground text-sm">Total Revenue</p>
          {statisticsLoading ? (
            <div className="mt-1 h-8 w-24 animate-pulse rounded bg-gray-200"></div>
          ) : (
            <p className="text-foreground mt-1 text-2xl font-bold">
              {formatPrice(parseFloat(statistics.revenue))}
            </p>
          )}
        </div>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="border-border bg-card flex flex-col items-center justify-center rounded-xl border py-16">
          <div className="border-muted-foreground size-8 animate-spin rounded-full border-2 border-t-transparent"></div>
          <p className="text-muted-foreground mt-4">Loading bookings...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="border-border bg-card flex flex-col items-center justify-center rounded-xl border py-16">
          <CalendarCheck className="text-muted-foreground size-12" />
          <p className="text-foreground mt-4 text-lg font-medium">
            No bookings found
          </p>
          <p className="text-muted-foreground mt-1">
            {searchQuery || statusFilter !== "all"
              ? "Try adjusting your search or filters"
              : "No bookings have been made yet"}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="border-border bg-card hidden rounded-xl border lg:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-border bg-accent/50 border-b">
                  <tr>
                    <th className="text-muted-foreground px-4 py-4 text-left text-sm font-medium">
                      Guest
                    </th>
                    <th className="text-muted-foreground px-4 py-4 text-left text-sm font-medium">
                      Room
                    </th>
                    <th className="text-muted-foreground px-4 py-4 text-left text-sm font-medium">
                      Check In
                    </th>
                    <th className="text-muted-foreground px-4 py-4 text-left text-sm font-medium">
                      Check Out
                    </th>
                    <th className="text-muted-foreground px-4 py-4 text-left text-sm font-medium">
                      Total
                    </th>
                    <th className="text-muted-foreground px-4 py-4 text-left text-sm font-medium">
                      Status
                    </th>
                    <th className="text-muted-foreground px-4 py-4 text-right text-sm font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-border divide-y">
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-accent/30">
                      <td className="px-4 py-4">
                        <div>
                          <p className="text-foreground font-medium">
                            {booking.user.name}
                          </p>
                          <p className="text-muted-foreground text-sm">
                            {booking.user.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-foreground">{booking.room.name}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-foreground">
                          {formatDate(booking.check_in)}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-foreground">
                          {formatDate(booking.check_out)}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-foreground font-medium">
                          {formatPrice(booking.total_price)}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={cn(
                            "inline-block rounded-full px-2.5 py-1 text-xs font-medium",
                            statusStyles[booking.status],
                          )}
                        >
                          {statusLabels[booking.status]}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="relative flex justify-end">
                          <button
                            onClick={(e) => handleDropdownToggle(booking.id, e)}
                            className="hover:bg-accent rounded-lg p-2"
                          >
                            <MoreHorizontal className="text-muted-foreground size-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="grid gap-4 lg:hidden">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="border-border bg-card rounded-xl border p-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-foreground font-medium">
                      {booking.user.name}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {booking.user.email}
                    </p>
                  </div>
                  <div className="relative">
                    <button
                      onClick={(e) => handleDropdownToggle(booking.id, e)}
                      className="hover:bg-accent rounded-lg p-2"
                    >
                      <MoreHorizontal className="text-muted-foreground size-5" />
                    </button>
                    {openDropdown === booking.id && (
                      <div className="border-border bg-card absolute top-full right-0 z-50 mt-1 w-44 overflow-hidden rounded-lg border shadow-lg">
                        <button
                          onClick={() => {
                            setSelectedBooking(booking);
                            setOpenDropdown(null);
                            setDropdownPosition(null);
                          }}
                          className="text-foreground hover:bg-accent flex w-full items-center gap-2 px-4 py-2.5 text-sm"
                        >
                          <Eye className="size-4" />
                          View Details
                        </button>
                        <button
                          onClick={() => handleEditClick(booking)}
                          className="text-foreground hover:bg-accent flex w-full items-center gap-2 px-4 py-2.5 text-sm"
                        >
                          <Edit className="size-4" />
                          Edit
                        </button>
                        {booking.status === "pending" && (
                          <button className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-green-600 hover:bg-green-50">
                            <CheckCircle className="size-4" />
                            Confirm
                          </button>
                        )}
                        {booking.status === "confirmed" && (
                          <button className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50">
                            <CheckCircle className="size-4" />
                            Check In
                          </button>
                        )}
                        {booking.status !== "cancelled" &&
                          booking.status !== "checked_out" && (
                            <button className="text-destructive hover:bg-destructive/10 flex w-full items-center gap-2 px-4 py-2.5 text-sm">
                              <XCircle className="size-4" />
                              Cancel
                            </button>
                          )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-medium",
                      statusStyles[booking.status],
                    )}
                  >
                    {statusLabels[booking.status]}
                  </span>
                </div>

                <div className="border-border mt-4 grid grid-cols-2 gap-4 border-t pt-4">
                  <div>
                    <p className="text-muted-foreground text-sm">Room</p>
                    <p className="text-foreground font-medium">
                      {booking.room.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Total</p>
                    <p className="text-foreground font-medium">
                      {formatPrice(booking.total_price)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Check In</p>
                    <p className="text-foreground font-medium">
                      {formatDate(booking.check_in)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Check Out</p>
                    <p className="text-foreground font-medium">
                      {formatDate(booking.check_out)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Dropdown Menu - Rendered outside table to avoid clipping (Desktop only) */}
      {openDropdown !== null && dropdownPosition && (
        <div className="fixed inset-0 z-40 hidden lg:block" onClick={() => { setOpenDropdown(null); setDropdownPosition(null); }}>
          {(() => {
            const booking = filteredBookings.find(b => b.id === openDropdown);
            if (!booking) return null;

            return (
              <div
                className="border-border bg-card absolute w-44 overflow-hidden rounded-lg border shadow-lg z-50"
                style={{
                  top: `${dropdownPosition.top}px`,
                  left: `${dropdownPosition.left}px`
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => {
                    setSelectedBooking(booking);
                    setOpenDropdown(null);
                    setDropdownPosition(null);
                  }}
                  className="text-foreground hover:bg-accent flex w-full items-center gap-2 px-4 py-2.5 text-sm"
                >
                  <Eye className="size-4" />
                  View Details
                </button>
                <button
                  onClick={() => handleEditClick(booking)}
                  className="text-foreground hover:bg-accent flex w-full items-center gap-2 px-4 py-2.5 text-sm"
                >
                  <Edit className="size-4" />
                  Edit
                </button>
                {booking.status === "pending" && (
                  <button className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-green-600 hover:bg-green-50">
                    <CheckCircle className="size-4" />
                    Confirm
                  </button>
                )}
                {booking.status === "confirmed" && (
                  <button className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50">
                    <CheckCircle className="size-4" />
                    Check In
                  </button>
                )}
                {booking.status !== "cancelled" &&
                  booking.status !== "checked_out" && (
                    <button className="text-destructive hover:bg-destructive/10 flex w-full items-center gap-2 px-4 py-2.5 text-sm">
                      <XCircle className="size-4" />
                      Cancel
                    </button>
                  )}
              </div>
            );
          })()}
        </div>
      )}

      {/* Mobile dropdown backdrop */}
      {openDropdown !== null && !dropdownPosition && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setOpenDropdown(null)}
        />
      )}

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-foreground font-[family-name:var(--font-gilda)] text-2xl">
                Booking Details
              </h2>
              <button
                onClick={() => setSelectedBooking(null)}
                className="hover:bg-accent rounded-lg p-2"
              >
                <XCircle className="text-muted-foreground size-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Status */}
              <div className="flex gap-2">
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-sm font-medium",
                    statusStyles[selectedBooking.status],
                  )}
                >
                  {statusLabels[selectedBooking.status]}
                </span>
              </div>

              {/* Guest Info */}
              <div className="space-y-3">
                <h3 className="text-foreground font-medium">
                  Guest Information
                </h3>
                <div className="bg-accent/50 space-y-2 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <User className="text-muted-foreground size-4" />
                    <span className="text-foreground">
                      {selectedBooking.user.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="text-muted-foreground size-4" />
                    <span className="text-foreground">
                      {selectedBooking.user.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="text-muted-foreground size-4" />
                    <span className="text-foreground">
                      {selectedBooking.user.phone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Room Info */}
              <div className="space-y-3">
                <h3 className="text-foreground font-medium">Room Details</h3>
                <div className="bg-accent/50 space-y-2 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <BedDouble className="text-muted-foreground size-4" />
                    <span className="text-foreground">
                      {selectedBooking.room.name} - Room {selectedBooking.room.room_number}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="space-y-3">
                <h3 className="text-foreground font-medium">
                  Reservation Dates
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-accent/50 rounded-lg p-4">
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                      <Calendar className="size-4" />
                      Check In
                    </div>
                    <p className="text-foreground mt-1 font-medium">
                      {formatDate(selectedBooking.check_in)}
                    </p>
                  </div>
                  <div className="bg-accent/50 rounded-lg p-4">
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                      <Calendar className="size-4" />
                      Check Out
                    </div>
                    <p className="text-foreground mt-1 font-medium">
                      {formatDate(selectedBooking.check_out)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="border-border bg-primary/5 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Amount</span>
                  <span className="text-primary text-2xl font-bold">
                    {formatPrice(selectedBooking.total_price)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                {selectedBooking.status === "pending" && (
                  <Button className="flex-1">
                    <CheckCircle className="size-4" />
                    Confirm Booking
                  </Button>
                )}
                {selectedBooking.status === "confirmed" && (
                  <Button className="flex-1">
                    <CheckCircle className="size-4" />
                    Check In Guest
                  </Button>
                )}
                {selectedBooking.status === "checked_in" && (
                  <Button className="flex-1">
                    <CheckCircle className="size-4" />
                    Check Out Guest
                  </Button>
                )}
                {selectedBooking.status !== "cancelled" &&
                  selectedBooking.status !== "checked_out" && (
                    <Button
                      variant="outline"
                      className="text-destructive flex-1"
                    >
                      <XCircle className="size-4" />
                      Cancel
                    </Button>
                  )}
              </div>

              {/* Booked On */}
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <Clock className="size-4" />
                Booked on {formatDate(selectedBooking.created_at)}
              </div>
            </div>
          </div>
        </div>
      )}

      <AddBookingModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddBooking}
      />

      <EditBookingModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onEdit={handleEditBooking}
        booking={selectedBooking}
      />
    </div>
  );
}