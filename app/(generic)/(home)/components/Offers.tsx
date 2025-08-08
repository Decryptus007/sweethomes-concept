import FadeInSection from "@/components/FadeInSection";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";

export default function Offers() {
  return (
    <div className="bg-white py-20">
      <div className="container">
        <div className="grid grid-cols-12 lg:gap-12">
          <div className="col-span-2 hidden h-full items-center justify-center lg:flex">
            <Image
              width={500}
              height={500}
              src="/assets/images/home/offer-1.jpg"
              alt="Offers"
              className="h-auto w-full rounded-lg"
            />
          </div>
          <div className="bg-background col-span-12 flex flex-col gap-4 rounded-lg px-4 py-8 lg:col-span-8 lg:h-[700px] lg:items-center lg:justify-center lg:rounded-full lg:text-center xl:h-[850px]">
            <FadeInSection>
              <p className="text-2xl">{"//"}Offers</p>
              <h2 className="text-4xl lg:text-5xl">
                Book With Confidence,
                <br />
                Travel With Ease
              </h2>
              <Button
                variant={"secondary"}
                size={"lg"}
                className="mt-6 w-fit py-6 text-lg md:py-8"
              >
                Grab This Deal
              </Button>
            </FadeInSection>
          </div>
          <div className="col-span-2 hidden h-full items-center justify-center lg:flex">
            <Image
              width={500}
              height={500}
              src="/assets/images/home/offer-2.jpg"
              alt="Offers"
              className="h-auto w-full rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
