"use client";

import Image from "next/image";
import React from "react";

const ProcessCard = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="bg-accent-foreground relative flex flex-col gap-4 rounded-lg py-4">
      <h3 className="px-2 text-2xl md:px-4">{title}</h3>
      <div className="border-accent w-full border-b"></div>
      <p className="px-2 text-lg md:px-4">{description}</p>
    </div>
  );
};

export default function BookingProcess() {
  return (
    <div className="relative min-h-[500px] bg-black text-white">
      {/* Fixed Background */}
      <div className="pointer-events-none absolute inset-0 h-full w-full">
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="/assets/images/home/booking-process-poster.jpg"
        >
          <source
            src="/assets/videos/home/booking-process-ad.mp4"
            type="video/mp4"
          />
          <Image
            width={500}
            height={500}
            src="/assets/images/home/booking-process-poster.jpg"
            alt="Booking Process Background"
            className="h-full w-full object-cover"
          />
        </video>

        {/* Optional dark overlay for readability */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 h-full py-20">
        <div className="container">
          <div className="sticky top-[100px]">
            <p className="text-2xl">{"//"}Booking Process</p>
            <h2 className="mt-3 text-4xl lg:text-5xl">
              Effortless Booking <br className="hidden md:block" />
              for Every Trip
            </h2>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-y-4 lg:grid-cols-2 lg:gap-y-10 lg:pl-64">
            <div className="hidden lg:block"></div>
            <ProcessCard
              title="Flexible Payment Options"
              description="We offer a variety of flexible payment methods to make your booking experience as smooth possible. Choose from credit cards, debit cards."
            />
            <ProcessCard
              title="Changes & Cancellations"
              description="Enjoy peace of mind knowing that your changes are just a few clicks away. Our flexible designed to fit your travel needs without any added stress."
            />
            <div className="hidden lg:block"></div>
            <div className="hidden lg:block"></div>
            <ProcessCard
              title="Instant Confirmation"
              description="The moment your reservation is made. No waiting, no uncertainty just peace of mind knowing your stay is secured. Whether you're booking."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
