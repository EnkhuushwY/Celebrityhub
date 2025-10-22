import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // Firebase Hosting-д зориулсан static build
  images: {
    unoptimized: true,
  },
   eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
