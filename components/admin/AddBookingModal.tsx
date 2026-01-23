"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "lucide-react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { getRooms } from "@/lib/api";
import toast from "react-hot-toast";

interface Room {
  id: number;
  name: string;
  room_number: string;
  price_per_night: number;
  status: string;
}

interface AddBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (booking: {
    name: string;
    email: string;
    phone: string;
    password: string;
    room_id: number;
    check_in: string;
    check_out: string;
    adults: number;
    children: number;
    special_requests?: string;
  }) => void;
}

export function AddBookingModal({
  isOpen,
  onClose,
  onAdd,
}: AddBookingModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    room_id: "",
    adults: "1",
    children: "0",
    special_requests: "",
  });
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(undefined);
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);

  // Calculate price preview
  const selectedRoom = rooms.find(room => room.id.toString() === formData.room_id);
  const numberOfNights = checkInDate && checkOutDate
    ? Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 3600 * 24))
    : 0;
  const totalPrice = selectedRoom && numberOfNights > 0
    ? selectedRoom.price_per_night * numberOfNights
    : 0;

  useEffect(() => {
    if (isOpen) {
      fetchRooms();
    }
  }, [isOpen]);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const response = await getRooms();
      // Filter only available rooms
      const availableRooms = response.data.filter(
        (room: Room) => room.status === "available"
      );
      setRooms(availableRooms);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      toast.error("Failed to load rooms");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate dates
    if (!checkInDate || !checkOutDate) {
      toast.error("Please select check-in and check-out dates");
      return;
    }

    if (checkOutDate <= checkInDate) {
      toast.error("Check-out date must be after check-in date");
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        room_id: parseInt(formData.room_id),
        check_in: format(checkInDate, "yyyy-MM-dd"),
        check_out: format(checkOutDate, "yyyy-MM-dd"),
        adults: parseInt(formData.adults),
        children: parseInt(formData.children) || 0,
        special_requests: formData.special_requests || undefined,
      };

      await onAdd(bookingData);

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        room_id: "",
        adults: "1",
        children: "0",
        special_requests: "",
      });
      setCheckInDate(undefined);
      setCheckOutDate(undefined);
      onClose();
    } catch (error) {
      console.error("Error adding booking:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get today's date for min date validation
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!isSubmitting && !open) {
          onClose();
        }
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader className="flex-col">
          <DialogTitle>Create New Booking</DialogTitle>
          <DialogDescription className="text-center">
            Create a booking for a guest.
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
                  <span className="text-foreground text-sm font-medium">
                    Creating booking...
                  </span>
                </div>
              </div>
            )}

            {/* Guest Information */}
            <div className="space-y-3">
              <h3 className="text-foreground text-sm font-semibold">
                Guest Information
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="text-foreground block text-sm font-medium"
                  >
                    Full Name *
                  </label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-foreground block text-sm font-medium"
                  >
                    Email *
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, email: e.target.value }))
                    }
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="phone"
                    className="text-foreground block text-sm font-medium"
                  >
                    Phone *
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    placeholder="+1234567890"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="text-foreground block text-sm font-medium"
                  >
                    Password *
                  </label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    placeholder="Secure password"
                    required
                    minLength={6}
                  />
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="space-y-3">
              <h3 className="text-foreground text-sm font-semibold">
                Booking Details
              </h3>

              <div className="space-y-2">
                <label className="text-foreground block text-sm font-medium">
                  Room *
                </label>
                <ShadcnSelect
                  value={formData.room_id}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, room_id: value }))
                  }
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        loading ? "Loading rooms..." : "Select a room"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.length === 0 ? (
                      <div className="text-muted-foreground px-2 py-4 text-center text-sm">
                        No available rooms
                      </div>
                    ) : (
                      rooms.map((room) => (
                        <SelectItem key={room.id} value={room.id.toString()}>
                          {room.name} - Room {room.room_number} ({new Intl.NumberFormat("en-NG", {
                            style: "currency",
                            currency: "NGN",
                            minimumFractionDigits: 0,
                          }).format(room.price_per_night)}/night)
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </ShadcnSelect>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-foreground block text-sm font-medium">
                    Check-in Date *
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !checkInDate && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 size-4" />
                        {checkInDate ? (
                          format(checkInDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={checkInDate}
                        onSelect={setCheckInDate}
                        disabled={(date) => date < today}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <label className="text-foreground block text-sm font-medium">
                    Check-out Date *
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !checkOutDate && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 size-4" />
                        {checkOutDate ? (
                          format(checkOutDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={checkOutDate}
                        onSelect={setCheckOutDate}
                        disabled={(date) =>
                          date < today || (checkInDate ? date <= checkInDate : false)
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="adults"
                    className="text-foreground block text-sm font-medium"
                  >
                    Adults *
                  </label>
                  <Input
                    id="adults"
                    type="number"
                    value={formData.adults}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, adults: e.target.value }))
                    }
                    min="1"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="children"
                    className="text-foreground block text-sm font-medium"
                  >
                    Children
                  </label>
                  <Input
                    id="children"
                    type="number"
                    value={formData.children}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        children: e.target.value,
                      }))
                    }
                    min="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="special_requests"
                  className="text-foreground block text-sm font-medium"
                >
                  Special Requests
                </label>
                <Textarea
                  id="special_requests"
                  value={formData.special_requests}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      special_requests: e.target.value,
                    }))
                  }
                  placeholder="Any special requests or notes..."
                  rows={3}
                />
              </div>

              {/* Price Preview */}
              {selectedRoom && checkInDate && checkOutDate && numberOfNights > 0 && (
                <div className="bg-accent/50 space-y-2 rounded-lg p-4">
                  <h4 className="text-foreground font-medium">Price Summary</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Room Rate:</span>
                      <span className="text-foreground">
                        {new Intl.NumberFormat("en-NG", {
                          style: "currency",
                          currency: "NGN",
                          minimumFractionDigits: 0,
                        }).format(selectedRoom.price_per_night)} per night
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="text-foreground">{numberOfNights} night(s)</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-medium">
                      <span className="text-foreground">Total:</span>
                      <span className="text-primary text-lg">
                        {new Intl.NumberFormat("en-NG", {
                          style: "currency",
                          currency: "NGN",
                          minimumFractionDigits: 0,
                        }).format(totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
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
            <Button type="submit" disabled={isSubmitting || rooms.length === 0}>
              {isSubmitting ? "Creating..." : "Create Booking"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
