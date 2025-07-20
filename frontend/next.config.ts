import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Settings for static export (deployment)
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Proxy API calls for development only
  ...(process.env.NODE_ENV === 'development' && {
    async rewrites() {
      return [
        {
          source: "/api/:path*",
          destination: `http://localhost:8080/api/:path*`,
        },
      ];
    },
  }),
};

export default nextConfig;
