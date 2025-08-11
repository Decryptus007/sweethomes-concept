"use client";

import { Button } from "@/components/ui/button";
import {
  AirVent,
  Bed,
  Bubbles,
  Building2,
  Car,
  Coffee,
  LandPlot,
  Martini,
  SoapDispenserDroplet,
  Tv,
  UsersRound,
  Vault,
  Wifi,
} from "lucide-react";
import React from "react";

const AddOnsCard = ({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) => {
  return (
    <div className="bg-accent flex items-center justify-center gap-3 rounded-lg px-4 py-6 text-lg lg:text-xl">
      {icon}
      <p>{title}</p>
    </div>
  );
};

const features = [
  "2 luxurious king-size bed with premium bedding",
  "Spacious layout with elegant modern decor",
  "Panoramic city or pool views",
  "Direct access or close proximity to the pool",
  "Comfortable lounge area for relaxation or work",
  "Private balcony (select rooms)",
];

const amenities = [
  {
    icon: <Wifi className="size-6" />,
    title: "High-speed Wi-Fi",
  },
  {
    icon: <Tv className="size-6" />,
    title: "55” Smart LED TV",
  },
  {
    icon: <AirVent className="size-6" />,
    title: "Air conditioning with personal climate control",
  },
  {
    icon: <Vault className="size-6" />,
    title: "In-room safe",
  },
  {
    icon: <Coffee className="size-6" />,
    title: "Complimentary bottled water, coffee & tea",
  },
  {
    icon: <Martini className="size-6" />,
    title: "Mini-bar and room service",
  },
  {
    icon: <SoapDispenserDroplet className="size-6" />,
    title: "Luxurious en-suite bathroom with rain shower",
  },
  {
    icon: <Bubbles className="size-6" />,
    title: "Bathrobe, slippers, and hairdryer",
  },
];

export default function Description() {
  return (
    <div className="bg-white py-10">
      <div className="container">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          <AddOnsCard
            icon={<Car className="size-6" />}
            title="Free self parking"
          />
          <AddOnsCard
            icon={<LandPlot className="size-6" />}
            title="1880 sq ft"
          />
          <AddOnsCard
            icon={<UsersRound className="size-6" />}
            title="Sleeps 6"
          />
          <AddOnsCard
            icon={<Building2 className="size-6" />}
            title="City view"
          />
          <AddOnsCard icon={<Bed className="size-6" />} title="2 Bedroom" />
        </div>
        <div className="mt-8">
          <h3 className="text-3xl lg:text-4xl">Room Description</h3>
          <p className="mt-4 text-lg md:text-xl">
            Experience luxury and relaxation in our Premier Room featuring a
            plush king-size bed, floor-to-ceiling windows, and stunning
            panoramic views of the city skyline or poolside oasis. Perfect for
            both business and leisure travelers. Whether you&apos;re traveling
            for work or leisure, this room offers the perfect blend of elegance
            and functionality. Enjoy a cozy lounge area for reading or relaxing,
            a sleek work desk for productivity, and state-of-the-art amenities
            that cater to your every need. The modern en-suite bathroom boasts a
            rain shower, deluxe toiletries, and soft robes to enhance your
            comfort.
          </p>
        </div>
        <div className="mt-8">
          <h3 className="text-3xl lg:text-4xl">Room Features</h3>
          <ul className="mt-4 space-y-2 text-lg md:text-xl">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="text-black">•</span>
                <p>{feature}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-8">
          <h3 className="text-3xl lg:text-4xl">Amenities</h3>
          <div className="mt-4 space-y-2 text-lg md:text-xl">
            {amenities.map((amenity, index) => (
              <div key={index} className="flex gap-2">
                <span className="text-black">{amenity.icon}</span>
                <p>{amenity.title}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8">
          <div className="mt-2 flex gap-6">
            <Button size={"lg"} className="bg-black py-6 text-xl lg:py-8">
              Book Now
            </Button>
            <div className="">
              <h5 className="text-2xl md:text-3xl lg:text-4xl">$450</h5>
              <p className="text-sm md:text-base lg:text-xl">
                Per Night. Included vat & tax
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
