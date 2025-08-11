import React from "react";
import Hero from "./components/Hero";
import Gallery from "./components/Gallery";
import Description from "./components/Description";
import MoreRooms from "./components/MoreRooms";

export default function RoomDetailsPage() {
  return (
    <div>
      <Hero />
      <Gallery />
      <Description />
      <MoreRooms />
    </div>
  );
}
