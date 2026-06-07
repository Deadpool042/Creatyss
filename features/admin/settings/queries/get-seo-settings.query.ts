import "server-only";

import { db } from "@/core/db";
import type { SeoIndexingModeValue } from "@/features/admin/settings/schemas/seo-settings.schema";

export type AdminSeoSettings = {
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
  openGraphTitle: string | null;
  openGraphDescription: string | null;
  twitterTitle: string | null;
  twitterDescription: string | null;
  indexingMode: SeoIndexingModeValue;
  sitemapIncluded: boolean;
};

export async function getAdminSeoSettings(): Promise<AdminSeoSettings | null> {
  const store = await db.store.findFirst({
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });

  if (!store) return null;

  const row = await db.seoMetadata.findUnique({
    where: {
      storeId_subjectType_subjectId: {
        storeId: store.id,
        subjectType: "HOMEPAGE",
        subjectId: store.id,
      },
    },
    select: {
      metaTitle: true,
      metaDescription: true,
      metaKeywords: true,
      openGraphTitle: true,
      openGraphDescription: true,
      twitterTitle: true,
      twitterDescription: true,
      indexingMode: true,
      sitemapIncluded: true,
    },
  });

  if (!row) return null;

  return {
    metaTitle: row.metaTitle,
    metaDescription: row.metaDescription,
    metaKeywords: row.metaKeywords,
    openGraphTitle: row.openGraphTitle,
    openGraphDescription: row.openGraphDescription,
    twitterTitle: row.twitterTitle,
    twitterDescription: row.twitterDescription,
    indexingMode: row.indexingMode as SeoIndexingModeValue,
    sitemapIncluded: row.sitemapIncluded,
  };
}
