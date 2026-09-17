import type { NextConfig } from "next";

const isDockerBuild = process.env.NEXT_OUTPUT === "standalone";

const nextConfig: NextConfig = {
  devIndicators: false,
  // Cloudflare Pages serves the exported files directly. The optional Docker
  // target keeps Next's standalone server and does not affect Pages builds.
  output: isDockerBuild ? "standalone" : "export",
  images: {
    // Static exports have no image optimization server. Source images are
    // already optimized assets, so Next can emit them directly for Pages.
    unoptimized: !isDockerBuild,
  },
};

export default nextConfig;
