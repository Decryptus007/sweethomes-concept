"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  onAdd: (amenity: { name: string }) => void;
  editingAmenity?: { id: number; name: string } | null;
}

export function AddAmenityModal({
  isOpen,
  onClose,
  onAdd,
  editingAmenity,
}: AddAmenityModalProps) {
  const [formData, setFormData] = useState({
    name: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data when modal opens or editing amenity changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: editingAmenity?.name || "",
      });
    }
  }, [isOpen, editingAmenity]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const amenityData = {
        name: formData.name,
      };

      onAdd(amenityData);

      // Reset form
      setFormData({
        name: "",
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
          <DialogTitle>
            {editingAmenity ? "Edit Amenity" : "Add New Amenity"}
          </DialogTitle>
          <DialogDescription>
            {editingAmenity
              ? "Update the amenity name."
              : "Add a new amenity that can be associated with rooms."}
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
              placeholder="e.g., Swimming Pool"
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? editingAmenity
                  ? "Updating..."
                  : "Adding..."
                : editingAmenity
                  ? "Update Amenity"
                  : "Add Amenity"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
