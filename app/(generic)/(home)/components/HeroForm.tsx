"use client";

import { BedDouble, CalendarRange, UsersRound } from "lucide-react";
import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DatePicker } from "./DatePicker";
import { getPublicRooms } from "@/lib/api";
import { RoomType } from "@/lib/roomTypes";
import { addDays, startOfDay } from "date-fns";
import { GuestBookingModal } from "@/components/GuestBookingModal";
import toast from "react-hot-toast";

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

interface RoomTypeInfo {
  type: string;
  count: number;
  minPrice: number;
  sampleRoomId: number; // Add sample room ID for booking
}

export default function HeroForm() {
  const [checkIn, setCheckIn] = React.useState<Date>();
  const [checkOut, setCheckOut] = React.useState<Date>();
  const [selectedRoomType, setSelectedRoomType] = useState<string>("");
  const [selectedGuests, setSelectedGuests] = useState<string>("");
  const [roomTypeInfo, setRoomTypeInfo] = useState<RoomTypeInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingData, setBookingData] = useState<{
    room_id: number;
    room_name: string;
    room_price: number;
    price_per_night: number;
    number_of_nights: number;
    check_in: string;
    check_out: string;
    adults: number;
    children: number;
    special_requests?: string;
  } | null>(null);

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  // Reset checkout date if it becomes invalid when checkin changes
  useEffect(() => {
    if (checkIn && checkOut && checkOut <= checkIn) {
      setCheckOut(undefined);
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.checkOut;
        return newErrors;
      });
    }
  }, [checkIn, checkOut]);

  // Clear errors when user makes selections
  useEffect(() => {
    if (selectedRoomType) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.roomType;
        return newErrors;
      });
    }
  }, [selectedRoomType]);

  useEffect(() => {
    if (checkIn) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.checkIn;
        return newErrors;
      });
    }
  }, [checkIn]);

  useEffect(() => {
    if (checkOut) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.checkOut;
        return newErrors;
      });
    }
  }, [checkOut]);

  useEffect(() => {
    if (selectedGuests) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.guests;
        return newErrors;
      });
    }
  }, [selectedGuests]);

  const fetchRoomTypes = async () => {
    try {
      const response = await getPublicRooms();
      // Extract room type information from available rooms
      const availableRooms = response.data.filter((room: Room) => room.status === "available");

      // Group rooms by type and calculate statistics
      const typeMap = new Map<string, { rooms: Room[], minPrice: number, sampleRoomId: number }>();

      availableRooms.forEach((room: Room) => {
        if (!typeMap.has(room.type)) {
          typeMap.set(room.type, { rooms: [], minPrice: room.price_per_night, sampleRoomId: room.id });
        }
        const typeData = typeMap.get(room.type)!;
        typeData.rooms.push(room);
        typeData.minPrice = Math.min(typeData.minPrice, room.price_per_night);
      });

      // Convert to array format
      const roomTypes: RoomTypeInfo[] = Array.from(typeMap.entries()).map(([type, data]) => ({
        type,
        count: data.rooms.length,
        minPrice: data.minPrice,
        sampleRoomId: data.sampleRoomId
      }));

      setRoomTypeInfo(roomTypes);
    } catch (error) {
      console.error("Error fetching room types:", error);
      // Fallback to default room types if API fails
      setRoomTypeInfo([
        { type: "Standard", count: 0, minPrice: 0, sampleRoomId: 1 },
        { type: "Deluxe", count: 0, minPrice: 0, sampleRoomId: 1 },
        { type: "Suite", count: 0, minPrice: 0, sampleRoomId: 1 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Format room type for display
  const formatRoomType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Format price for display
  const formatPrice = (price: number) => {
    if (price === 0) return "";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Get today's date (start of day to avoid time issues)
  const today = startOfDay(new Date());

  // Calculate minimum checkout date (day after checkin)
  const minCheckoutDate = checkIn ? addDays(checkIn, 1) : addDays(today, 1);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page refresh

    // Reset errors
    setErrors({});

    // Validate form data
    const newErrors: { [key: string]: string } = {};

    if (!selectedRoomType) {
      newErrors.roomType = "Please select a room type";
    }

    if (!checkIn) {
      newErrors.checkIn = "Please select a check-in date";
    }

    if (!checkOut) {
      newErrors.checkOut = "Please select a check-out date";
    } else if (checkIn && checkOut <= checkIn) {
      newErrors.checkOut = "Check-out date must be after check-in date";
    }

    if (!selectedGuests) {
      newErrors.guests = "Please select number of guests";
    }

    // If there are errors, set them and return
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Here you can handle the booking logic
    console.log("Booking details:", {
      roomType: selectedRoomType,
      checkIn,
      checkOut,
      guests: selectedGuests
    });

    // Find the selected room type info to get room details
    const selectedRoomInfo = roomTypeInfo.find(room => room.type === selectedRoomType);
    if (!selectedRoomInfo) {
      toast.error("Selected room type not found. Please try again.");
      return;
    }

    // Parse guest selection (format: "adults-rooms")
    const [adults] = selectedGuests.split('-').map(Number);

    // Calculate number of nights
    const checkInDate = new Date(checkIn!);
    const checkOutDate = new Date(checkOut!);
    const timeDifference = checkOutDate.getTime() - checkInDate.getTime();
    const numberOfNights = Math.ceil(timeDifference / (1000 * 3600 * 24));

    // Calculate total price (price per night * number of nights)
    const totalPrice = selectedRoomInfo.minPrice * numberOfNights;

    // Prepare booking data
    const booking = {
      room_id: selectedRoomInfo.sampleRoomId, // Use actual room ID from API
      room_name: formatRoomType(selectedRoomType),
      room_price: totalPrice, // Total price for all nights
      price_per_night: selectedRoomInfo.minPrice, // Keep original price per night
      number_of_nights: numberOfNights,
      check_in: checkIn!.toISOString().split('T')[0], // Format as YYYY-MM-DD
      check_out: checkOut!.toISOString().split('T')[0], // Format as YYYY-MM-DD
      adults: adults,
      children: 0, // Default to 0 children for now
      special_requests: "",
    };

    setBookingData(booking);
    setIsBookingModalOpen(true);
  };

  return (
    <div className="mt-8 rounded-lg bg-black/80 px-4 py-6 md:px-8 md:py-10">
      <h2 className="text-2xl text-white md:text-4xl">
        Ready to Find a Great Room Deal?
      </h2>
      <p className="mt-4 text-lg text-white md:text-xl">
        Book a room with SweetHomes and get discounts
      </p>
      {Object.keys(errors).length > 0 && (
        <div className="mt-4 rounded-lg bg-red-100 border border-red-300 p-3">
          <p className="text-red-700 text-sm font-medium">Please fix the following errors:</p>
          <ul className="mt-1 text-red-600 text-sm list-disc list-inside">
            {Object.values(errors).map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="flex items-center gap-2 rounded-lg bg-white p-2 md:gap-4 md:p-4">
          <BedDouble className="size-6" />
          <div className="flex w-full flex-col">
            <label className="pl-3">Choose Your Room</label>
            <Select disabled={loading} value={selectedRoomType} onValueChange={setSelectedRoomType}>
              <SelectTrigger className={`w-full border-0 text-lg font-semibold focus-visible:ring-0 ${errors.roomType ? 'text-red-500' : ''}`}>
                <SelectValue placeholder={loading ? "Loading rooms..." : "Select your room type"} />
              </SelectTrigger>
              <SelectContent>
                {loading ? (
                  <SelectItem value="loading" disabled className="text-lg text-gray-500">
                    <div className="flex items-center gap-2">
                      <div className="size-4 animate-spin rounded-full border-2 border-gray-300 border-t-black"></div>
                      Loading room types...
                    </div>
                  </SelectItem>
                ) : (
                  <>
                    {roomTypeInfo.map((roomType) => (
                      <SelectItem key={roomType.type} value={roomType.type} className="text-lg">
                        {formatRoomType(roomType.type)} ({roomType.count} available)
                        {roomType.minPrice > 0 && ` - from ${formatPrice(roomType.minPrice)}`}
                      </SelectItem>
                    ))}
                    {roomTypeInfo.length === 0 && (
                      <SelectItem value="no-rooms" disabled className="text-lg text-gray-500">
                        No rooms available
                      </SelectItem>
                    )}
                  </>
                )}
              </SelectContent>
            </Select>
            {errors.roomType && <p className="mt-1 text-xs text-red-500 pl-3">{errors.roomType}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-white p-2 md:gap-4 md:p-4">
          <CalendarRange className="size-6" />
          <div className="grid w-full grid-cols-2">
            <div className="border-r pr-1 md:pr-2">
              <label className="pl-1 md:pl-4">Check-in</label>
              <DatePicker
                date={checkIn}
                setDate={setCheckIn}
                minDate={today}
                placeholder="Select date"
              />
              {errors.checkIn && <p className="mt-1 text-xs text-red-500 pl-1 md:pl-4">{errors.checkIn}</p>}
            </div>
            <div className="pl-1 md:pl-2">
              <label className="pl-1 md:pl-4">Check-out</label>
              <DatePicker
                date={checkOut}
                setDate={setCheckOut}
                minDate={minCheckoutDate}
                placeholder="Select date"
              />
              {errors.checkOut && <p className="mt-1 text-xs text-red-500 pl-1 md:pl-4">{errors.checkOut}</p>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-white p-2 md:gap-4 md:p-4">
          <UsersRound className="size-6" />
          <div className="flex w-full flex-col">
            <label className="pl-3">Guests and Rooms</label>
            <Select value={selectedGuests} onValueChange={setSelectedGuests}>
              <SelectTrigger className="w-full border-0 text-lg font-semibold focus-visible:ring-0">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-1" className="text-lg">
                  1 Guest, 1 Room
                </SelectItem>
                <SelectItem value="2-1" className="text-lg">
                  2 Guests, 1 Room
                </SelectItem>
                <SelectItem value="2-2" className="text-lg">
                  2 Guests, 2 Rooms
                </SelectItem>
                <SelectItem value="3-1" className="text-lg">
                  3 Guests, 1 Room
                </SelectItem>
                <SelectItem value="4-1" className="text-lg">
                  4 Guests, 1 Room
                </SelectItem>
                <SelectItem value="4-2" className="text-lg">
                  4 Guests, 2 Rooms
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.guests && <p className="mt-1 text-xs text-red-500 pl-3">{errors.guests}</p>}
          </div>
        </div>
        <Button
          type="submit"
          className="h-full md:text-lg lg:text-2xl"
          disabled={loading || isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="size-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              Processing...
            </div>
          ) : (
            "Book Now"
          )}
        </Button>
      </form>

      {/* Booking Modal */}
      <GuestBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          // Reset form after successful booking
          setSelectedRoomType("");
          setSelectedGuests("");
          setCheckIn(undefined);
          setCheckOut(undefined);
          setBookingData(null);
        }}
        bookingData={bookingData}
      />
    </div>
  );
}
