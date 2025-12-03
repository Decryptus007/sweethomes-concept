"use client";

import { useState } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Booking {
  id: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  roomName: string;
  roomId: number;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: "pending" | "confirmed" | "checked_in" | "checked_out" | "cancelled";
  paymentStatus: "pending" | "paid" | "refunded";
  createdAt: string;
}

// Mock data - replace with API call
const mockBookings: Booking[] = [
  {
    id: 1,
    guestName: "John Adebayo",
    guestEmail: "john.adebayo@email.com",
    guestPhone: "+234 801 234 5678",
    roomName: "Deluxe Suite",
    roomId: 1,
    checkIn: "2025-12-03",
    checkOut: "2025-12-06",
    totalPrice: 135000,
    status: "confirmed",
    paymentStatus: "paid",
    createdAt: "2025-11-28",
  },
  {
    id: 2,
    guestName: "Sarah Okonkwo",
    guestEmail: "sarah.o@email.com",
    guestPhone: "+234 802 345 6789",
    roomName: "Standard Room",
    roomId: 4,
    checkIn: "2025-12-04",
    checkOut: "2025-12-05",
    totalPrice: 25000,
    status: "pending",
    paymentStatus: "pending",
    createdAt: "2025-12-01",
  },
  {
    id: 3,
    guestName: "Michael Eze",
    guestEmail: "meze@email.com",
    guestPhone: "+234 803 456 7890",
    roomName: "Executive Suite",
    roomId: 2,
    checkIn: "2025-12-02",
    checkOut: "2025-12-05",
    totalPrice: 105000,
    status: "checked_in",
    paymentStatus: "paid",
    createdAt: "2025-11-25",
  },
  {
    id: 4,
    guestName: "Amina Bello",
    guestEmail: "amina.b@email.com",
    guestPhone: "+234 804 567 8901",
    roomName: "Family Suite",
    roomId: 3,
    checkIn: "2025-11-30",
    checkOut: "2025-12-02",
    totalPrice: 130000,
    status: "checked_out",
    paymentStatus: "paid",
    createdAt: "2025-11-20",
  },
  {
    id: 5,
    guestName: "Chidi Obi",
    guestEmail: "chidi.obi@email.com",
    guestPhone: "+234 805 678 9012",
    roomName: "Presidential Suite",
    roomId: 5,
    checkIn: "2025-12-10",
    checkOut: "2025-12-15",
    totalPrice: 750000,
    status: "confirmed",
    paymentStatus: "paid",
    createdAt: "2025-12-01",
  },
  {
    id: 6,
    guestName: "Grace Nnamdi",
    guestEmail: "grace.n@email.com",
    guestPhone: "+234 806 789 0123",
    roomName: "Deluxe Suite",
    roomId: 1,
    checkIn: "2025-12-08",
    checkOut: "2025-12-10",
    totalPrice: 90000,
    status: "pending",
    paymentStatus: "pending",
    createdAt: "2025-12-02",
  },
  {
    id: 7,
    guestName: "Peter Okafor",
    guestEmail: "peter.o@email.com",
    guestPhone: "+234 807 890 1234",
    roomName: "Standard Room",
    roomId: 4,
    checkIn: "2025-11-28",
    checkOut: "2025-11-30",
    totalPrice: 50000,
    status: "cancelled",
    paymentStatus: "refunded",
    createdAt: "2025-11-15",
  },
];

