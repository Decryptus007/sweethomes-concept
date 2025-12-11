"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select as ShadcnSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getAmenities, getFacilities } from "@/lib/api";
import { ROOM_TYPE_OPTIONS, RoomType } from "@/lib/roomTypes";
import { CustomMultiSelect } from "@/components/ui/CustomMultiSelect";
import toast from "react-hot-toast";

interface Amenity {
  id: number;
  name: string;
}

interface Facility {
  id: number;
  name: string;
}

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

interface EditRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (room: {
    name: string;
    room_number: string;
    type: RoomType;
    price_per_night: number;
    capacity: number;
    description: string;
    status: "available" | "occupied" | "maintenance";
    amenities: number[];
    facilities: number[];
  }) => void;
  room: Room | null;
}

export function EditRoomModal({
  isOpen,
  onClose,
  onEdit,
  room,
}: EditRoomModalProps) {
  const [formData, setFormData] = useState<{
    name: string;
    room_number: string;
    type: RoomType;
    price_per_night: string;
    capacity: string;
    description: string;
    status: "available" | "occupied" | "maintenance";
    amenities: { value: number; label: string }[];
    facilities: { value: number; label: string }[];
  }>({
    name: "",
    room_number: "",
    type: RoomType.STANDARD,
    price_per_night: "",
    capacity: "",
    description: "",
    status: "available",
    amenities: [],
    facilities: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && room) {
      fetchAmenitiesAndFacilities();
      const newFormData = {
        name: room.name,
        room_number: room.room_number,
        type: room.type,
        price_per_night: room.price_per_night.toString(),
        capacity: room.capacity.toString(),
        description: room.description,
        status: room.status,
        amenities: room.amenities.map((a) => ({
          value: a.id,
          label: a.name,
        })),
        facilities: room.facilities.map((f) => ({
          value: f.id,
          label: f.name,
        })),
      };
      setFormData(newFormData);
    } else if (!isOpen) {
      // Reset form when modal closes
      setFormData({
        name: "",
        room_number: "",
        type: RoomType.STANDARD,
        price_per_night: "",
        capacity: "",
        description: "",
        status: "available",
        amenities: [],
        facilities: [],
      });
    }
  }, [isOpen, room]);

  const fetchAmenitiesAndFacilities = async () => {
    setLoading(true);
    try {
      const [amenitiesRes, facilitiesRes] = await Promise.all([
        getAmenities(),
        getFacilities(),
      ]);
      setAmenities(amenitiesRes.data);
      setFacilities(facilitiesRes.data);
    } catch (error) {
      console.error("Error fetching amenities and facilities:", error);
      toast.error("Failed to load amenities and facilities");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const roomData = {
        name: formData.name,
        room_number: formData.room_number,
        type: formData.type,
        price_per_night: parseFloat(formData.price_per_night),
        capacity: parseInt(formData.capacity),
        description: formData.description,
        status: formData.status,
        amenities: formData.amenities.map((a) => a.value),
        facilities: formData.facilities.map((f) => f.value),
      };

      onEdit(roomData);

      // Reset form
      setFormData({
        name: "",
        room_number: "",
        type: RoomType.STANDARD,
        price_per_night: "",
        capacity: "",
        description: "",
        status: "available",
        amenities: [],
        facilities: [],
      });
    } catch (error) {
      console.error("Error updating room:", error);
      toast.error("Failed to update room");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader className="flex-col">
          <DialogTitle>Edit Room</DialogTitle>
          <DialogDescription className="text-center">
            Update the room details below.
            <br />
            Make changes and save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-foreground block text-sm font-medium"
              >
                Room Name *
              </label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="e.g., Deluxe Suite"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="room_number"
                className="text-foreground block text-sm font-medium"
              >
                Room Number *
              </label>
              <Input
                id="room_number"
                value={formData.room_number}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    room_number: e.target.value,
                  }))
                }
                placeholder="e.g., 102"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-foreground block text-sm font-medium">
                Room Type *
              </label>
              <ShadcnSelect
                value={formData.type}
                onValueChange={(value: RoomType) =>
                  setFormData((prev) => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select room type" />
                </SelectTrigger>
                <SelectContent>
                  {ROOM_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </ShadcnSelect>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="status"
                className="text-foreground block text-sm font-medium"
              >
                Status
              </label>
              <ShadcnSelect
                key={`status-${room?.id || "new"}`}
                value={formData.status}
                onValueChange={(
                  value: "available" | "occupied" | "maintenance",
                ) => {
                  if (value) {
                    setFormData((prev) => ({ ...prev, status: value }));
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </ShadcnSelect>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="price_per_night"
                className="text-foreground block text-sm font-medium"
              >
                Price per Night (₦) *
              </label>
              <Input
                id="price_per_night"
                type="number"
                value={formData.price_per_night}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    price_per_night: e.target.value,
                  }))
                }
                placeholder="199.99"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="capacity"
                className="text-foreground block text-sm font-medium"
              >
                Capacity *
              </label>
              <Input
                id="capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, capacity: e.target.value }))
                }
                placeholder="2"
                min="1"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="description"
              className="text-foreground block text-sm font-medium"
            >
              Description *
            </label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Describe the room features and amenities..."
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <CustomMultiSelect
              label="Amenities"
              options={amenities.map((amenity) => ({
                value: amenity.id,
                label: amenity.name,
              }))}
              value={formData.amenities}
              onChange={(selected) =>
                setFormData((prev) => ({
                  ...prev,
                  amenities: selected,
                }))
              }
              placeholder="Select amenities..."
              isLoading={loading}
            />

            <CustomMultiSelect
              label="Facilities"
              options={facilities.map((facility) => ({
                value: facility.id,
                label: facility.name,
              }))}
              value={formData.facilities}
              onChange={(selected) =>
                setFormData((prev) => ({
                  ...prev,
                  facilities: selected,
                }))
              }
              placeholder="Select facilities..."
              isLoading={loading}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Room"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
