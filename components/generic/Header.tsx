"use client";

import { useEffect, useState } from "react";
import { Home } from "lucide-react";
import Link from "next/link";
import React from "react";
import clsx from "clsx"; // Optional: use clsx for cleaner class toggling
import { usePathname } from "next/navigation";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10); // Adjust threshold as needed
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={clsx(
        "fixed inset-x-0 top-0 z-20 h-fit py-4 text-white transition-all duration-300",
        scrolled
          ? "bg-black/50 shadow-md backdrop-blur-md"
          : "bg-transparent bg-gradient-to-b from-black/30 to-black/0",
      )}
    >
      <div className="container flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1">
          <Home className="size-8" />
          <h1 className="text-2xl font-bold">SweetHomes</h1>
        </Link>
        <div className="flex items-center gap-4 md:text-lg lg:gap-8">
          <Link
            href="/"
            className={clsx(pathname === "/" && "underline underline-offset-4")}
          >
            Home
          </Link>
          <Link
            href="/rooms"
            className={clsx(
              pathname.startsWith("/rooms") && "underline underline-offset-4",
            )}
          >
            Rooms
          </Link>
        </div>
      </div>
    </nav>
  );
}
