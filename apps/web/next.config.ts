import type { NextConfig } from "next";

// Validate environment variables at build / dev startup (fail fast).
import "./src/lib/env";

const nextConfig: NextConfig = {
  // The repository root AGENTS.md is the single source of truth. Next 16.3
  // otherwise generates a second, workspace-local instruction file on dev.
  agentRules: false,
  reactCompiler: true,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.shadcnspace.com" }],
  },
};

export default nextConfig;
