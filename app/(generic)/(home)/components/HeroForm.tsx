"use client";

import { BedDouble, CalendarRange, UsersRound } from "lucide-react";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DatePicker } from "./DatePicker";

export default function HeroForm() {
  const [checkIn, setCheckIn] = React.useState<Date>();
  const [checkOut, setCheckOut] = React.useState<Date>();

  return (
    <div className="mt-8 rounded-lg bg-black/80 px-4 py-6 md:px-8 md:py-10">
      <h2 className="text-2xl text-white md:text-4xl">
        Ready to Find a Great Room Deal?
      </h2>
      <p className="mt-4 text-lg text-white md:text-xl">
        Book a room with SweetHomes and get discounts
      </p>
      <form action="" className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="flex items-center gap-2 rounded-lg bg-white p-2 md:gap-4 md:p-4">
          <BedDouble className="size-6" />
          <div className="flex w-full flex-col">
            <label className="pl-3">Room Type</label>
            <Select>
              <SelectTrigger className="w-full border-0 text-lg font-semibold focus-visible:ring-0">
                <SelectValue placeholder="Select a room type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single" className="text-lg">
                  Single
                </SelectItem>
                <SelectItem value="double" className="text-lg">
                  Double
                </SelectItem>
                <SelectItem value="suite" className="text-lg">
                  Suite
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-white p-2 md:gap-4 md:p-4">
          <CalendarRange className="size-6" />
          <div className="grid w-full grid-cols-2">
            <div className="border-r pr-1 md:pr-2">
              <label className="pl-1 md:pl-4">Check-in</label>
              <DatePicker date={checkIn} setDate={setCheckIn} />
            </div>
            <div className="pl-1 md:pl-2">
              <label className="pl-1 md:pl-4">Check-out</label>
              <DatePicker date={checkOut} setDate={setCheckOut} />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-white p-2 md:gap-4 md:p-4">
          <UsersRound className="size-6" />
          <div className="flex w-full flex-col">
            <label className="pl-3">Guests and Rooms</label>
            <Select>
              <SelectTrigger className="w-full border-0 text-lg font-semibold focus-visible:ring-0">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-1" className="text-lg">
                  1 Guest, 1 Room
                </SelectItem>
                <SelectItem value="2-1" className="text-lg">
                  2 Guests, 1 Room
                </SelectItem>
                <SelectItem value="2-2" className="text-lg">
                  2 Guests, 2 Rooms
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button className="h-full md:text-lg lg:text-2xl">Book Now</Button>
      </form>
    </div>
  );
}
