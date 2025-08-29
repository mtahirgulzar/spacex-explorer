import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  images: {
    remotePatterns: [
      {
        
        protocol: 'https',
        hostname: 'images2.imgbox.com',
      },
      {
        protocol: 'https',
        hostname: 'imgur.com',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      },
      {
        protocol: 'https',
        hostname: 'farm*.staticflickr.com',
      },
      {
        protocol: 'https',
        hostname: 'live.staticflickr.com',
      },
    ],
  },
};

export default nextConfig;