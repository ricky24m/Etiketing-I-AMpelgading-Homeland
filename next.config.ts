import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  // Konfigurasi untuk images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tqqmdictqdmimanfajhi.supabase.co',
      },
    ],
  },
  
  // Webpack config untuk canvas (diperlukan untuk html2canvas)
  webpack: (config: any) => {
    config.resolve.alias.canvas = false;
    return config;
  },
  
  // Environment variables jika diperlukan
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

export default nextConfig;
