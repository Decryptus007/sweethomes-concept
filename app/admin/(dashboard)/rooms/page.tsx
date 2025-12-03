"use client";

import { useState } from "react";
import {
  BedDouble,
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddRoomModal } from "@/components/admin/AddRoomModal";

interface Room {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  capacity: number;
  status: "available" | "occupied" | "maintenance";
  images: string[];
  amenities: string[];
}

// Mock data - replace with API call
const mockRooms: Room[] = [
  {
    id: 1,
    name: "Deluxe Suite",
    slug: "deluxe-suite",
    description: "Luxurious suite with ocean view and premium amenities",
    price: 45000,
    capacity: 2,
    status: "available",
    images: ["/assets/images/rooms/room-1.jpg"],
    amenities: ["WiFi", "TV", "Mini Bar", "AC"],
  },
  {
    id: 2,
    name: "Executive Room",
    slug: "executive-room",
    description: "Spacious room perfect for business travelers",
    price: 35000,
    capacity: 2,
    status: "occupied",
    images: ["/assets/images/rooms/room-2.jpg"],
    amenities: ["WiFi", "TV", "Work Desk", "AC"],
  },
  {
    id: 3,
    name: "Family Suite",
    slug: "family-suite",
    description: "Large suite ideal for families with children",
    price: 65000,
    capacity: 4,
    status: "available",
    images: ["/assets/images/rooms/room-3.jpg"],
    amenities: ["WiFi", "TV", "Mini Kitchen", "AC", "Balcony"],
  },
  {
    id: 4,
    name: "Standard Room",
    slug: "standard-room",
    description: "Comfortable room with essential amenities",
    price: 25000,
    capacity: 2,
    status: "maintenance",
    images: ["/assets/images/rooms/room-4.jpg"],
    amenities: ["WiFi", "TV", "AC"],
  },
  {
    id: 5,
    name: "Presidential Suite",
    slug: "presidential-suite",
    description: "The ultimate luxury experience with premium services",
    price: 150000,
    capacity: 4,
    status: "occupied",
    images: ["/assets/images/rooms/room-5.jpg"],
    amenities: ["WiFi", "TV", "Mini Bar", "AC", "Jacuzzi", "Living Room"],
  },
];

