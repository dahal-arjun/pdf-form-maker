import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configure Turbopack (Next.js 16 default)
  turbopack: {},
  // Keep webpack config for backward compatibility when using --webpack flag
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        canvas: false,
      };
    }
    // Handle pdf.js for SSR
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    return config;
  },
};

export default nextConfig;
