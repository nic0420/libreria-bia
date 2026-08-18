import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'd22fxaf9t8d39k.cloudfront.net',
      },
    ],
  },
};

export default nextConfig;
