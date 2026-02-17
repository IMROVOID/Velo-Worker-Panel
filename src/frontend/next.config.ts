import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/Velo-Worker-Panel',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
