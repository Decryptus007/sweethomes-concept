"use client";

import { useState } from "react";
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
import { User, Mail, Phone, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { userRegister, createPublicBooking } from "@/lib/api";
import { useUserAuth } from "@/hooks/useUserAuth";
import toast from "react-hot-toast";

interface BookingData {
  room_id: number;
  room_name: string;
  room_price: number; // Total price for all nights
  price_per_night: number; // Price per night
  number_of_nights: number; // Number of nights
  check_in: string;
  check_out: string;
  adults: number;
  children: number;
  special_requests?: string;
}

interface GuestBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingData: BookingData | null;
}

export function GuestBookingModal({
  isOpen,
  onClose,
  bookingData,
}: GuestBookingModalProps) {
  const { login, isAuthenticated, user } = useUserAuth();
  const [step, setStep] = useState<"guest-info" | "confirm" | "success">(
    isAuthenticated ? "confirm" : "guest-info"
  );
  const [guestInfo, setGuestInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState<number | null>(null);

  const handleGuestInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!bookingData) return;

    setIsSubmitting(true);

    try {
      // Register user with email as password
      const registerResponse = await userRegister({
        name: guestInfo.name,
        email: guestInfo.email,
        phone: guestInfo.phone,
        password: guestInfo.email,
        password_confirmation: guestInfo.email,
      });

      // Auto login the user
      login(registerResponse.data.token, registerResponse.data.user);

      // Create booking using the public booking API
      const bookingResponse = await createPublicBooking({
        name: guestInfo.name,
        email: guestInfo.email,
        phone: guestInfo.phone,
        password: guestInfo.email, // Use email as password
        room_id: bookingData.room_id,
        check_in: bookingData.check_in,
        check_out: bookingData.check_out,
        adults: bookingData.adults,
        children: bookingData.children,
        special_requests: bookingData.special_requests,
      });

      setBookingId(bookingResponse.data.id);
      setStep("success");
      toast.success("Booking created successfully!");
    } catch (error: any) {
      console.error("Error creating booking:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to create booking. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmedUserBooking = async () => {
    if (!bookingData) return;

    setIsSubmitting(true);

    try {
      // For already authenticated users, we use their existing user data
      if (!user) {
        toast.error("User not authenticated");
        return;
      }

      const bookingResponse = await createPublicBooking({
        name: user.name,
        email: user.email,
        phone: user.phone,
        password: user.email, // Use email as password (consistent with registration)
        room_id: bookingData.room_id,
        check_in: bookingData.check_in,
        check_out: bookingData.check_out,
        adults: bookingData.adults,
        children: bookingData.children,
        special_requests: bookingData.special_requests,
      });

      setBookingId(bookingResponse.data.id);
      setStep("success");
      toast.success("Booking created successfully!");
    } catch (error: any) {
      console.error("Error creating booking:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to create booking. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep(isAuthenticated ? "confirm" : "guest-info");
    setGuestInfo({ name: "", email: "", phone: "" });
    setBookingId(null);
    onClose();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (!bookingData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
        {step === "guest-info" && (
          <>
            <DialogHeader className="flex-col text-center">
              <DialogTitle>Complete Your Booking</DialogTitle>
              <DialogDescription>
                Please provide your details to complete the reservation
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleGuestInfoSubmit} className="space-y-4">
              <fieldset disabled={isSubmitting} className="space-y-4">
                {isSubmitting && (
                  <div className="bg-accent/50 absolute inset-0 z-10 flex items-center justify-center rounded-lg">
                    <div className="bg-background flex items-center gap-3 rounded-lg px-4 py-2 shadow-lg">
                      <div className="border-primary size-4 animate-spin rounded-full border-2 border-t-transparent"></div>
                      <span className="text-foreground text-sm font-medium">
                        Creating your booking...
                      </span>
                    </div>
                  </div>
                )}

                {/* Booking Summary */}
                <div className="bg-accent/50 space-y-2 rounded-lg p-4">
                  <h3 className="text-foreground font-medium">
                    Booking Summary
                  </h3>
                  <p className="text-foreground text-sm">
                    <strong>Room:</strong> {bookingData.room_name}
                  </p>
                  <p className="text-foreground text-sm">
                    <strong>Check-in:</strong>{" "}
                    {format(new Date(bookingData.check_in), "PPP")}
                  </p>
                  <p className="text-foreground text-sm">
                    <strong>Check-out:</strong>{" "}
                    {format(new Date(bookingData.check_out), "PPP")}
                  </p>
                  <p className="text-foreground text-sm">
                    <strong>Guests:</strong> {bookingData.adults} Adult(s),{" "}
                    {bookingData.children} Child(ren)
                  </p>
                  <div className="border-t pt-2 mt-2">
                    <p className="text-foreground text-sm">
                      <strong>Rate:</strong> {formatPrice(bookingData.price_per_night)} per night
                    </p>
                    <p className="text-foreground text-sm">
                      <strong>Duration:</strong> {bookingData.number_of_nights} night(s)
                    </p>
                    <p className="text-primary text-lg font-bold">
                      <strong>Total:</strong> {formatPrice(bookingData.room_price)}
                    </p>
                  </div>
                </div>

                {/* Guest Information */}
                <div className="space-y-3">
                  <h3 className="text-foreground font-medium">
                    Your Information
                  </h3>

                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="text-foreground block text-sm font-medium"
                    >
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                      <Input
                        id="name"
                        value={guestInfo.name}
                        onChange={(e) =>
                          setGuestInfo((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="John Doe"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-foreground block text-sm font-medium"
                    >
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                      <Input
                        id="email"
                        type="email"
                        value={guestInfo.email}
                        onChange={(e) =>
                          setGuestInfo((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        placeholder="john@example.com"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="phone"
                      className="text-foreground block text-sm font-medium"
                    >
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                      <Input
                        id="phone"
                        type="tel"
                        value={guestInfo.phone}
                        onChange={(e) =>
                          setGuestInfo((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                        placeholder="+1234567890"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>
              </fieldset>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Processing..." : "Confirm Booking"}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}

        {step === "confirm" && (
          <>
            <DialogHeader className="flex-col text-center">
              <DialogTitle>Confirm Your Booking</DialogTitle>
              <DialogDescription>
                Please review your booking details before confirming
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Booking Summary */}
              <div className="bg-accent/50 space-y-2 rounded-lg p-4">
                <h3 className="text-foreground font-medium">Booking Summary</h3>
                <p className="text-foreground text-sm">
                  <strong>Room:</strong> {bookingData.room_name}
                </p>
                <p className="text-foreground text-sm">
                  <strong>Check-in:</strong>{" "}
                  {format(new Date(bookingData.check_in), "PPP")}
                </p>
                <p className="text-foreground text-sm">
                  <strong>Check-out:</strong>{" "}
                  {format(new Date(bookingData.check_out), "PPP")}
                </p>
                <p className="text-foreground text-sm">
                  <strong>Guests:</strong> {bookingData.adults} Adult(s),{" "}
                  {bookingData.children} Child(ren)
                </p>
                <div className="border-t pt-2 mt-2">
                  <p className="text-foreground text-sm">
                    <strong>Rate:</strong> {formatPrice(bookingData.price_per_night)} per night
                  </p>
                  <p className="text-foreground text-sm">
                    <strong>Duration:</strong> {bookingData.number_of_nights} night(s)
                  </p>
                  <p className="text-primary text-lg font-bold">
                    <strong>Total:</strong> {formatPrice(bookingData.room_price)}
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmedUserBooking}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Confirm Booking"}
              </Button>
            </DialogFooter>
          </>
        )}

        {step === "success" && (
          <>
            <DialogHeader>
              <div className="flex flex-col items-center gap-4">
                <div className="bg-green-100 flex size-16 items-center justify-center rounded-full">
                  <CheckCircle className="size-8 text-green-600" />
                </div>
                <DialogTitle className="text-center text-2xl">
                  Booking Confirmed!
                </DialogTitle>
              </div>
            </DialogHeader>

            <div className="space-y-4">
              <div className="bg-accent/50 space-y-3 rounded-lg p-4 text-center">
                <p className="text-foreground">
                  Your reservation has been successfully placed.
                </p>
                <div className="border-border border-t pt-3">
                  <p className="text-foreground text-sm text-muted-foreground">
                    {formatPrice(bookingData.price_per_night)} × {bookingData.number_of_nights} night(s)
                  </p>
                  <p className="text-foreground text-lg font-semibold">
                    Amount to Pay at Hotel
                  </p>
                  <p className="text-primary text-3xl font-bold">
                    {formatPrice(bookingData.room_price)}
                  </p>
                </div>
              </div>

              {/* Account Information - Always show since user is now logged in */}
              <div className="bg-blue-50 space-y-3 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-100 flex size-8 items-center justify-center rounded-full">
                    <User className="size-4 text-blue-600" />
                  </div>
                  <p className="text-foreground text-sm font-medium">
                    🎉 Account Created & Logged In
                  </p>
                </div>
                <p className="text-muted-foreground text-sm">
                  An account has been created for you and you're now logged in!
                  You can access your dashboard anytime to view your bookings.
                </p>
                <div className="bg-white rounded-lg p-3 space-y-2">
                  <p className="text-foreground text-sm">
                    <strong>Login Email:</strong> {user?.email || guestInfo.email}
                  </p>
                  <p className="text-foreground text-sm">
                    <strong>Password:</strong> {user?.email || guestInfo.email}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    💡 Your email is your password for easy access
                  </p>
                </div>
              </div>

              <div className="text-muted-foreground space-y-2 text-center text-sm">
                <p>
                  Please proceed to the hotel to complete payment for your
                  reservation.
                </p>
                <p className="font-medium">Booking ID: #{bookingId}</p>
              </div>
            </div>

            <DialogFooter className="flex-col gap-2 sm:flex-col">
              <Button
                onClick={() => {
                  // Navigate to dashboard (you'll need to create this route)
                  window.location.href = '/dashboard';
                }}
                className="w-full"
              >
                📋 View My Bookings
              </Button>
              <Button
                variant="outline"
                onClick={handleClose}
                className="w-full"
              >
                Continue Browsing
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}