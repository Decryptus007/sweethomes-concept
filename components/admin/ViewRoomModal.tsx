"use client";

import { BedDouble } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RoomType } from "@/lib/roomTypes";
import { getApiImageUrl } from "@/lib/utils";

interface Room {
  id: number;
  name: string;
  room_number: string;
  type: RoomType;
  price_per_night: number;
  capacity: number;
  description: string;
  status: "available" | "occupied" | "maintenance";
  amenities: { id: number; name: string }[];
  facilities: { id: number; name: string }[];
  images: { id: number; room_id: number; image_path: string; created_at: string; updated_at: string }[];
  created_at: string;
  updated_at: string;
}

interface ViewRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room | null;
}

export function ViewRoomModal({ isOpen, onClose, room }: ViewRoomModalProps) {
  if (!room) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statusStyles = {
    available: "bg-green-100 text-green-800",
    occupied: "bg-blue-100 text-blue-800",
    maintenance: "bg-orange-100 text-orange-800",
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="bg-accent flex size-10 items-center justify-center rounded-lg">
              <BedDouble className="text-muted-foreground size-5" />
            </div>
            {room.name}
          </DialogTitle>
          <DialogDescription>
            Room {room.room_number} • {room.type}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Room Images */}
          {room.images && room.images.length > 0 && (
            <div>
              <h3 className="text-foreground mb-3 font-medium">Room Images</h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {room.images.map((image) => (
                  <div
                    key={image.id}
                    className="border-border bg-accent aspect-square overflow-hidden rounded-lg border"
                  >
                    <img
                      src={getApiImageUrl(image.image_path)}
                      alt={`${room.name} - Image ${image.id}`}
                      className="size-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status and Basic Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span
                className={`inline-block rounded-full px-3 py-1 text-sm font-medium capitalize ${statusStyles[room.status]}`}
              >
                {room.status}
              </span>
              <span className="text-muted-foreground text-sm">
                {room.capacity} guests
              </span>
            </div>
            <div className="text-right">
              <p className="text-foreground text-2xl font-bold">
                {formatPrice(room.price_per_night)}
              </p>
              <p className="text-muted-foreground text-sm">per night</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-foreground mb-2 font-medium">Description</h3>
            <p className="text-muted-foreground">{room.description}</p>
          </div>

          {/* Amenities */}
          {room.amenities.length > 0 && (
            <div>
              <h3 className="text-foreground mb-2 font-medium">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {room.amenities.map((amenity) => (
                  <span
                    key={amenity.id}
                    className="bg-accent text-muted-foreground rounded px-2 py-1 text-sm"
                  >
                    {amenity.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Facilities */}
          {room.facilities.length > 0 && (
            <div>
              <h3 className="text-foreground mb-2 font-medium">Facilities</h3>
              <div className="flex flex-wrap gap-2">
                {room.facilities.map((facility) => (
                  <span
                    key={facility.id}
                    className="border-border bg-background text-foreground rounded border px-2 py-1 text-sm"
                  >
                    {facility.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="border-border border-t pt-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Created</p>
                <p className="text-foreground">{formatDate(room.created_at)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Last Updated</p>
                <p className="text-foreground">{formatDate(room.updated_at)}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
