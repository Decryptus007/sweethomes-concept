"use client";

import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddRoomModal } from "@/components/admin/AddRoomModal";
import { EditRoomModal } from "@/components/admin/EditRoomModal";
import { ViewRoomModal } from "@/components/admin/ViewRoomModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { getRooms, addRoom, updateRoom, deleteRoom } from "@/lib/api";
import toast from "react-hot-toast";
import { RoomType } from "@/lib/roomTypes";

interface Room {
  id: number;
  name: string;
  room_number: string;
  type: RoomType;
  price_per_night: number;
  capacity: number;
  description: string;
  status: "available" | "occupied" | "maintenance";
  amenities: { id: number; name: string }[];
  facilities: { id: number; name: string }[];
  created_at: string;
  updated_at: string;
}

export default function RoomsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await getRooms();
      setRooms(response.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      toast.error("Failed to load rooms");
    } finally {
      setLoading(false);
    }
  };

  const handleAddRoom = async (roomData: {
    name: string;
    room_number: string;
    type: RoomType;
    price_per_night: number;
    capacity: number;
    description: string;
    status: "available" | "occupied" | "maintenance";
    amenities: number[];
    facilities: number[];
  }) => {
    try {
      await addRoom(roomData);
      toast.success("Room added successfully");
      fetchRooms(); // Refresh the list
    } catch (error) {
      console.error("Error adding room:", error);
      toast.error("Failed to add room");
      throw error; // Re-throw to let modal handle it
    }
  };

  const handleEditRoom = async (roomData: {
    name: string;
    room_number: string;
    type: RoomType;
    price_per_night: number;
    capacity: number;
    description: string;
    status: "available" | "occupied" | "maintenance";
    amenities: number[];
    facilities: number[];
  }) => {
    if (!selectedRoom) return;

    try {
      await updateRoom(selectedRoom.id, roomData);
      toast.success("Room updated successfully");
      fetchRooms(); // Refresh the list
      setIsEditModalOpen(false);
      setSelectedRoom(null);
    } catch (error) {
      console.error("Error updating room:", error);
      toast.error("Failed to update room");
      throw error; // Re-throw to let modal handle it
    }
  };

  const handleViewRoom = (room: Room) => {
    setSelectedRoom(room);
    setIsViewModalOpen(true);
    setOpenDropdown(null);
  };

  const handleEditClick = (room: Room) => {
    setSelectedRoom(room);
    setIsEditModalOpen(true);
    setOpenDropdown(null);
  };

  const handleDeleteClick = (room: Room) => {
    setSelectedRoom(room);
    setIsDeleteDialogOpen(true);
    setOpenDropdown(null);
  };

  const handleDeleteRoom = async () => {
    if (!selectedRoom) return;

    try {
      await deleteRoom(selectedRoom.id);
      toast.success("Room deleted successfully");
      fetchRooms(); // Refresh the list
      setIsDeleteDialogOpen(false);
      setSelectedRoom(null);
    } catch (error) {
      console.error("Error deleting room:", error);
      toast.error("Failed to delete room");
    }
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
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-10 w-[140px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="occupied">Occupied</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="border-border bg-card rounded-lg border p-4">
          <p className="text-muted-foreground text-sm">Total Rooms</p>
          <p className="text-foreground mt-1 text-2xl font-bold">
            {rooms.length}
          </p>
        </div>
        <div className="border-border bg-card rounded-lg border p-4">
          <p className="text-muted-foreground text-sm">Available</p>
          <p className="mt-1 text-2xl font-bold text-green-600">
            {rooms.filter((r) => r.status === "available").length}
          </p>
        </div>
        <div className="border-border bg-card rounded-lg border p-4">
          <p className="text-muted-foreground text-sm">Occupied</p>
          <p className="mt-1 text-2xl font-bold text-blue-600">
            {rooms.filter((r) => r.status === "occupied").length}
          </p>
        </div>
        <div className="border-border bg-card rounded-lg border p-4">
          <p className="text-muted-foreground text-sm">Maintenance</p>
          <p className="mt-1 text-2xl font-bold text-orange-600">
            {rooms.filter((r) => r.status === "maintenance").length}
          </p>
        </div>
      </div>

      {/* Rooms Grid/Table */}
      {loading ? (
        <div className="border-border bg-card flex flex-col items-center justify-center rounded-xl border py-16">
          <div className="border-muted-foreground size-8 animate-spin rounded-full border-2 border-t-transparent"></div>
          <p className="text-muted-foreground mt-4">Loading rooms...</p>
        </div>
      ) : filteredRooms.length === 0 ? (
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
          <div className="border-border bg-card hidden rounded-xl border lg:block">
            <table className="w-full">
              <thead className="border-border bg-accent/50 border-b">
                <tr>
                  <th className="text-muted-foreground px-6 py-4 text-left text-sm font-medium">
                    Room
                  </th>
                  <th className="text-muted-foreground px-6 py-4 text-left text-sm font-medium">
                    Type
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
                          <p className="text-muted-foreground text-sm">
                            Room {room.room_number}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-foreground">{room.type}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-foreground font-medium">
                        {formatPrice(room.price_per_night)}
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
                            key={amenity.id}
                            className="bg-accent text-muted-foreground rounded px-2 py-0.5 text-xs"
                          >
                            {amenity.name}
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
                          <div className="border-border bg-card absolute top-full right-0 z-50 mt-1 w-40 overflow-hidden rounded-lg border shadow-lg">
                            <button
                              onClick={() => handleViewRoom(room)}
                              className="text-foreground hover:bg-accent flex w-full items-center gap-2 px-4 py-2.5 text-sm"
                            >
                              <Eye className="size-4" />
                              View
                            </button>
                            <button
                              onClick={() => handleEditClick(room)}
                              className="text-foreground hover:bg-accent flex w-full items-center gap-2 px-4 py-2.5 text-sm"
                            >
                              <Edit className="size-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteClick(room)}
                              className="text-destructive hover:bg-destructive/10 flex w-full items-center gap-2 px-4 py-2.5 text-sm"
                            >
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
                      <p className="text-muted-foreground text-sm">
                        Room {room.room_number} • {room.type}
                      </p>
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
                      <div className="border-border bg-card absolute top-full right-0 z-50 mt-1 w-40 overflow-hidden rounded-lg border shadow-lg">
                        <button
                          onClick={() => handleViewRoom(room)}
                          className="text-foreground hover:bg-accent flex w-full items-center gap-2 px-4 py-2.5 text-sm"
                        >
                          <Eye className="size-4" />
                          View
                        </button>
                        <button
                          onClick={() => handleEditClick(room)}
                          className="text-foreground hover:bg-accent flex w-full items-center gap-2 px-4 py-2.5 text-sm"
                        >
                          <Edit className="size-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(room)}
                          className="text-destructive hover:bg-destructive/10 flex w-full items-center gap-2 px-4 py-2.5 text-sm"
                        >
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
                      {formatPrice(room.price_per_night)}
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
                      key={amenity.id}
                      className="bg-accent text-muted-foreground rounded px-2 py-0.5 text-xs"
                    >
                      {amenity.name}
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

      <EditRoomModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onEdit={handleEditRoom}
        room={selectedRoom}
      />

      <ViewRoomModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        room={selectedRoom}
      />

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Room"
        description={`Are you sure you want to delete "${selectedRoom?.name}" (Room ${selectedRoom?.room_number})? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteRoom}
        variant="destructive"
      />
    </div>
  );
}
