import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Deployment builds use a separate dir so they can't corrupt a running dev server's .next.
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
  // Standalone is only needed by the Figma Make nextjs adapter; Vercel doesn't want the extra trace step.
  output: process.env.NEXT_BUILD_STANDALONE === "1" ? "standalone" : undefined,
  images: {
    formats: ["image/avif", "image/webp"],
    // Keep this list narrow and explicit.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mui.com",
      },
      {
        protocol: "https",
        hostname: "flagcdn.com",
      },
    ],
  },
};

export default nextConfig;
