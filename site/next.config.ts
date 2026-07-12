import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Pairs with the CloudFront directory-index rewrite function: routes are
  // emitted as e.g. about/index.html rather than about.html.
  trailingSlash: true,
  images: {
    // Static export has no server to run Next's image optimization API.
    // Images in public/ should be pre-sized/compressed before committing.
    unoptimized: true,
  },
};

export default nextConfig;
