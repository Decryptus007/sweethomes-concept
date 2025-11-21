"use client";

import FadeInSection from "@/components/FadeInSection";
import Image from "next/image";
import React, { useState } from "react";

const TestimonialCard = ({
  title,
  comment,
  active,
}: {
  title: string;
  comment: string;
  active?: boolean;
}) => {
  return (
    <div
      className={`bg-accent border-primary relative flex w-[90%] flex-col gap-8 rounded-lg border p-4 transition-all duration-300 md:w-2/3 md:p-6 lg:w-1/2 lg:p-8 xl:w-2/5 ${active ? "scale-100 opacity-100" : "absolute scale-90 opacity-0"}`}
    >
      <h3 className="text-2xl md:text-3xl">{title}</h3>
      <p className="text-lg">{comment}</p>
      <div className="flex items-center gap-2">
        <Image
          width={500}
          height={500}
          src="/assets/images/new/John Doe profile picture .jpg"
          alt="Testimonial Avatar"
          className="size-14 rounded-full"
        />
        <h4 className="text-lg">John Doe</h4>
      </div>
    </div>
  );
};

export default function Testimonials() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials = [
    {
      title: "Enjoy Stress-Free Travel from Search to Stay!",
      comment:
        "Booking with Staylo was the best decision for my trip! The process was super easy, and I loved how I could compare hotels with real reviews and the best prices. My stay was exactly as described, and I even got a free upgrade.",
    },
    {
      title: "Exceptional Service Every Time",
      comment:
        "I've used Staylo for multiple trips and they never disappoint. The customer service is outstanding and they always find me the best deals. Highly recommended for any traveler!",
    },
    {
      title: "Made My Vacation Perfect",
      comment:
        "The hotel recommended by Staylo was perfect for our family vacation. Great location, amazing amenities, and the booking process took less than 5 minutes. Will definitely use them again!",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1,
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1,
    );
  };

  return (
    <div className="bg-white py-20">
      <div className="container">
        <FadeInSection>
          <p className="text-2xl">{"//"}Testimonials</p>
          <h2 className="mt-3 text-4xl lg:text-5xl">
            What Our Satisfied <br className="hidden md:block" />
            Clients Say
          </h2>
        </FadeInSection>
      </div>

      <div className="relative mt-10 flex min-h-[600px] items-center bg-[url('/assets/images/home/testimonial-bg-1.webp')] bg-cover bg-center py-20">
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Carousel Container */}
        <div className="relative mx-auto flex h-full w-full max-w-6xl items-center justify-center">
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 z-10 cursor-pointer rounded-full bg-white/30 p-2 backdrop-blur-sm transition-all hover:bg-white/50 md:left-8"
            aria-label="Previous testimonial"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Testimonial Slides */}
          <div className="relative h-full w-full overflow-hidden">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`flex h-full w-full items-center justify-center transition-all duration-500 ${index === currentSlide ? "opacity-100" : "absolute opacity-0"}`}
              >
                <TestimonialCard
                  title={testimonial.title}
                  comment={testimonial.comment}
                  active={index === currentSlide}
                />
              </div>
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="absolute right-4 z-10 cursor-pointer rounded-full bg-white/30 p-2 backdrop-blur-sm transition-all hover:bg-white/50 md:right-8"
            aria-label="Next testimonial"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Indicators */}
        <div className="absolute right-0 bottom-8 left-0 flex justify-center gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 w-2 rounded-full transition-all ${index === currentSlide ? "w-6 bg-white" : "w-2 bg-white/50"}`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
