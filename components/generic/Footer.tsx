import { Dribbble, Facebook, Home, Instagram } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-secondary min-h-[400px] py-20 text-white">
      <div className="container">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-center gap-1">
            <Home className="size-8" />
            <h1 className="text-2xl font-bold">SweetHomes</h1>
          </div>
          <h1 className="text-center text-5xl lg:text-8xl">
            Experience comfort <br />
            worldwide
          </h1>
          <div className="flex items-center justify-center gap-2 md:gap-4">
            <Button
              asChild
              variant={"outline"}
              size={"lg"}
              className="size-14 rounded-full bg-transparent"
            >
              <Link href="/">
                <Facebook className="size-6" />
              </Link>
            </Button>
            <Button
              asChild
              variant={"outline"}
              size={"lg"}
              className="size-14 rounded-full bg-transparent"
            >
              <Link href="/">
                <Dribbble className="size-6" />
              </Link>
            </Button>
            <Button
              asChild
              variant={"outline"}
              size={"lg"}
              className="size-14 rounded-full bg-transparent"
            >
              <Link href="/">
                <Instagram className="size-6" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="my-10 border-b"></div>
        <div className="grid grid-cols-1 gap-x-0 gap-y-8 md:col-span-2 lg:grid-cols-4 lg:gap-x-4 lg:gap-y-0">
          <div className="">
            <h3 className="text-3xl md:text-4xl">Address</h3>
            <p className="mt-4 text-lg md:text-xl">
              123 Main Street, City, Country
            </p>
          </div>
          <div className="">
            <h3 className="text-3xl md:text-4xl">Quick Links</h3>
            <div className="mt-4 flex flex-col gap-3">
              <Link href={"/"} className="text-lg hover:underline md:text-xl">
                Home
              </Link>
              <Link href={"/"} className="text-lg hover:underline md:text-xl">
                Rooms
              </Link>
            </div>
          </div>
          <div className="">
            <h3 className="text-3xl md:text-4xl">Contact</h3>
            <div className="mt-4 flex flex-col gap-3">
              <Link href={"/"} className="text-lg hover:underline md:text-xl">
                example@gmail.com
              </Link>
              <Link href={"/"} className="text-lg hover:underline md:text-xl">
                +1 1234567890
              </Link>
            </div>
          </div>
          <div className="">
            <h3 className="text-3xl md:text-4xl">Utility Pages</h3>
            <div className="mt-4 flex flex-col gap-3">
              <Link href={"/"} className="text-lg hover:underline md:text-xl">
                Password Protected
              </Link>
              <Link href={"/"} className="text-lg hover:underline md:text-xl">
                +1 1234567890
              </Link>
            </div>
          </div>
        </div>
        <div className="my-10 border-b"></div>
        <div className="flex items-center justify-center text-center">
          <p className="text-lg md:text-xl">
            Copyright © {new Date().getFullYear()} SweetHomes. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
