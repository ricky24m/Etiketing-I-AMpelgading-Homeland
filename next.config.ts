import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Konfigurasi untuk Pages Router
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tqqmdictqdmimanfajhi.supabase.co',
      },
    ],
  },
  // Konfigurasi untuk static files
  trailingSlash: false,
  // Environment variables 
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    esmExternals: false,
  },
  webpack: (config: any) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;
