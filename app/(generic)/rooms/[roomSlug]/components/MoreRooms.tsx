import React from "react";
import RoomCard from "../../components/RoomCard";
import { rooms } from "@/lib/utils";

export default function MoreRooms() {
  return (
    <div className="bg-white py-10">
      <div className="container">
        <h3 className="text-4xl lg:text-5xl">More Rooms</h3>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-1">
          {rooms.map((room, index) => (
            <RoomCard key={index} room={room} roomId={(index + 1).toString()} />
          ))}
        </div>
      </div>
    </div>
  );
}
