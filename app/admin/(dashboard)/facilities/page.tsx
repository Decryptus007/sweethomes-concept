"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  Building2,
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Car,
  Utensils,
  Waves,
  Dumbbell,
  Users,
  Wine,
  Briefcase,
  TreePine,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddFacilityModal } from "@/components/admin/AddFacilityModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import {
  getFacilities,
  addFacility,
  updateFacility,
  deleteFacility,
} from "@/lib/api";

interface Facility {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  parking: Car,
  restaurant: Utensils,
  pool: Waves,
  gym: Dumbbell,
  conference: Users,
  bar: Wine,
  business: Briefcase,
  garden: TreePine,
};

const getIconKey = (name: string): string => {
  const lower = name.toLowerCase();
  if (lower.includes("parking")) return "parking";
  if (lower.includes("restaurant") || lower.includes("dining"))
    return "restaurant";
  if (lower.includes("pool") || lower.includes("swimming")) return "pool";
  if (lower.includes("gym") || lower.includes("fitness")) return "gym";
  if (lower.includes("conference") || lower.includes("meeting"))
    return "conference";
  if (lower.includes("bar") || lower.includes("lounge")) return "bar";
  if (lower.includes("business") || lower.includes("center")) return "business";
  if (lower.includes("garden") || lower.includes("terrace")) return "garden";
  return "building2";
};

export default function FacilitiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [facilityToDelete, setFacilityToDelete] = useState<Facility | null>(
    null,
  );
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      const response = await getFacilities();
      setFacilities(response.data);
    } catch (error) {
      console.error("Failed to fetch facilities:", error);
      toast.error("Failed to load facilities. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFacility = async (facilityData: { name: string }) => {
    try {
      if (editingFacility) {
        await updateFacility(editingFacility.id, facilityData.name);
        toast.success("Facility updated successfully!");
      } else {
        await addFacility(facilityData);
        toast.success("Facility added successfully!");
      }
      fetchFacilities(); // Refetch to get updated list
      setEditingFacility(null);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Failed to save facility:", error);
      toast.error(
        `Failed to ${editingFacility ? "update" : "add"} facility. Please try again.`,
      );
    }
  };

  const handleEditFacility = (facility: Facility) => {
    setEditingFacility(facility);
    setIsAddModalOpen(true);
    setOpenDropdown(null);
  };

  const handleDeleteFacility = (facility: Facility) => {
    setFacilityToDelete(facility);
    setDeleteConfirmOpen(true);
    setOpenDropdown(null);
  };

  const confirmDeleteFacility = async () => {
    if (!facilityToDelete) return;

    try {
      await deleteFacility(facilityToDelete.id);
      toast.success("Facility deleted successfully!");
      fetchFacilities(); // Refetch to get updated list
    } catch (error) {
      console.error("Failed to delete facility:", error);
      toast.error("Failed to delete facility. Please try again.");
    } finally {
      setDeleteConfirmOpen(false);
      setFacilityToDelete(null);
    }
  };

  const filteredFacilities = facilities.filter((facility) =>
    facility.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getIcon = (facility: Facility) => {
    const iconKey = getIconKey(facility.name);
    const IconComponent = iconMap[iconKey] || Building2;
    return IconComponent;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-foreground font-[family-name:var(--font-gilda)] text-3xl">
            Facilities
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage hotel facilities and services
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingFacility(null);
            setIsAddModalOpen(true);
          }}
          className="w-full sm:w-auto"
        >
          <Plus className="size-4" />
          Add Facility
        </Button>
      </div>

      {/* Search */}
      <div className="border-border bg-card flex items-center rounded-xl border p-4">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            placeholder="Search facilities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 pl-10"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="border-border bg-card rounded-lg border p-4">
          <p className="text-muted-foreground text-sm">Total Facilities</p>
          <p className="text-foreground mt-1 text-2xl font-bold">
            {facilities.length}
          </p>
        </div>
      </div>

      {/* Facilities Grid */}
      {loading ? (
        <div className="border-border bg-card flex flex-col items-center justify-center rounded-xl border py-16">
          <Building2 className="text-muted-foreground size-12 animate-spin" />
          <p className="text-muted-foreground mt-4">Loading facilities...</p>
        </div>
      ) : filteredFacilities.length === 0 ? (
        <div className="border-border bg-card flex flex-col items-center justify-center rounded-xl border py-16">
          <Building2 className="text-muted-foreground size-12" />
          <p className="text-foreground mt-4 text-lg font-medium">
            No facilities found
          </p>
          <p className="text-muted-foreground mt-1">
            {searchQuery
              ? "Try adjusting your search"
              : "Add your first facility to get started"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredFacilities.map((facility) => {
            const Icon = getIcon(facility);
            return (
              <div
                key={facility.id}
                className="group border-border bg-card relative rounded-xl border transition-shadow hover:shadow-md"
              >
                {/* Image placeholder */}
                <div className="bg-accent relative h-40">
                  <div className="flex size-full items-center justify-center">
                    <Icon className="text-muted-foreground/50 size-16" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <h3 className="text-foreground text-sm font-medium sm:text-base">
                      {facility.name}
                    </h3>
                    <div className="relative">
                      <button
                        onClick={() =>
                          setOpenDropdown(
                            openDropdown === facility.id ? null : facility.id,
                          )
                        }
                        className="hover:bg-accent rounded-lg p-1 opacity-100 md:opacity-0 md:transition-opacity md:group-hover:opacity-100"
                      >
                        <MoreHorizontal className="text-muted-foreground size-4" />
                      </button>
                      {openDropdown === facility.id && (
                        <div className="border-border bg-card absolute top-full right-0 z-10 mt-1 w-32 rounded-lg border shadow-lg">
                          <button
                            onClick={() => handleEditFacility(facility)}
                            className="text-foreground hover:bg-accent flex w-full items-center gap-2 px-3 py-2 text-sm"
                          >
                            <Edit className="size-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteFacility(facility)}
                            className="text-destructive hover:bg-destructive/10 flex w-full items-center gap-2 px-3 py-2 text-sm"
                          >
                            <Trash2 className="size-4" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
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

      <AddFacilityModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingFacility(null);
        }}
        onAdd={handleSaveFacility}
        editingFacility={editingFacility}
      />

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Facility"
        description={`Are you sure you want to delete "${facilityToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDeleteFacility}
        variant="destructive"
      />
    </div>
  );
}
