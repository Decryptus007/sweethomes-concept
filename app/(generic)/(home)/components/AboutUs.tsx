import FadeInSection from "@/components/FadeInSection";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";

export default function AboutUs() {
  return (
    <FadeInSection>
      <div className="bg-transparent py-20">
        <div className="container">
          <p className="text-2xl">{"//"}About Us</p>
          <h2 className="mt-3 text-4xl lg:text-5xl">
            Your Journey Starts <br className="hidden md:block" />
            With SweetHomes
          </h2>
          <div className="relative mt-12 flex h-[500px] w-full items-end overflow-hidden rounded-xl p-2 md:h-[600px] md:p-4 lg:p-8">
            <Image
              src="/assets/images/new/Who we are .jpg"
              alt="About Us"
              fill
              className="object-cover"
            />
            <div className="relative z-10 flex flex-col gap-4 rounded-lg bg-white p-4 md:w-2/3 md:p-6 lg:w-1/2 lg:p-8">
              <h3 className="text-2xl md:text-3xl">Who We Are</h3>
              <p className="text-lg">
                We are dedicated to making hotel booking seamless, reliable, and
                tailored to your needs. Whether you&apos;re planning a luxury
                getaway, a business trip, or a budget-friendly stay.
              </p>
              <Button
                variant={"secondary"}
                size={"lg"}
                className="w-fit py-4 text-lg md:py-6"
              >
                More About Us
              </Button>
            </div>
          </div>
        </div>
      </div>
    </FadeInSection>
  );
}
