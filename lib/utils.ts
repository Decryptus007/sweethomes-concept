import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper function to get full image URL for API images
export const getApiImageUrl = (imagePath: string): string => {
  // Get the base URL and remove /api suffix if present
  let baseURL =
    process.env.NEXT_PUBLIC_API_URL ?? "https://api.sweethomes.com.ng/api";

  // Remove /api from the end if it exists
  if (baseURL.endsWith("/api")) {
    baseURL = baseURL.slice(0, -4);
  }

  // Ensure it starts with https://
  if (!baseURL.startsWith("http")) {
    baseURL = `https://${baseURL}`;
  }

  return `${baseURL}/storage/${imagePath}`;
};

export const rooms = [
  {
    name: "Premier Room – King Bed & View",
    description: {
      park: "Free self parking",
      size: "820 sq ft",
      sleeps: "Sleeps 4",
      view: "City view",
      bed: "2 King Bed",
    },
    images: [
      "/assets/images/rooms/generic-1-1.jpg",
      "/assets/images/rooms/generic-1-2.jpg",
      "/assets/images/rooms/generic-1-3.jpg",
    ],
  },
  {
    name: "King Club Room – Poolside",
    description: {
      park: "Free self parking",
      size: "820 sq ft",
      sleeps: "Sleeps 4",
      view: "City view",
      bed: "2 King Bed",
    },
    images: [
      "/assets/images/rooms/generic-2-1.jpg",
      "/assets/images/rooms/generic-2-2.jpg",
      "/assets/images/rooms/generic-2-3.jpg",
    ],
  },
  {
    name: "King Bed Panorama Suite",
    description: {
      park: "Free self parking",
      size: "820 sq ft",
      sleeps: "Sleeps 4",
      view: "City view",
      bed: "2 King Bed",
    },
    images: [
      "/assets/images/rooms/generic-3-1.jpg",
      "/assets/images/rooms/generic-3-2.jpg",
      "/assets/images/rooms/generic-3-3.jpg",
    ],
  },
];
