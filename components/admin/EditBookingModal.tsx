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
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface Booking {
  id: number;
  check_in: string;
  check_out: string;
  adults: number;
  children: number;
  status: string;
  special_requests?: string;
  user?: {
    name: string;
    email: string;
  };
  room?: {
    name: string;
    room_number: string;
  };
}

interface EditBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (booking: {
    check_in: string;
    check_out: string;
    adults: number;
    children: number;
    status: string;
    special_requests?: string;
  }) => void;
  booking: Booking | null;
}

export function EditBookingModal({
  isOpen,
  onClose,
  onEdit,
  booking,
}: EditBookingModalProps) {
  const [formData, setFormData] = useState({
    adults: "1",
    children: "0",
    status: "pending",
    special_requests: "",
  });
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(undefined);
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data when booking changes
  useEffect(() => {
    console.log("EditBookingModal useEffect triggered:", { booking });
    if (booking) {
      console.log("Booking status:", booking.status);
      const newFormData = {
        adults: booking.adults.toString(),
        children: booking.children.toString(),
        status: booking.status,
        special_requests: booking.special_requests || "",
      };
      console.log("Setting form data:", newFormData);
      setFormData(newFormData);
      // Parse ISO date strings to Date objects
      setCheckInDate(parseISO(booking.check_in));
      setCheckOutDate(parseISO(booking.check_out));
    }
  }, [booking]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        adults: "1",
        children: "0",
        status: "pending",
        special_requests: "",
      });
      setCheckInDate(undefined);
      setCheckOutDate(undefined);
    }
  }, [isOpen]);

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
        check_in: format(checkInDate, "yyyy-MM-dd"),
        check_out: format(checkOutDate, "yyyy-MM-dd"),
        adults: parseInt(formData.adults),
        children: parseInt(formData.children) || 0,
        status: formData.status,
        special_requests: formData.special_requests || undefined,
      };

      await onEdit(bookingData);

      // Reset form
      setFormData({
        adults: "1",
        children: "0",
        status: "pending",
        special_requests: "",
      });
      setCheckInDate(undefined);
      setCheckOutDate(undefined);
    } catch (error) {
      console.error("Error updating booking:", error);
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
          <DialogTitle>Edit Booking</DialogTitle>
          <DialogDescription className="text-center">
            Update the booking details below.
            <br />
            {booking?.user && `Guest: ${booking.user.name}`}
            {booking?.room && ` • Room: ${booking.room.name}`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <fieldset disabled={isSubmitting} className="space-y-4">
            {isSubmitting && (
              <div className="bg-accent/50 absolute inset-0 z-10 flex items-center justify-center rounded-lg">
                <div className="bg-background flex items-center gap-3 rounded-lg px-4 py-2 shadow-lg">
                  <div className="border-primary size-4 animate-spin rounded-full border-2 border-t-transparent"></div>
                  <span className="text-foreground text-sm font-medium">
                    Updating booking...
                  </span>
                </div>
              </div>
            )}

            {/* Booking Status */}
            <div className="space-y-2">
              <label className="text-foreground block text-sm font-medium">
                Booking Status * (Current: {formData.status})
              </label>
              <select
                value={formData.status}
                onChange={(e) => {
                  console.log("Status changed to:", e.target.value);
                  setFormData((prev) => ({ ...prev, status: e.target.value }));
                }}
                className="border-input bg-background focus:border-ring focus:ring-ring/50 h-10 w-full rounded-md border px-3 text-sm focus:ring-2 focus:outline-none"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="checked_in">Checked In</option>
                <option value="checked_out">Checked Out</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Dates */}
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

            {/* Guests */}
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

            {/* Special Requests */}
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
              {isSubmitting ? "Updating..." : "Update Booking"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
