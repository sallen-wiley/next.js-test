import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Exclude stories from build
  pageExtensions: ["js", "jsx", "ts", "tsx"],
  webpack: (config) => {
    config.module.rules.push({
      test: /\.stories\.(js|jsx|ts|tsx)$/,
      use: "ignore-loader",
    });
    return config;
  },
};

export default nextConfig;
