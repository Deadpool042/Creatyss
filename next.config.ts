import type { NextConfig } from "next";

import { instanceRedirects } from "./core/config/instance-redirects";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 92],
  },
  turbopack: {
    root: process.cwd(),
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
    viewTransition: true,
  },

  /**
   * Les redirects hérités de l'instance vivent hors du socle :
   * cf. core/config/instance-redirects.ts (lot R6 — clonabilité).
   */
  async redirects() {
    return instanceRedirects;
  },

  async headers() {
    if (process.env.NODE_ENV !== "development") {
      return [];
    }

    return [
      {
        source: "/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate, proxy-revalidate" },
          { key: "Pragma", value: "no-cache" },
          { key: "Expires", value: "0" },
        ],
      },
    ];
  },
};

export default nextConfig;
