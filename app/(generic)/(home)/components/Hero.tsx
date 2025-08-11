"use client";

import React, { useState, useEffect } from "react";
import HeroForm from "./HeroForm";

export default function Hero() {
  const images = [
    "/assets/images/home/hero-1.jpg",
    "/assets/images/home/hero-2.jpg",
    "/assets/images/home/hero-3.jpg",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [nextImageIndex, setNextImageIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionType, setTransitionType] = useState("fade");

  // Transition types
  const transitions = ["fade", "slideUp", "rollUp", "zoom"];

  useEffect(() => {
    const interval = setInterval(() => {
      const next = (currentImageIndex + 1) % images.length;
      setNextImageIndex(next);
      setTransitionType(
        transitions[Math.floor(Math.random() * transitions.length)],
      );
      setIsTransitioning(true);

      setTimeout(() => {
        setCurrentImageIndex(next);
        setIsTransitioning(false);
      }, 800);
    }, 4000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentImageIndex]);

  const getNextImageTransitionClasses = () => {
    if (!isTransitioning) {
      switch (transitionType) {
        case "fade":
          return "opacity-0 transform scale-100 translate-y-0";
        case "slideUp":
          return "opacity-0 transform scale-100 translate-y-8";
        case "rollUp":
          return "opacity-0 transform scale-95 translate-y-12 rotate-1";
        case "zoom":
          return "opacity-0 transform scale-110 translate-y-0";
        default:
          return "opacity-0 transform scale-100 translate-y-0";
      }
    }

    return "opacity-100 transform scale-100 translate-y-0 rotate-0";
  };

  return (
    <div className="relative min-h-[700px] overflow-hidden pt-44 pb-16 lg:pt-56 lg:pb-20">
      {/* Current Background Image */}
      <div
        className="absolute inset-0 transition-opacity duration-800 ease-in-out"
        style={{
          background: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${images[currentImageIndex]}) center center/cover no-repeat`,
        }}
      />

      {/* Next Background Image (for transitions) */}
      <div
        className={`absolute inset-0 transition-all duration-800 ease-in-out ${getNextImageTransitionClasses()}`}
        style={{
          background: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${images[nextImageIndex]}) center center/cover no-repeat`,
        }}
      />

      {/* Hero Content */}
      <div className="relative z-10 container flex h-full flex-col justify-center gap-6">
        <h1 className="text-4xl leading-12 text-white md:text-5xl lg:text-7xl lg:leading-20">
          Your Next Getaway Is <br className="hidden lg:block" />
          Just a Click Away
        </h1>
        <HeroForm />
      </div>
    </div>
  );
}
