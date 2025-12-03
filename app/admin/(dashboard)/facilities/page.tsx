"use client";

import { useState } from "react";
import {
  Building2,
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Car,
  Utensils,
  Waves,
  Dumbbell,
  Users,
  Wine,
  Briefcase,
  TreePine,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddFacilityModal } from "@/components/admin/AddFacilityModal";

interface Facility {
  id: number;
  name: string;
  icon: string;
  description: string;
  image: string;
  operatingHours: string;
  status: "open" | "closed" | "maintenance";
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

// Mock data - replace with API call
const mockFacilities: Facility[] = [
  {
    id: 1,
    name: "Swimming Pool",
    icon: "pool",
    description:
      "Olympic-size outdoor pool with loungers and poolside bar service",
    image: "/assets/images/facilities/pool.jpg",
    operatingHours: "6:00 AM - 10:00 PM",
    status: "open",
  },
  {
    id: 2,
    name: "Fine Dining Restaurant",
    icon: "restaurant",
    description:
      "Award-winning restaurant serving local and international cuisine",
    image: "/assets/images/facilities/restaurant.jpg",
    operatingHours: "7:00 AM - 11:00 PM",
    status: "open",
  },
  {
    id: 3,
    name: "Fitness Center",
    icon: "gym",
    description: "State-of-the-art gym with personal training available",
    image: "/assets/images/facilities/gym.jpg",
    operatingHours: "24 Hours",
    status: "open",
  },
  {
    id: 4,
    name: "Conference Hall",
    icon: "conference",
    description: "Multi-purpose hall for events, meetings, and conferences",
    image: "/assets/images/facilities/conference.jpg",
    operatingHours: "By Reservation",
    status: "open",
  },
  {
    id: 5,
    name: "Rooftop Bar",
    icon: "bar",
    description: "Elegant bar with panoramic city views and craft cocktails",
    image: "/assets/images/facilities/bar.jpg",
    operatingHours: "5:00 PM - 2:00 AM",
    status: "closed",
  },
  {
    id: 6,
    name: "Business Center",
    icon: "business",
    description: "Fully equipped workspace with printing and meeting rooms",
    image: "/assets/images/facilities/business.jpg",
    operatingHours: "24 Hours",
    status: "open",
  },
  {
    id: 7,
    name: "Parking Garage",
    icon: "parking",
    description: "Secure underground parking with valet service available",
    image: "/assets/images/facilities/parking.jpg",
    operatingHours: "24 Hours",
    status: "open",
  },
  {
    id: 8,
    name: "Garden & Terrace",
    icon: "garden",
    description: "Beautiful landscaped gardens perfect for relaxation",
    image: "/assets/images/facilities/garden.jpg",
    operatingHours: "6:00 AM - 9:00 PM",
    status: "maintenance",
  },
];

export default function FacilitiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [facilities, setFacilities] = useState(mockFacilities);

  const handleAddFacility = (facilityData: {
    name: string;
    icon: string;
    description: string;
    image: string;
  }) => {
    const newFacility: Facility = {
      ...facilityData,
      id: Math.max(...facilities.map((f) => f.id)) + 1,
      operatingHours: "24/7", // Default operating hours
      status: "open", // Default status
    };
    setFacilities((prev) => [...prev, newFacility]);
  };

  const filteredFacilities = facilities.filter((facility) => {
    const matchesSearch =
      facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      facility.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || facility.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusStyles = {
    open: "bg-green-100 text-green-800",
    closed: "bg-red-100 text-red-800",
    maintenance: "bg-orange-100 text-orange-800",
  };

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName] || Building2;
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
          onClick={() => setIsAddModalOpen(true)}
          className="w-full sm:w-auto"
        >
          <Plus className="size-4" />
          Add Facility
        </Button>
      </div>

      {/* Filters */}
      <div className="border-border bg-card flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            placeholder="Search facilities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border-input bg-background focus:border-ring focus:ring-ring/50 h-10 rounded-md border px-3 text-sm focus:ring-2 focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
          <option value="maintenance">Maintenance</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="border-border bg-card rounded-lg border p-4">
          <p className="text-muted-foreground text-sm">Total Facilities</p>
          <p className="text-foreground mt-1 text-2xl font-bold">
            {mockFacilities.length}
          </p>
        </div>
        <div className="border-border bg-card rounded-lg border p-4">
          <p className="text-muted-foreground text-sm">Open</p>
          <p className="mt-1 text-2xl font-bold text-green-600">
            {mockFacilities.filter((f) => f.status === "open").length}
          </p>
        </div>
        <div className="border-border bg-card rounded-lg border p-4">
          <p className="text-muted-foreground text-sm">Closed</p>
          <p className="mt-1 text-2xl font-bold text-red-600">
            {mockFacilities.filter((f) => f.status === "closed").length}
          </p>
        </div>
        <div className="border-border bg-card rounded-lg border p-4">
          <p className="text-muted-foreground text-sm">Maintenance</p>
          <p className="mt-1 text-2xl font-bold text-orange-600">
            {mockFacilities.filter((f) => f.status === "maintenance").length}
          </p>
        </div>
      </div>

      {/* Facilities Grid */}
      {filteredFacilities.length === 0 ? (
        <div className="border-border bg-card flex flex-col items-center justify-center rounded-xl border py-16">
          <Building2 className="text-muted-foreground size-12" />
          <p className="text-foreground mt-4 text-lg font-medium">
            No facilities found
          </p>
          <p className="text-muted-foreground mt-1">
            {searchQuery || statusFilter !== "all"
              ? "Try adjusting your search or filter"
              : "Add your first facility to get started"}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredFacilities.map((facility) => {
            const Icon = getIcon(facility.icon);
            return (
              <div
                key={facility.id}
                className="group border-border bg-card overflow-hidden rounded-xl border transition-shadow hover:shadow-md"
              >
                {/* Image placeholder */}
                <div className="bg-accent relative h-40">
                  <div className="flex size-full items-center justify-center">
                    <Icon className="text-muted-foreground/50 size-16" />
                  </div>
                  {/* Status Badge */}
                  <span
                    className={cn(
                      "absolute top-3 right-3 rounded-full px-2.5 py-1 text-xs font-medium capitalize",
                      statusStyles[facility.status],
                    )}
                  >
                    {facility.status}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <h3 className="text-foreground font-medium">
                      {facility.name}
                    </h3>
                    <div className="relative">
                      <button
                        onClick={() =>
                          setOpenDropdown(
                            openDropdown === facility.id ? null : facility.id,
                          )
                        }
                        className="hover:bg-accent rounded-lg p-1"
                      >
                        <MoreHorizontal className="text-muted-foreground size-4" />
                      </button>
                      {openDropdown === facility.id && (
                        <div className="border-border bg-card absolute top-full right-0 z-10 mt-1 w-32 overflow-hidden rounded-lg border shadow-lg">
                          <button className="text-foreground hover:bg-accent flex w-full items-center gap-2 px-3 py-2 text-sm">
                            <Eye className="size-4" />
                            View
                          </button>
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
                  </div>
                  <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">
                    {facility.description}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm">
                    <svg
                      className="text-muted-foreground size-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-muted-foreground">
                      {facility.operatingHours}
                    </span>
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
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddFacility}
      />
    </div>
  );
}
