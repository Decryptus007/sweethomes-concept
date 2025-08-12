"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Bed,
  Building2,
  Car,
  ChevronLeft,
  ChevronRight,
  LandPlot,
  UsersRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

type RoomCardProps = {
  room: {
    images: string[];
    name: string;
    description: {
      park: string;
      size: string;
      sleeps: string;
      view: string;
      bed: string;
    };
  };
  roomId: string;
};

export default function RoomCard({ room, roomId }: RoomCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextImage = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImageIndex((prev) => (prev + 1) % room.images.length);
      setIsTransitioning(false);
    }, 150);
  };

  const prevImage = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImageIndex(
        (prev) => (prev - 1 + room.images.length) % room.images.length,
      );
      setIsTransitioning(false);
    }, 150);
  };

  return (
    <div className="border-primary bg-muted grid grid-cols-1 gap-4 rounded-lg border p-2 md:p-4 lg:grid-cols-12 lg:gap-x-8 lg:p-6">
      <div className="group relative col-span-12 h-full lg:col-span-4">
        <div className="relative h-64 overflow-hidden rounded-lg md:h-80 lg:h-full">
          <Image
            width={500}
            height={500}
            src={room.images[currentImageIndex]}
            alt={room.name}
            className={`h-full w-full rounded-lg object-cover transition-opacity duration-300 ${
              isTransitioning ? "opacity-0" : "opacity-100"
            }`}
          />

          {/* Navigation buttons */}
          {room.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 hover:bg-black/70"
                disabled={isTransitioning}
              >
                <ChevronLeft className="size-4 md:size-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 hover:bg-black/70"
                disabled={isTransitioning}
              >
                <ChevronRight className="size-4 md:size-5" />
              </button>
            </>
          )}

          {/* Image indicators */}
          {room.images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
              {room.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (!isTransitioning) {
                      setIsTransitioning(true);
                      setTimeout(() => {
                        setCurrentImageIndex(index);
                        setIsTransitioning(false);
                      }, 150);
                    }
                  }}
                  className={`h-2 w-2 rounded-full transition-all duration-200 ${
                    index === currentImageIndex
                      ? "bg-white"
                      : "bg-white/50 hover:bg-white/75"
                  }`}
                  disabled={isTransitioning}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="col-span-12 flex flex-col gap-4 lg:col-span-8">
        <h3 className="truncate text-2xl md:text-3xl lg:text-4xl">
          {room.name}
        </h3>
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <Car className="size-5 md:size-6 lg:size-7" />
            <p className="text-sm md:text-base lg:text-xl">
              {room.description.park}
            </p>
          </div>
          <div className="flex gap-2">
            <LandPlot className="size-5 md:size-6 lg:size-7" />
            <p className="text-sm md:text-base lg:text-xl">
              {room.description.size}
            </p>
          </div>
          <div className="flex gap-2">
            <UsersRound className="size-5 md:size-6 lg:size-7" />
            <p className="text-sm md:text-base lg:text-xl">
              {room.description.sleeps}
            </p>
          </div>
          <div className="flex gap-2">
            <Building2 className="size-5 md:size-6 lg:size-7" />
            <p className="text-sm md:text-base lg:text-xl">
              {room.description.view}
            </p>
          </div>
          <div className="flex gap-2">
            <Bed className="size-5 md:size-6 lg:size-7" />
            <p className="text-sm md:text-base lg:text-xl">
              {room.description.bed}
            </p>
          </div>
          <Link
            href={`/rooms/${roomId}`}
            className="mt-4 flex w-fit items-center gap-2 transition-all hover:gap-4 hover:underline"
          >
            <p className="text-xl">More Details</p>
            <ArrowRight className="size-5 md:size-6 lg:size-7" />
          </Link>
        </div>
        <div className="mt-2 flex items-end justify-between">
          <Button size={"lg"} className="bg-black py-6 text-xl lg:py-8">
            Reserve Now
          </Button>
          <div className="">
            <h5 className="text-2xl md:text-3xl lg:text-4xl">$2,000</h5>
            <p className="text-sm md:text-base lg:text-xl">
              Per Night. Included
            </p>
            <p className="text-sm md:text-base lg:text-xl">vat & tax</p>
          </div>
        </div>
      </div>
    </div>
  );
}
