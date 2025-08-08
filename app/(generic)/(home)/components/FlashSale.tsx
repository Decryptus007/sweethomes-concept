import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";

export default function FlashSale() {
  return (
    <div className="relative h-[500px] overflow-hidden">
      {/* Video Background */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster="/assets/images/home/flash-sale-poster.jpg" // Image fallback while video loads
      >
        <source src="/assets/videos/home/flash-sale-ad.mp4" type="video/mp4" />
        {/* Real fallback if video can't load */}
        <Image
          width={500}
          height={500}
          src="/assets/images/home/flash-sale-poster.jpg"
          alt="Flash Sale Background"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </video>

      {/* Overlay */}
      <div className="relative z-10 h-full w-full bg-black/50 py-20">
        <div className="container flex h-full flex-col justify-center gap-6 text-white">
          <h2 className="text-4xl lg:text-5xl">
            Flash Sale! Book Now <br className="hidden md:block" />
            Before It’s Gone!
          </h2>
          <Button
            variant={"ghost"}
            size={"lg"}
            className="text-primary w-fit bg-white py-4 text-lg md:py-6"
          >
            Grab this Deal
          </Button>
        </div>
      </div>
    </div>
  );
}
