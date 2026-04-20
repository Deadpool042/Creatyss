import type { MetadataRoute } from "next";

import { serverEnv } from "@/core/config/env";
import { getPublishedProductsForSitemap } from "@/features/storefront/catalog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getPublishedProductsForSitemap();

  return products
    .filter((p) => p.sitemapIncluded)
    .map((p) => ({
      url: `${serverEnv.appUrl}/boutique/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
}
