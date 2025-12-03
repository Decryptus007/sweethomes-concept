"use client";

import { useState } from "react";
import {
  Sparkles,
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Wifi,
  Tv,
  Car,
  UtensilsCrossed,
  Dumbbell,
  Bath,
  Wind,
  Coffee,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddAmenityModal } from "@/components/admin/AddAmenityModal";

interface Amenity {
  id: number;
  name: string;
  icon: string;
  description: string;
  roomCount: number;
}

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  wifi: Wifi,
  tv: Tv,
  parking: Car,
  restaurant: UtensilsCrossed,
  gym: Dumbbell,
  spa: Bath,
  ac: Wind,
  coffee: Coffee,
};

// Mock data - replace with API call
const mockAmenities: Amenity[] = [
  {
    id: 1,
    name: "Free WiFi",
    icon: "wifi",
    description: "High-speed wireless internet available throughout the hotel",
    roomCount: 24,
  },
  {
    id: 2,
    name: "Smart TV",
    icon: "tv",
    description: "LED Smart TV with Netflix and cable channels",
    roomCount: 24,
  },
  {
    id: 3,
    name: "Free Parking",
    icon: "parking",
    description: "Secure parking space for guests",
    roomCount: 20,
  },
  {
    id: 4,
    name: "Restaurant",
    icon: "restaurant",
    description: "24/7 room service and on-site restaurant",
    roomCount: 24,
  },
  {
    id: 5,
    name: "Fitness Center",
    icon: "gym",
    description: "Fully equipped gym with modern equipment",
    roomCount: 15,
  },
  {
    id: 6,
    name: "Spa & Wellness",
    icon: "spa",
    description: "Relaxing spa treatments and sauna",
    roomCount: 8,
  },
  {
    id: 7,
    name: "Air Conditioning",
    icon: "ac",
    description: "Individual climate control in each room",
    roomCount: 24,
  },
  {
    id: 8,
    name: "Coffee Maker",
    icon: "coffee",
    description: "In-room coffee and tea making facilities",
    roomCount: 18,
  },
];

export default function AmenitiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [amenities, setAmenities] = useState(mockAmenities);

  const handleAddAmenity = (amenityData: {
    name: string;
    icon: string;
    description: string;
  }) => {
    const newAmenity: Amenity = {
      ...amenityData,
      id: Math.max(...amenities.map((a) => a.id)) + 1,
      roomCount: 0,
    };
    setAmenities((prev) => [...prev, newAmenity]);
  };

  const filteredAmenities = amenities.filter(
    (amenity) =>
      amenity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      amenity.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName] || Sparkles;
    return IconComponent;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-foreground font-[family-name:var(--font-gilda)] text-3xl">
            Amenities
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage amenities available in your rooms
          </p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="w-full sm:w-auto"
        >
          <Plus className="size-4" />
          Add Amenity
        </Button>
      </div>

      {/* Search */}
      <div className="border-border bg-card flex items-center rounded-xl border p-4">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            placeholder="Search amenities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 pl-10"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="border-border bg-card rounded-lg border p-4">
          <p className="text-muted-foreground text-sm">Total Amenities</p>
          <p className="text-foreground mt-1 text-2xl font-bold">
            {mockAmenities.length}
          </p>
        </div>
        <div className="border-border bg-card rounded-lg border p-4">
          <p className="text-muted-foreground text-sm">Most Common</p>
          <p className="text-foreground mt-1 text-2xl font-bold">WiFi</p>
        </div>
        <div className="border-border bg-card col-span-2 rounded-lg border p-4 sm:col-span-1">
          <p className="text-muted-foreground text-sm">Avg per Room</p>
          <p className="text-foreground mt-1 text-2xl font-bold">6</p>
        </div>
      </div>

      {/* Amenities Grid */}
      {filteredAmenities.length === 0 ? (
        <div className="border-border bg-card flex flex-col items-center justify-center rounded-xl border py-16">
          <Sparkles className="text-muted-foreground size-12" />
          <p className="text-foreground mt-4 text-lg font-medium">
            No amenities found
          </p>
          <p className="text-muted-foreground mt-1">
            {searchQuery
              ? "Try adjusting your search"
              : "Add your first amenity to get started"}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredAmenities.map((amenity) => {
            const Icon = getIcon(amenity.icon);
            return (
              <div
                key={amenity.id}
                className="group border-border bg-card relative rounded-xl border p-6 transition-shadow hover:shadow-md"
              >
                {/* Actions Dropdown */}
                <div className="absolute top-3 right-3">
                  <button
                    onClick={() =>
                      setOpenDropdown(
                        openDropdown === amenity.id ? null : amenity.id,
                      )
                    }
                    className="hover:bg-accent rounded-lg p-1.5 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <MoreHorizontal className="text-muted-foreground size-4" />
                  </button>
                  {openDropdown === amenity.id && (
                    <div className="border-border bg-card absolute top-full right-0 z-10 mt-1 w-32 overflow-hidden rounded-lg border shadow-lg">
                      <button className="text-foreground hover:bg-accent flex w-full items-center gap-2 px-3 py-2 text-sm">
                        <Edit className="size-4" />
                        Edit
                      </button>
                      <button className="text-destructive hover:bg-destructive/10 flex w-full items-center gap-2 px-3 py-2 text-sm">
                        <Trash2 className="size-4" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                {/* Icon */}
                <div className="bg-primary/10 mb-4 flex size-14 items-center justify-center rounded-xl">
                  <Icon className="text-primary size-7" />
                </div>

                {/* Content */}
                <h3 className="text-foreground font-medium">{amenity.name}</h3>
                <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                  {amenity.description}
                </p>

                {/* Footer */}
                <div className="border-border mt-4 flex items-center justify-between border-t pt-4">
                  <span className="text-muted-foreground text-sm">
                    Available in
                  </span>
                  <span className="text-foreground font-medium">
                    {amenity.roomCount} rooms
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Close dropdown when clicking outside */}
      {openDropdown !== null && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setOpenDropdown(null)}
        />
      )}

      <AddAmenityModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddAmenity}
      />
    </div>
  );
}
