import React from "react";
import RoomCard from "./components/RoomCard";
import { rooms } from "@/lib/utils";

export default function RoomPage() {
  return (
    <div className="min-h-[80dvh] bg-white py-20">
      <div className="container">
        <h2 className="mt-3 text-4xl lg:text-5xl">SweetHomes Rooms</h2>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-1">
          {rooms.map((room, index) => (
            <RoomCard key={index} room={room} roomId={(index + 1).toString()} />
          ))}
        </div>
      </div>
    </div>
  );
}
