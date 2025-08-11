import type { Metadata } from "next";
import { Gilda_Display, Nunito } from "next/font/google";
import "./globals.css";

const gildaDisplay = Gilda_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-gilda",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

// Improved SEO metadata
export const metadata: Metadata = {
  title: "SweetHomes – Luxury & Comfort Redefined",
  description:
    "Experience luxury and comfort at SweetHomes. Book your stay for the best rates, premium amenities, and exceptional service.",
  keywords: [
    "SweetHomes",
    "Luxury Hotel",
    "Hotel Booking",
    "Accommodation",
    "Premium Amenities",
    "Best Rates",
    "Exceptional Service",
  ],
  authors: [{ name: "SweetHomes", url: "https://sweethomes.com" }],
  creator: "SweetHomes",
  openGraph: {
    title: "SweetHomes – Luxury & Comfort Redefined",
    description:
      "Book your stay at SweetHomes for luxury rooms, premium amenities, and top-notch service.",
    url: "https://sweethomes.com",
    siteName: "SweetHomes",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SweetHomes Lobby",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SweetHomes – Luxury & Comfort Redefined",
    description:
      "Book your stay at SweetHomes for luxury rooms, premium amenities, and top-notch service.",
    images: ["/og-image.jpg"],
    creator: "@sweethomes",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  // manifest: "/site.webmanifest",
  metadataBase: new URL("https://sweethomes.com"),
  alternates: {
    canonical: "https://sweethomes.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${gildaDisplay.variable} ${nunito.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
