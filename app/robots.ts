import type { MetadataRoute } from "next";

import { serverEnv } from "@/core/config/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/admin/"],
      },
    ],
    sitemap: `${serverEnv.appUrl}/sitemap.xml`,
  };
}
