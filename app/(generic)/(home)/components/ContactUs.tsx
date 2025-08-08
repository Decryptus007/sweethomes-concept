"use client";

import FadeInSection from "@/components/FadeInSection";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import React from "react";
import { DatePicker } from "./DatePicker";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

export default function ContactUs() {
  const [date, setDate] = React.useState<Date>();

  return (
    <FadeInSection>
      <div className="bg-white py-20">
        <div className="container">
          <p className="text-2xl">{"//"}Contact Us</p>
          <h2 className="mt-3 text-4xl lg:text-5xl">Talk to our Front Desk</h2>
          <div className="mt-8 grid grid-cols-12 lg:gap-x-10 xl:gap-x-12">
            <Image
              width={500}
              height={500}
              src="/assets/images/home/contact-img.jpg"
              alt="Contact Us"
              className="col-span-12 hidden h-auto w-full rounded-lg lg:col-span-4 lg:block lg:h-full"
            />
            <form className="bg-background col-span-12 flex flex-col gap-4 rounded-lg p-4 md:p-6 lg:col-span-8 lg:p-8">
              <h5 className="text-2xl md:text-3xl">Fill the Form Below</h5>
              <div className="mt-2 grid grid-cols-12 gap-4">
                <Input
                  type="text"
                  placeholder="Your Name"
                  className="col-span-12 h-[50px] rounded-sm border-0 bg-white !text-lg md:col-span-6"
                />
                <Input
                  type="email"
                  placeholder="Your Email"
                  className="col-span-12 h-[50px] rounded-sm border-0 bg-white !text-lg md:col-span-6"
                />
                <Input
                  type="number"
                  placeholder="Phone"
                  className="col-span-12 h-[50px] rounded-sm border-0 bg-white !text-lg md:col-span-6"
                />
                <DatePicker
                  date={date}
                  setDate={setDate}
                  className="col-span-12 h-[50px] rounded-sm border-0 bg-white !text-lg md:col-span-6"
                />
                <Textarea
                  placeholder="Your Message"
                  className="col-span-12 !h-[150px] resize-none rounded-sm border-0 bg-white !text-lg"
                />
                {/* Checkbox to agree to privacy policy */}
                <div className="col-span-12 flex items-center gap-2">
                  <Checkbox id="terms" className="size-5" />
                  <p className="text-lg">I agree to the Privacy Policy</p>
                </div>
                <Button
                  size={"lg"}
                  className="col-span-12 mt-4 w-full py-6 text-lg lg:py-8"
                >
                  Send Message Now
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </FadeInSection>
  );
}
