import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Konfigurasi untuk Pages Router
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'localhost',
      },
    ],
  },
  // Konfigurasi untuk static files
  trailingSlash: false,
  // Environment variables 
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

export default nextConfig;