export default function RoomsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [rooms, setRooms] = useState(mockRooms);

  const handleAddRoom = (roomData: {
    name: string;
    slug: string;
    description: string;
    price: number;
    capacity: number;
    status: "available" | "occupied" | "maintenance";
    images: string[];
    amenities: string[];
  }) => {
    const newRoom: Room = {
      ...roomData,
      id: Math.max(...rooms.map((r) => r.id)) + 1,
    };
    setRooms((prev) => [...prev, newRoom]);
  };

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || room.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusStyles = {
    available: "bg-green-100 text-green-800",
    occupied: "bg-blue-100 text-blue-800",
    maintenance: "bg-orange-100 text-orange-800",
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-foreground font-[family-name:var(--font-gilda)] text-3xl">
            Rooms
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your hotel rooms and their availability
          </p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="w-full sm:w-auto"
        >
          <Plus className="size-4" />
          Add New Room
        </Button>
      </div>

      {/* Filters */}
      <div className="border-border bg-card flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            placeholder="Search rooms..."
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
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="border-border bg-card rounded-lg border p-4">
          <p className="text-muted-foreground text-sm">Total Rooms</p>
          <p className="text-foreground mt-1 text-2xl font-bold">
            {mockRooms.length}
          </p>
        </div>
        <div className="border-border bg-card rounded-lg border p-4">
          <p className="text-muted-foreground text-sm">Available</p>
          <p className="mt-1 text-2xl font-bold text-green-600">
            {mockRooms.filter((r) => r.status === "available").length}
          </p>
        </div>
        <div className="border-border bg-card rounded-lg border p-4">
          <p className="text-muted-foreground text-sm">Occupied</p>
          <p className="mt-1 text-2xl font-bold text-blue-600">
            {mockRooms.filter((r) => r.status === "occupied").length}
          </p>
        </div>
        <div className="border-border bg-card rounded-lg border p-4">
          <p className="text-muted-foreground text-sm">Maintenance</p>
          <p className="mt-1 text-2xl font-bold text-orange-600">
            {mockRooms.filter((r) => r.status === "maintenance").length}
          </p>
        </div>
      </div>

      {/* Rooms Grid/Table */}
      {filteredRooms.length === 0 ? (
        <div className="border-border bg-card flex flex-col items-center justify-center rounded-xl border py-16">
          <BedDouble className="text-muted-foreground size-12" />
          <p className="text-foreground mt-4 text-lg font-medium">
            No rooms found
          </p>
          <p className="text-muted-foreground mt-1">
            {searchQuery || statusFilter !== "all"
              ? "Try adjusting your search or filter"
              : "Add your first room to get started"}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="border-border bg-card hidden overflow-hidden rounded-xl border lg:block">
            <table className="w-full">
              <thead className="border-border bg-accent/50 border-b">
                <tr>
                  <th className="text-muted-foreground px-6 py-4 text-left text-sm font-medium">
                    Room
                  </th>
                  <th className="text-muted-foreground px-6 py-4 text-left text-sm font-medium">
                    Price/Night
                  </th>
                  <th className="text-muted-foreground px-6 py-4 text-left text-sm font-medium">
                    Capacity
                  </th>
                  <th className="text-muted-foreground px-6 py-4 text-left text-sm font-medium">
                    Status
                  </th>
                  <th className="text-muted-foreground px-6 py-4 text-left text-sm font-medium">
                    Amenities
                  </th>
                  <th className="text-muted-foreground px-6 py-4 text-right text-sm font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-border divide-y">
                {filteredRooms.map((room) => (
                  <tr key={room.id} className="hover:bg-accent/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-accent size-12 overflow-hidden rounded-lg">
                          <div className="flex size-full items-center justify-center">
                            <BedDouble className="text-muted-foreground size-6" />
                          </div>
                        </div>
                        <div>
                          <p className="text-foreground font-medium">
                            {room.name}
                          </p>
                          <p className="text-muted-foreground max-w-xs truncate text-sm">
                            {room.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-foreground font-medium">
                        {formatPrice(room.price)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-foreground">{room.capacity} guests</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "inline-block rounded-full px-2.5 py-1 text-xs font-medium capitalize",
                          statusStyles[room.status],
                        )}
                      >
                        {room.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {room.amenities.slice(0, 3).map((amenity) => (
                          <span
                            key={amenity}
                            className="bg-accent text-muted-foreground rounded px-2 py-0.5 text-xs"
                          >
                            {amenity}
                          </span>
                        ))}
                        {room.amenities.length > 3 && (
                          <span className="bg-accent text-muted-foreground rounded px-2 py-0.5 text-xs">
                            +{room.amenities.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative flex justify-end">
                        <button
                          onClick={() =>
                            setOpenDropdown(
                              openDropdown === room.id ? null : room.id,
                            )
                          }
                          className="hover:bg-accent rounded-lg p-2"
                        >
                          <MoreHorizontal className="text-muted-foreground size-5" />
                        </button>
                        {openDropdown === room.id && (
                          <div className="border-border bg-card absolute top-full right-0 z-10 mt-1 w-40 overflow-hidden rounded-lg border shadow-lg">
                            <button className="text-foreground hover:bg-accent flex w-full items-center gap-2 px-4 py-2.5 text-sm">
                              <Eye className="size-4" />
                              View
                            </button>
                            <button className="text-foreground hover:bg-accent flex w-full items-center gap-2 px-4 py-2.5 text-sm">
                              <Edit className="size-4" />
                              Edit
                            </button>
                            <button className="text-destructive hover:bg-destructive/10 flex w-full items-center gap-2 px-4 py-2.5 text-sm">
                              <Trash2 className="size-4" />
                              Delete
                            </button>
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
            {filteredRooms.map((room) => (
              <div
                key={room.id}
                className="border-border bg-card rounded-xl border p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-accent flex size-12 items-center justify-center rounded-lg">
                      <BedDouble className="text-muted-foreground size-6" />
                    </div>
                    <div>
                      <p className="text-foreground font-medium">{room.name}</p>
                      <span
                        className={cn(
                          "mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                          statusStyles[room.status],
                        )}
                      >
                        {room.status}
                      </span>
                    </div>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() =>
                        setOpenDropdown(
                          openDropdown === room.id ? null : room.id,
                        )
                      }
                      className="hover:bg-accent rounded-lg p-2"
                    >
                      <MoreHorizontal className="text-muted-foreground size-5" />
                    </button>
                    {openDropdown === room.id && (
                      <div className="border-border bg-card absolute top-full right-0 z-10 mt-1 w-40 overflow-hidden rounded-lg border shadow-lg">
                        <button className="text-foreground hover:bg-accent flex w-full items-center gap-2 px-4 py-2.5 text-sm">
                          <Eye className="size-4" />
                          View
                        </button>
                        <button className="text-foreground hover:bg-accent flex w-full items-center gap-2 px-4 py-2.5 text-sm">
                          <Edit className="size-4" />
                          Edit
                        </button>
                        <button className="text-destructive hover:bg-destructive/10 flex w-full items-center gap-2 px-4 py-2.5 text-sm">
                          <Trash2 className="size-4" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-muted-foreground mt-3 line-clamp-2 text-sm">
                  {room.description}
                </p>
                <div className="border-border mt-4 flex items-center justify-between border-t pt-4">
                  <div>
                    <p className="text-muted-foreground text-sm">Price/Night</p>
                    <p className="text-foreground font-medium">
                      {formatPrice(room.price)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground text-sm">Capacity</p>
                    <p className="text-foreground font-medium">
                      {room.capacity} guests
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {room.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="bg-accent text-muted-foreground rounded px-2 py-0.5 text-xs"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Close dropdown when clicking outside */}
      {openDropdown !== null && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setOpenDropdown(null)}
        />
      )}

      <AddRoomModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddRoom}
      />
    </div>
  );
}
