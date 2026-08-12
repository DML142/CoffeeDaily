import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@coffee-daily/ui"],
  allowedDevOrigins: ["192.168.50.36"],
};

export default nextConfig;
