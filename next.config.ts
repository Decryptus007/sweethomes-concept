import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.sweethomes.com.ng",
        port: "",
        pathname: "/storage/**",
      },
    ],
  },
};

export default nextConfig;
