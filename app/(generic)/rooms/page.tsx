"use client";

import React, { useState, useEffect } from "react";
import RoomCard from "./components/RoomCard";
import { getPublicRooms } from "@/lib/api";
import { RoomType } from "@/lib/roomTypes";

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

export default function RoomPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await getPublicRooms();
      // Filter only available rooms for public display
      const availableRooms = response.data.filter((room: Room) => room.status === "available");
      setRooms(availableRooms);
      setError(null);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      setError("Failed to load rooms. Please try again later.");
      // Optionally, you could fall back to static data here
      // setRooms(staticRooms);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80dvh] bg-white py-20">
        <div className="container">
          <h2 className="mt-3 text-4xl lg:text-5xl">SweetHomes Rooms</h2>
          <div className="mt-10 flex items-center justify-center">
            <div className="size-8 animate-spin rounded-full border-2 border-gray-300 border-t-black"></div>
            <p className="ml-4 text-lg">Loading rooms...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[80dvh] bg-white py-20">
        <div className="container">
          <h2 className="mt-3 text-4xl lg:text-5xl">SweetHomes Rooms</h2>
          <div className="mt-10 text-center">
            <p className="text-lg text-red-600">{error}</p>
            <button
              onClick={fetchRooms}
              className="mt-4 rounded bg-black px-6 py-2 text-white hover:bg-gray-800"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80dvh] bg-white py-20">
      <div className="container">
        <h2 className="mt-3 text-4xl lg:text-5xl">SweetHomes Rooms</h2>
        {rooms.length === 0 ? (
          <div className="mt-10 text-center">
            <p className="text-lg text-gray-600">No rooms available at the moment.</p>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-1">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} roomId={room.id.toString()} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
