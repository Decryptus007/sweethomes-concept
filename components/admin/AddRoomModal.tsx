"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
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

interface AddRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (room: {
    name: string;
    slug: string;
    description: string;
    price: number;
    capacity: number;
    status: "available" | "occupied" | "maintenance";
    images: string[];
    amenities: string[];
  }) => void;
}

export function AddRoomModal({ isOpen, onClose, onAdd }: AddRoomModalProps) {
  const [formData, setFormData] = useState<{
    name: string;
    slug: string;
    description: string;
    price: string;
    capacity: string;
    status: "available" | "occupied" | "maintenance";
    images: string[];
  }>({
    name: "",
    slug: "",
    description: "",
    price: "",
    capacity: "",
    status: "available",
    images: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Generate slug from name if not provided
      const slug =
        formData.slug || formData.name.toLowerCase().replace(/\s+/g, "-");

      const roomData = {
        name: formData.name,
        slug,
        description: formData.description,
        price: parseFloat(formData.price),
        capacity: parseInt(formData.capacity),
        status: formData.status,
        images: formData.images,
        amenities: [], // Will be added separately
      };

      onAdd(roomData);

      // Reset form
      setFormData({
        name: "",
        slug: "",
        description: "",
        price: "",
        capacity: "",
        status: "available",
        images: [],
      });
      onClose();
    } catch (error) {
      console.error("Error adding room:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNameChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      name: value,
      slug: prev.slug || value.toLowerCase().replace(/\s+/g, "-"),
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader className="flex-col">
          <DialogTitle>Add New Room</DialogTitle>
          <DialogDescription>
            Create a new room for your hotel. Fill in the details below.
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
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g., Deluxe Suite"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="slug"
                className="text-foreground block text-sm font-medium"
              >
                Slug
              </label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, slug: e.target.value }))
                }
                placeholder="deluxe-suite"
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <label
                htmlFor="price"
                className="text-foreground block text-sm font-medium"
              >
                Price per Night (₦) *
              </label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, price: e.target.value }))
                }
                placeholder="45000"
                min="0"
                step="1000"
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

            <div className="space-y-2">
              <label
                htmlFor="status"
                className="text-foreground block text-sm font-medium"
              >
                Status
              </label>
              <Select
                value={formData.status}
                onValueChange={(
                  value: "available" | "occupied" | "maintenance",
                ) => setFormData((prev) => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Room"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
