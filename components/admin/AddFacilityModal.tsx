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

interface AddFacilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (facility: { name: string }) => void;
  editingFacility?: { id: number; name: string } | null;
}

export function AddFacilityModal({
  isOpen,
  onClose,
  onAdd,
  editingFacility,
}: AddFacilityModalProps) {
  const [formData, setFormData] = useState({
    name: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data when modal opens or editing facility changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: editingFacility?.name || "",
      });
    }
  }, [isOpen, editingFacility]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const facilityData = {
        name: formData.name,
      };

      onAdd(facilityData);

      // Reset form
      setFormData({
        name: "",
      });
      onClose();
    } catch (error) {
      console.error("Error saving facility:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="flex-col">
          <DialogTitle>
            {editingFacility ? "Edit Facility" : "Add New Facility"}
          </DialogTitle>
          <DialogDescription>
            {editingFacility
              ? "Update the facility name."
              : "Add a new facility available at your hotel."}
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? editingFacility
                  ? "Updating..."
                  : "Adding..."
                : editingFacility
                  ? "Update Facility"
                  : "Add Facility"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
