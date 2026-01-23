"use client";

import { useState, useEffect, useRef } from "react";
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
import { Upload, X, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";

interface Amenity {
  id: number;
  name: string;
}

interface Facility {
  id: number;
  name: string;
}

interface AddRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (room: {
    name: string;
    room_number: string;
    type: RoomType;
    price_per_night: number;
    capacity: number;
    description: string;
    status: "available" | "occupied" | "maintenance";
    amenities: number[];
    facilities: number[];
    images?: File[];
  }) => void;
}

export function AddRoomModal({ isOpen, onClose, onAdd }: AddRoomModalProps) {
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
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [fileInputKey, setFileInputKey] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      fetchAmenitiesAndFacilities();
    }
  }, [isOpen]);

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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));

    if (invalidFiles.length > 0) {
      toast.error('Please select only image files (JPEG, PNG, WebP)');
      return;
    }

    // Validate file sizes (max 5MB per file)
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.error('Please select images smaller than 5MB');
      return;
    }

    // Limit total number of images
    const totalImages = selectedImages.length + files.length;
    if (totalImages > 10) {
      toast.error('Maximum 10 images allowed');
      return;
    }

    // Add new files to existing selection
    const newImages = [...selectedImages, ...files];
    setSelectedImages(newImages);

    // Create previews for new files
    const newPreviews = [...imagePreviews];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews.push(e.target?.result as string);
        setImagePreviews([...newPreviews]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setSelectedImages(newImages);
    setImagePreviews(newPreviews);

    // Reset file input to allow re-selecting the same files
    setFileInputKey(prev => prev + 1);
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
        images: selectedImages,
      };

      await onAdd(roomData);

      // Reset form only after successful submission
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
      setSelectedImages([]);
      setImagePreviews([]);
      setFileInputKey(prev => prev + 1);
      onClose();
    } catch (error) {
      console.error("Error adding room:", error);
      // Don't close modal on error, let user retry
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!isSubmitting && !open) {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader className="flex-col">
          <DialogTitle>Add New Room</DialogTitle>
          <DialogDescription className="text-center">
            Create a new room for your hotel.
            <br />
            Fill in the details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <fieldset disabled={isSubmitting} className="space-y-4">
            {isSubmitting && (
              <div className="bg-accent/50 absolute inset-0 z-10 flex items-center justify-center rounded-lg">
                <div className="bg-background flex items-center gap-3 rounded-lg px-4 py-2 shadow-lg">
                  <div className="border-primary size-4 animate-spin rounded-full border-2 border-t-transparent"></div>
                  <span className="text-foreground text-sm font-medium">Adding room...</span>
                </div>
              </div>
            )}
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

            {/* Image Upload Section */}
            <div className="space-y-2">
              <label className="text-foreground block text-sm font-medium">
                Room Images
              </label>
              <div className="space-y-4">
                {/* Upload Button */}
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2"
                  >
                    <Upload className="size-4" />
                    Upload Images
                  </Button>
                  <span className="text-muted-foreground text-sm">
                    Max 10 images, 5MB each (JPEG, PNG, WebP)
                  </span>
                </div>

                <input
                  key={fileInputKey}
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  multiple
                  onChange={handleImageSelect}
                  className="hidden"
                />

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <div className="border-border bg-accent aspect-square overflow-hidden rounded-lg border">
                          <img
                            src={preview}
                            alt={`Room image ${index + 1}`}
                            className="size-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90 absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full shadow-sm"
                        >
                          <X className="size-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Empty State */}
                {imagePreviews.length === 0 && (
                  <div className="border-border bg-accent/50 flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-8">
                    <ImageIcon className="text-muted-foreground size-8" />
                    <p className="text-muted-foreground mt-2 text-sm">
                      No images selected
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Click &quot;Upload Images&quot; to add room photos
                    </p>
                  </div>
                )}
              </div>
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
          </fieldset>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
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
