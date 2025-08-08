"use client";

import FadeInSection from "@/components/FadeInSection";
import Image from "next/image";
import React from "react";

const featureImgs = [
  {
    img: "/assets/images/home/feature-img-1.jpg",
    title: "Effortless Hotel Booking",
    description:
      "Easily find and reserve your ideal stay with our user-friendly platform no stress, no hassle, just smooth booking from start to finish.",
  },
  {
    img: "/assets/images/home/feature-img-2.jpg",
    title: "Best Price Guarantee",
    description:
      "If you find a better price elsewhere, we’ll match it to ensure you always get the best deal. If you find a better price elsewhere.",
  },
  {
    img: "/assets/images/home/feature-img-3.jpg",
    title: "Reviews & Ratings",
    description:
      "Hear what our guests have to say! Read honest reviews and real ratings from travelers who’ve stayed at our featured hotels.",
  },
];

export default function OurFeatures() {
  return (
    <FadeInSection>
      <div className="bg-white py-20">
        <div className="container">
          <p className="text-2xl">{"//"}Our Features</p>
          <h2 className="mt-3 text-4xl lg:text-5xl">
            Powerful Tools for <br className="hidden md:block" />
            Effortless Booking
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
            {featureImgs.map((item, index) => (
              <div
                key={index}
                className="group relative flex flex-col gap-4 overflow-hidden rounded-lg"
              >
                <Image
                  width={500}
                  height={500}
                  src={item.img}
                  alt={item.title}
                  className="h-auto w-full rounded-lg lg:h-[500px]"
                />
                <p className="absolute top-5 right-5 z-10 text-lg text-white">
                  {"//0"}
                  {index + 1}
                </p>

                {/* Dark overlay */}
                <div className="absolute inset-0 size-full bg-gradient-to-t from-black to-black/20"></div>

                {/* Sliding content */}
                <div className="absolute bottom-0 left-0 flex flex-col gap-8 px-4 pb-8 text-white transition-all duration-300 group-hover:translate-y-0 md:translate-y-[70%] lg:translate-y-[60%]">
                  <h3 className="text-2xl lg:text-3xl">{item.title}</h3>
                  <p className="text-lg">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </FadeInSection>
  );
}
