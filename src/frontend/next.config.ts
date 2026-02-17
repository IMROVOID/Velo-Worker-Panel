import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/panel',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
