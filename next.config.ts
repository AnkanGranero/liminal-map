import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath: "/liminal-map",
  assetPrefix: "/liminal-map/",
  trailingSlash: true,
};

export default nextConfig;
