"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
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
import { ConfirmDialog } from "@/components/ConfirmDialog";
import {
  getAmenities,
  addAmenity,
  updateAmenity,
  deleteAmenity,
} from "@/lib/api";

interface Amenity {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
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

const getIconKey = (name: string): string => {
  const lower = name.toLowerCase();
  if (lower.includes("wifi")) return "wifi";
  if (lower.includes("tv") || lower.includes("smart")) return "tv";
  if (lower.includes("parking")) return "parking";
  if (lower.includes("restaurant") || lower.includes("dining"))
    return "restaurant";
  if (lower.includes("gym") || lower.includes("fitness")) return "gym";
  if (lower.includes("spa") || lower.includes("wellness")) return "spa";
  if (
    lower.includes("air") ||
    lower.includes("conditioning") ||
    lower.includes("ac")
  )
    return "ac";
  if (lower.includes("coffee") || lower.includes("tea")) return "coffee";
  if (lower.includes("pool") || lower.includes("swimming")) return "pool"; // assuming pool icon exists, but not in map, maybe add
  return "sparkles";
};

export default function AmenitiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState<Amenity | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [amenityToDelete, setAmenityToDelete] = useState<Amenity | null>(null);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAmenities();
  }, []);

  const fetchAmenities = async () => {
    try {
      const response = await getAmenities();
      setAmenities(response.data);
    } catch (error) {
      console.error("Failed to fetch amenities:", error);
      toast.error("Failed to load amenities. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAmenity = async (amenityData: { name: string }) => {
    try {
      if (editingAmenity) {
        await updateAmenity(editingAmenity.id, amenityData.name);
        toast.success("Amenity updated successfully!");
      } else {
        await addAmenity(amenityData);
        toast.success("Amenity added successfully!");
      }
      fetchAmenities(); // Refetch to get updated list
      setEditingAmenity(null);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Failed to save amenity:", error);
      toast.error(
        `Failed to ${editingAmenity ? "update" : "add"} amenity. Please try again.`,
      );
    }
  };

  const handleEditAmenity = (amenity: Amenity) => {
    setEditingAmenity(amenity);
    setIsAddModalOpen(true);
    setOpenDropdown(null);
  };

  const handleDeleteAmenity = (amenity: Amenity) => {
    setAmenityToDelete(amenity);
    setDeleteConfirmOpen(true);
    setOpenDropdown(null);
  };

  const confirmDeleteAmenity = async () => {
    if (!amenityToDelete) return;

    try {
      await deleteAmenity(amenityToDelete.id);
      toast.success("Amenity deleted successfully!");
      fetchAmenities(); // Refetch to get updated list
    } catch (error) {
      console.error("Failed to delete amenity:", error);
      toast.error("Failed to delete amenity. Please try again.");
    } finally {
      setDeleteConfirmOpen(false);
      setAmenityToDelete(null);
    }
  };

  const filteredAmenities = amenities.filter((amenity) =>
    amenity.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getIcon = (amenity: Amenity) => {
    const iconKey = getIconKey(amenity.name);
    const IconComponent = iconMap[iconKey] || Sparkles;
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
          onClick={() => {
            setEditingAmenity(null);
            setIsAddModalOpen(true);
          }}
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
            {amenities.length}
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
      {loading ? (
        <div className="border-border bg-card flex flex-col items-center justify-center rounded-xl border py-16">
          <Sparkles className="text-muted-foreground size-12 animate-spin" />
          <p className="text-muted-foreground mt-4">Loading amenities...</p>
        </div>
      ) : filteredAmenities.length === 0 ? (
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
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredAmenities.map((amenity) => {
            const Icon = getIcon(amenity);
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
                    className="hover:bg-accent rounded-lg p-1.5 opacity-100 md:opacity-0 md:transition-opacity md:group-hover:opacity-100"
                  >
                    <MoreHorizontal className="text-muted-foreground size-4" />
                  </button>
                  {openDropdown === amenity.id && (
                    <div className="border-border bg-card absolute top-full right-0 z-10 mt-1 w-32 rounded-lg border shadow-lg">
                      <button
                        onClick={() => handleEditAmenity(amenity)}
                        className="text-foreground hover:bg-accent flex w-full items-center gap-2 px-3 py-2 text-sm"
                      >
                        <Edit className="size-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAmenity(amenity)}
                        className="text-destructive hover:bg-destructive/10 flex w-full items-center gap-2 px-3 py-2 text-sm"
                      >
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
                <h3 className="text-foreground text-sm font-medium sm:text-base">
                  {amenity.name}
                </h3>
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
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingAmenity(null);
        }}
        onAdd={handleSaveAmenity}
        editingAmenity={editingAmenity}
      />

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Amenity"
        description={`Are you sure you want to delete "${amenityToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDeleteAmenity}
        variant="destructive"
      />
    </div>
  );
}
