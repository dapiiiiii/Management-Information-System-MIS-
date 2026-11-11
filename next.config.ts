import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  poweredByHeader: false,
  images: {
    qualities: [75],
  },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
