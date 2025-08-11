import Link from "next/link";
import React from "react";

export default function Hero() {
  return (
    <div
      className="relative overflow-hidden !bg-center pt-44 pb-16 text-white lg:min-h-[600px] lg:pt-56 lg:pb-20"
      style={{
        background: `linear-gradient(to right, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.4) 80%), url('/assets/images/rooms/room-main-hero.jpg') left center/cover no-repeat`,
      }}
    >
      <div className="container">
        <div className="flex flex-col gap-6">
          <h2 className="text-5xl font-bold md:text-6xl lg:text-7xl">
            Deluxe Room – King Bed, Poolside
          </h2>
          <div className="flex items-center gap-2 text-lg lg:text-xl">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <span>/</span>
            <span>Room Details</span>
          </div>
        </div>
      </div>
    </div>
  );
}
