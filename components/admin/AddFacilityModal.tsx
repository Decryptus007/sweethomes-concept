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

interface AddFacilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (facility: {
    name: string;
    icon: string;
    description: string;
    image: string;
  }) => void;
}

const facilityIcons = [
  { value: "parking", label: "Parking", icon: "🚗" },
  { value: "restaurant", label: "Restaurant", icon: "🍽️" },
  { value: "pool", label: "Swimming Pool", icon: "🏊" },
  { value: "gym", label: "Gym", icon: "💪" },
  { value: "conference", label: "Conference Room", icon: "👥" },
  { value: "bar", label: "Bar", icon: "🍸" },
  { value: "business", label: "Business Center", icon: "💼" },
  { value: "garden", label: "Garden", icon: "🌳" },
  { value: "spa", label: "Spa", icon: "🧖" },
  { value: "laundry", label: "Laundry", icon: "👔" },
  { value: "lounge", label: "Lounge", icon: "🛋️" },
  { value: "playground", label: "Playground", icon: "🎪" },
  { value: "tennis", label: "Tennis Court", icon: "🎾" },
  { value: "basketball", label: "Basketball Court", icon: "🏀" },
  { value: "library", label: "Library", icon: "📚" },
];

export function AddFacilityModal({
  isOpen,
  onClose,
  onAdd,
}: AddFacilityModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    icon: "",
    description: "",
    image: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const facilityData = {
        name: formData.name,
        icon: formData.icon,
        description: formData.description,
        image: formData.image,
      };

      onAdd(facilityData);

      // Reset form
      setFormData({
        name: "",
        icon: "",
        description: "",
        image: "",
      });
      onClose();
    } catch (error) {
      console.error("Error adding facility:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="flex-col">
          <DialogTitle>Add New Facility</DialogTitle>
          <DialogDescription>
            Add a new facility available at your hotel.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="text-foreground block text-sm font-medium"
            >
              Facility Name *
            </label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="e.g., Swimming Pool"
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
                {facilityIcons.map((icon) => (
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
              placeholder="Describe the facility and its features..."
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="image"
              className="text-foreground block text-sm font-medium"
            >
              Image URL
            </label>
            <Input
              id="image"
              type="url"
              value={formData.image}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, image: e.target.value }))
              }
              placeholder="https://example.com/facility-image.jpg"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Facility"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
