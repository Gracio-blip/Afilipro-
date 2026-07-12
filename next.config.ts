import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  poweredByHeader: false,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
