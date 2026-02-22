import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ["@tapestry/api-client", "@tapestry/rules", "@tapestry/ui"],

  // image domains
  images: {
    domains: ["res.cloudinary.com"],
  },
};

export default nextConfig;
