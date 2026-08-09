import type { NextConfig } from "next";

// Validate environment variables at build / dev startup (fail fast).
import "./src/lib/env";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.shadcnspace.com" }],
  },
};

export default nextConfig;
