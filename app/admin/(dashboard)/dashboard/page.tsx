"use client";

import {
  BedDouble,
  CalendarCheck,
  DollarSign,
  TrendingUp,
  Users,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  change?: number;
  changeLabel?: string;
  trend?: "up" | "down";
}

function StatCard({
  title,
  value,
  icon: Icon,
  change,
  changeLabel,
  trend,
}: StatCardProps) {
  return (
    <div className="border-border bg-card rounded-xl border p-6 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-muted-foreground text-sm font-medium">{title}</p>
          <p className="text-foreground mt-2 text-3xl font-bold">{value}</p>
          {change !== undefined && (
            <div className="mt-2 flex items-center gap-1">
              {trend === "up" ? (
                <ArrowUpRight className="size-4 text-green-600" />
              ) : (
                <ArrowDownRight className="size-4 text-red-500" />
              )}
              <span
                className={cn(
                  "text-sm font-medium",
                  trend === "up" ? "text-green-600" : "text-red-500",
                )}
              >
                {change}%
              </span>
              {changeLabel && (
                <span className="text-muted-foreground text-sm">
                  {changeLabel}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
          <Icon className="text-primary size-6" />
        </div>
      </div>
    </div>
  );
}

interface RecentBookingProps {
  guestName: string;
  roomName: string;
  checkIn: string;
  status: "pending" | "confirmed" | "checked_in" | "checked_out" | "cancelled";
}

function RecentBookingRow({
  guestName,
  roomName,
  checkIn,
  status,
}: RecentBookingProps) {
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

  return (
    <div className="border-border flex items-center justify-between border-b py-4 last:border-0">
      <div className="flex items-center gap-3">
        <div className="bg-accent flex size-10 items-center justify-center rounded-full text-sm font-medium">
          {guestName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)}
        </div>
        <div>
          <p className="text-foreground font-medium">{guestName}</p>
          <p className="text-muted-foreground text-sm">{roomName}</p>
        </div>
      </div>
      <div className="text-right">
        <span
          className={cn(
            "inline-block rounded-full px-2.5 py-0.5 text-xs font-medium",
            statusStyles[status],
          )}
        >
          {statusLabels[status]}
        </span>
        <p className="text-muted-foreground mt-1 text-sm">{checkIn}</p>
      </div>
    </div>
  );
}

interface RoomStatusProps {
  name: string;
  status: "available" | "occupied" | "maintenance";
  guest?: string;
}

function RoomStatusCard({ name, status, guest }: RoomStatusProps) {
  const statusStyles = {
    available: "border-green-200 bg-green-50",
    occupied: "border-blue-200 bg-blue-50",
    maintenance: "border-orange-200 bg-orange-50",
  };

  const statusDot = {
    available: "bg-green-500",
    occupied: "bg-blue-500",
    maintenance: "bg-orange-500",
  };

  return (
    <div
      className={cn(
        "rounded-lg border-2 p-4 transition-shadow hover:shadow-sm",
        statusStyles[status],
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-foreground font-medium">{name}</p>
        <span
          className={cn("size-2.5 rounded-full", statusDot[status])}
          title={status}
        />
      </div>
      <p className="text-muted-foreground mt-1 text-sm capitalize">
        {status === "occupied" && guest ? guest : status}
      </p>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAdminAuth();

  // Mock data - replace with actual API calls
  const stats = {
    totalRooms: 24,
    totalBookings: 156,
    totalRevenue: "₦2,450,000",
    occupancyRate: 78,
    pendingBookings: 8,
    activeGuests: 18,
  };

  const recentBookings: RecentBookingProps[] = [
    {
      guestName: "John Adebayo",
      roomName: "Deluxe Suite",
      checkIn: "Dec 3, 2025",
      status: "confirmed",
    },
    {
      guestName: "Sarah Okonkwo",
      roomName: "Standard Room",
      checkIn: "Dec 4, 2025",
      status: "pending",
    },
    {
      guestName: "Michael Eze",
      roomName: "Executive Suite",
      checkIn: "Dec 2, 2025",
      status: "checked_in",
    },
    {
      guestName: "Amina Bello",
      roomName: "Family Room",
      checkIn: "Dec 1, 2025",
      status: "checked_out",
    },
  ];

  const roomStatuses: RoomStatusProps[] = [
    { name: "Room 101", status: "available" },
    { name: "Room 102", status: "occupied", guest: "Michael Eze" },
    { name: "Room 103", status: "occupied", guest: "Grace Nnamdi" },
    { name: "Room 104", status: "maintenance" },
    { name: "Room 105", status: "available" },
    { name: "Room 106", status: "occupied", guest: "Chidi Obi" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-foreground font-[family-name:var(--font-gilda)] text-3xl">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, {user?.name?.split(" ")[0] || "Admin"}! Here&apos;s
          what&apos;s happening at SweetHomes.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          title="Total Rooms"
          value={stats.totalRooms}
          icon={BedDouble}
        />
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings}
          icon={CalendarCheck}
          change={12}
          changeLabel="vs last month"
          trend="up"
        />
        <StatCard
          title="Revenue"
          value={stats.totalRevenue}
          icon={DollarSign}
          change={8}
          changeLabel="vs last month"
          trend="up"
        />
        <StatCard
          title="Occupancy Rate"
          value={`${stats.occupancyRate}%`}
          icon={TrendingUp}
          change={5}
          changeLabel="vs last month"
          trend="up"
        />
        <StatCard
          title="Pending Bookings"
          value={stats.pendingBookings}
          icon={Clock}
        />
        <StatCard
          title="Active Guests"
          value={stats.activeGuests}
          icon={Users}
        />
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Bookings */}
        <div className="border-border bg-card rounded-xl border p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-foreground font-[family-name:var(--font-gilda)] text-xl">
              Recent Bookings
            </h2>
            <a
              href="/admin/bookings"
              className="text-primary text-sm font-medium hover:underline"
            >
              View All
            </a>
          </div>
          <div>
            {recentBookings.map((booking, index) => (
              <RecentBookingRow key={index} {...booking} />
            ))}
          </div>
        </div>

        {/* Room Status Overview */}
        <div className="border-border bg-card rounded-xl border p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-foreground font-[family-name:var(--font-gilda)] text-xl">
              Room Status
            </h2>
            <a
              href="/admin/rooms"
              className="text-primary text-sm font-medium hover:underline"
            >
              View All
            </a>
          </div>
          <div className="mb-4 flex gap-4">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-green-500" />
              <span className="text-muted-foreground text-sm">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-blue-500" />
              <span className="text-muted-foreground text-sm">Occupied</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-orange-500" />
              <span className="text-muted-foreground text-sm">Maintenance</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {roomStatuses.map((room, index) => (
              <RoomStatusCard key={index} {...room} />
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="border-border bg-card rounded-xl border p-6">
        <h2 className="text-foreground mb-4 font-[family-name:var(--font-gilda)] text-xl">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <a
            href="/admin/bookings"
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
          >
            <CalendarCheck className="size-4" />
            New Booking
          </a>
          <a
            href="/admin/rooms"
            className="border-border bg-background text-foreground hover:bg-accent inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors"
          >
            <BedDouble className="size-4" />
            Manage Rooms
          </a>
          <a
            href="/admin/bookings"
            className="border-border bg-background text-foreground hover:bg-accent inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors"
          >
            <Clock className="size-4" />
            Pending Approvals ({stats.pendingBookings})
          </a>
        </div>
      </div>
    </div>
  );
}
