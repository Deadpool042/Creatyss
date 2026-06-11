import type { MetadataRoute } from "next";

import { serverEnv } from "@/core/config/env";
import {
  getPublishedProductsForSitemap,
  getPublishedCategoriesForSitemap,
} from "@/features/storefront/catalog";
import { getPublishedBlogPostsForSitemap } from "@/features/storefront/content/blog";
import { getAdminSeoSettings } from "@/features/admin/settings/queries/get-seo-settings.query";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, blogPosts, categories, seoSettings] = await Promise.all([
    getPublishedProductsForSitemap(),
    getPublishedBlogPostsForSitemap(),
    getPublishedCategoriesForSitemap(),
    getAdminSeoSettings().catch(() => null),
  ]);

  const includeHomepage = seoSettings?.sitemapIncluded !== false;

  const staticPages: MetadataRoute.Sitemap = [
    ...(includeHomepage
      ? [
          {
            url: `${serverEnv.appUrl}/`,
            changeFrequency: "daily" as const,
            priority: 1.0,
          },
        ]
      : []),
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
    {
      url: `${serverEnv.appUrl}/mentions-legales`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${serverEnv.appUrl}/conditions-generales-de-vente`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${serverEnv.appUrl}/politique-confidentialite`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${serverEnv.appUrl}/politique-retour`,
      changeFrequency: "yearly",
      priority: 0.3,
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
