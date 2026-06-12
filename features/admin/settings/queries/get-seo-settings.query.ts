import "server-only";

import { db } from "@/core/db";
import type { SeoIndexingModeValue } from "@/features/admin/settings/schemas/seo-settings.schema";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";

export type AdminSeoSettings = {
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
  openGraphTitle: string | null;
  openGraphDescription: string | null;
  twitterTitle: string | null;
  twitterDescription: string | null;
  openGraphImageId: string | null;
  openGraphImageFilePath: string | null;
  twitterImageId: string | null;
  twitterImageFilePath: string | null;
  indexingMode: SeoIndexingModeValue;
  sitemapIncluded: boolean;
};

export async function getAdminSeoSettings(): Promise<AdminSeoSettings | null> {
  const storeId = await getCurrentStoreId();

  if (storeId === null) return null;

  const row = await db.seoMetadata.findUnique({
    where: {
      storeId_subjectType_subjectId: {
        storeId,
        subjectType: "HOMEPAGE",
        subjectId: storeId,
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
      openGraphImageId: true,
      twitterImageId: true,
      openGraphImage: { select: { storageKey: true } },
      twitterImage: { select: { storageKey: true } },
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
    openGraphImageId: row.openGraphImageId,
    openGraphImageFilePath: row.openGraphImage?.storageKey ?? null,
    twitterImageId: row.twitterImageId,
    twitterImageFilePath: row.twitterImage?.storageKey ?? null,
    indexingMode: row.indexingMode as SeoIndexingModeValue,
    sitemapIncluded: row.sitemapIncluded,
  };
}
