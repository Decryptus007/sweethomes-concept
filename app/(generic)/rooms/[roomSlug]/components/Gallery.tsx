"use client";

import { Star } from "lucide-react";
import Image from "next/image";
import React from "react";

export default function Gallery() {
  return (
    <div className="bg-white pt-20">
      <div className="container">
        <p className="text-lg md:text-xl">
          Rating: 4.6 <Star className="mb-1 inline-block" />
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="col-span-12 lg:col-span-8">
            <div className="relative overflow-hidden rounded-lg">
              <Image
                width={500}
                height={500}
                src="/assets/images/rooms/generic-2-1.jpg"
                alt="Room"
                className="h-full w-full"
              />
            </div>
          </div>
          <div className="col-span-12 mt-4 grid grid-cols-1 gap-4 lg:col-span-4 lg:mt-0">
            <div className="relative overflow-hidden rounded-lg">
              <Image
                width={500}
                height={500}
                src="/assets/images/rooms/generic-1-2.jpg"
                alt="Room"
                className="h-full w-full"
              />
            </div>
            <div className="relative overflow-hidden rounded-lg">
              <Image
                width={500}
                height={500}
                src="/assets/images/rooms/generic-1-3.jpg"
                alt="Room"
                className="h-full w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