export default function BookingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const filteredBookings = mockBookings.filter((booking) => {
    const matchesSearch =
      booking.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.guestEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.roomName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;
    const matchesPayment =
      paymentFilter === "all" || booking.paymentStatus === paymentFilter;
    return matchesSearch && matchesStatus && matchesPayment;
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

  const paymentStyles = {
    pending: "bg-orange-100 text-orange-800",
    paid: "bg-green-100 text-green-800",
    refunded: "bg-purple-100 text-purple-800",
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
        <Button variant="outline" className="w-full sm:w-auto">
          <Download className="size-4" />
          Export
        </Button>
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
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
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
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="border-input bg-background focus:border-ring focus:ring-ring/50 h-10 rounded-md border px-3 text-sm focus:ring-2 focus:outline-none"
          >
            <option value="all">All Payments</option>
            <option value="pending">Payment Pending</option>
            <option value="paid">Paid</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <div className="border-border bg-card rounded-lg border p-4">
          <p className="text-muted-foreground text-sm">Total Bookings</p>
          <p className="text-foreground mt-1 text-2xl font-bold">
            {mockBookings.length}
          </p>
        </div>
        <div className="border-border bg-card rounded-lg border p-4">
          <p className="text-muted-foreground text-sm">Pending</p>
          <p className="mt-1 text-2xl font-bold text-yellow-600">
            {mockBookings.filter((b) => b.status === "pending").length}
          </p>
        </div>
        <div className="border-border bg-card rounded-lg border p-4">
          <p className="text-muted-foreground text-sm">Confirmed</p>
          <p className="mt-1 text-2xl font-bold text-blue-600">
            {mockBookings.filter((b) => b.status === "confirmed").length}
          </p>
        </div>
        <div className="border-border bg-card rounded-lg border p-4">
          <p className="text-muted-foreground text-sm">Checked In</p>
          <p className="mt-1 text-2xl font-bold text-green-600">
            {mockBookings.filter((b) => b.status === "checked_in").length}
          </p>
        </div>
        <div className="border-border bg-card col-span-2 rounded-lg border p-4 sm:col-span-1">
          <p className="text-muted-foreground text-sm">Total Revenue</p>
          <p className="text-foreground mt-1 text-2xl font-bold">
            {formatPrice(
              mockBookings
                .filter((b) => b.paymentStatus === "paid")
                .reduce((sum, b) => sum + b.totalPrice, 0),
            )}
          </p>
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="border-border bg-card flex flex-col items-center justify-center rounded-xl border py-16">
          <CalendarCheck className="text-muted-foreground size-12" />
          <p className="text-foreground mt-4 text-lg font-medium">
            No bookings found
          </p>
          <p className="text-muted-foreground mt-1">
            {searchQuery || statusFilter !== "all" || paymentFilter !== "all"
              ? "Try adjusting your search or filters"
              : "No bookings have been made yet"}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="border-border bg-card hidden overflow-hidden rounded-xl border lg:block">
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
                  <th className="text-muted-foreground px-4 py-4 text-left text-sm font-medium">
                    Payment
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
                          {booking.guestName}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {booking.guestEmail}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-foreground">{booking.roomName}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-foreground">
                        {formatDate(booking.checkIn)}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-foreground">
                        {formatDate(booking.checkOut)}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-foreground font-medium">
                        {formatPrice(booking.totalPrice)}
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
                      <span
                        className={cn(
                          "inline-block rounded-full px-2.5 py-1 text-xs font-medium capitalize",
                          paymentStyles[booking.paymentStatus],
                        )}
                      >
                        {booking.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="relative flex justify-end">
                        <button
                          onClick={() =>
                            setOpenDropdown(
                              openDropdown === booking.id ? null : booking.id,
                            )
                          }
                          className="hover:bg-accent rounded-lg p-2"
                        >
                          <MoreHorizontal className="text-muted-foreground size-5" />
                        </button>
                        {openDropdown === booking.id && (
                          <div className="border-border bg-card absolute top-full right-0 z-10 mt-1 w-44 overflow-hidden rounded-lg border shadow-lg">
                            <button
                              onClick={() => {
                                setSelectedBooking(booking);
                                setOpenDropdown(null);
                              }}
                              className="text-foreground hover:bg-accent flex w-full items-center gap-2 px-4 py-2.5 text-sm"
                            >
                              <Eye className="size-4" />
                              View Details
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                      {booking.guestName}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {booking.guestEmail}
                    </p>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() =>
                        setOpenDropdown(
                          openDropdown === booking.id ? null : booking.id,
                        )
                      }
                      className="hover:bg-accent rounded-lg p-2"
                    >
                      <MoreHorizontal className="text-muted-foreground size-5" />
                    </button>
                    {openDropdown === booking.id && (
                      <div className="border-border bg-card absolute top-full right-0 z-10 mt-1 w-44 overflow-hidden rounded-lg border shadow-lg">
                        <button
                          onClick={() => {
                            setSelectedBooking(booking);
                            setOpenDropdown(null);
                          }}
                          className="text-foreground hover:bg-accent flex w-full items-center gap-2 px-4 py-2.5 text-sm"
                        >
                          <Eye className="size-4" />
                          View Details
                        </button>
                        {booking.status === "pending" && (
                          <button className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-green-600 hover:bg-green-50">
                            <CheckCircle className="size-4" />
                            Confirm
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
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-medium capitalize",
                      paymentStyles[booking.paymentStatus],
                    )}
                  >
                    {booking.paymentStatus}
                  </span>
                </div>

                <div className="border-border mt-4 grid grid-cols-2 gap-4 border-t pt-4">
                  <div>
                    <p className="text-muted-foreground text-sm">Room</p>
                    <p className="text-foreground font-medium">
                      {booking.roomName}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Total</p>
                    <p className="text-foreground font-medium">
                      {formatPrice(booking.totalPrice)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Check In</p>
                    <p className="text-foreground font-medium">
                      {formatDate(booking.checkIn)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Check Out</p>
                    <p className="text-foreground font-medium">
                      {formatDate(booking.checkOut)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
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
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-sm font-medium capitalize",
                    paymentStyles[selectedBooking.paymentStatus],
                  )}
                >
                  {selectedBooking.paymentStatus}
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
                      {selectedBooking.guestName}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="text-muted-foreground size-4" />
                    <span className="text-foreground">
                      {selectedBooking.guestEmail}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="text-muted-foreground size-4" />
                    <span className="text-foreground">
                      {selectedBooking.guestPhone}
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
                      {selectedBooking.roomName}
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
                      {formatDate(selectedBooking.checkIn)}
                    </p>
                  </div>
                  <div className="bg-accent/50 rounded-lg p-4">
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                      <Calendar className="size-4" />
                      Check Out
                    </div>
                    <p className="text-foreground mt-1 font-medium">
                      {formatDate(selectedBooking.checkOut)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="border-border bg-primary/5 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Amount</span>
                  <span className="text-primary text-2xl font-bold">
                    {formatPrice(selectedBooking.totalPrice)}
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
                Booked on {formatDate(selectedBooking.createdAt)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Close dropdown when clicking outside */}
      {openDropdown !== null && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setOpenDropdown(null)}
        />
      )}
    </div>
  );
}
