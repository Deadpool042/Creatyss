import type { MetadataRoute } from "next";

import { serverEnv } from "@/core/config/env";
import {
  getPublishedProductsForSitemap,
  getPublishedBlogPostsForSitemap,
  getPublishedCategoriesForSitemap,
} from "@/features/storefront/catalog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, blogPosts, categories] = await Promise.all([
    getPublishedProductsForSitemap(),
    getPublishedBlogPostsForSitemap(),
    getPublishedCategoriesForSitemap(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${serverEnv.appUrl}/`,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${serverEnv.appUrl}/boutique`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${serverEnv.appUrl}/blog`,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  const productPages: MetadataRoute.Sitemap = products
    .filter((p) => p.sitemapIncluded)
    .map((p) => ({
      url: `${serverEnv.appUrl}/boutique/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  const blogPages: MetadataRoute.Sitemap = blogPosts
    .filter((p) => p.sitemapIncluded)
    .map((p) => ({
      url: `${serverEnv.appUrl}/blog/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  const categoryPages: MetadataRoute.Sitemap = categories
    .filter((c) => c.sitemapIncluded)
    .map((c) => ({
      url: `${serverEnv.appUrl}/boutique?category=${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  return [...staticPages, ...productPages, ...blogPages, ...categoryPages];
}
