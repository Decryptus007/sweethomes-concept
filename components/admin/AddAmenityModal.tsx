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

interface AddAmenityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (amenity: { name: string; icon: string; description: string }) => void;
}

const amenityIcons = [
  { value: "wifi", label: "WiFi", icon: "📶" },
  { value: "tv", label: "TV", icon: "📺" },
  { value: "parking", label: "Parking", icon: "🚗" },
  { value: "restaurant", label: "Restaurant", icon: "🍽️" },
  { value: "gym", label: "Gym", icon: "💪" },
  { value: "spa", label: "Spa", icon: "🧖" },
  { value: "ac", label: "Air Conditioning", icon: "❄️" },
  { value: "coffee", label: "Coffee", icon: "☕" },
  { value: "pool", label: "Pool", icon: "🏊" },
  { value: "bar", label: "Bar", icon: "🍸" },
  { value: "laundry", label: "Laundry", icon: "👔" },
  { value: "room-service", label: "Room Service", icon: "🛎️" },
  { value: "concierge", label: "Concierge", icon: "👨‍💼" },
  { value: "pets", label: "Pet Friendly", icon: "🐕" },
  { value: "smoking", label: "Smoking Area", icon: "🚬" },
];

export function AddAmenityModal({
  isOpen,
  onClose,
  onAdd,
}: AddAmenityModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    icon: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const amenityData = {
        name: formData.name,
        icon: formData.icon,
        description: formData.description,
      };

      onAdd(amenityData);

      // Reset form
      setFormData({
        name: "",
        icon: "",
        description: "",
      });
      onClose();
    } catch (error) {
      console.error("Error adding amenity:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="flex-col">
          <DialogTitle>Add New Amenity</DialogTitle>
          <DialogDescription>
            Add a new amenity that can be associated with rooms.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="text-foreground block text-sm font-medium"
            >
              Amenity Name *
            </label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="e.g., Free WiFi"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="icon"
              className="text-foreground block text-sm font-medium"
            >
              Icon *
            </label>
            <Select
              value={formData.icon}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, icon: value }))
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an icon" />
              </SelectTrigger>
              <SelectContent>
                {amenityIcons.map((icon) => (
                  <SelectItem key={icon.value} value={icon.value}>
                    <div className="flex items-center gap-2">
                      <span>{icon.icon}</span>
                      <span>{icon.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              placeholder="Describe what this amenity offers..."
              rows={3}
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Amenity"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
