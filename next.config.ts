import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const backendUrl =
      process.env.BACKEND_URL || "http://localhost:5000";
    return [
      {
        // NEXT_PUBLIC_API_BASE_URL must be set to "/api" so that apiFetch
        // routes through this proxy and same-origin cookies are sent correctly.
        source: "/api/:path*",
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
