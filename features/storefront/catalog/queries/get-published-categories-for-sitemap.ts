import { db } from "@/core/db";

export type CatalogSitemapCategory = {
  slug: string;
  updatedAt: Date;
  sitemapIncluded: boolean;
};

export async function getPublishedCategoriesForSitemap(): Promise<CatalogSitemapCategory[]> {
  const categories = await db.category.findMany({
    where: {
      status: "ACTIVE",
      archivedAt: null,
    },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      slug: true,
      updatedAt: true,
    },
  });

  if (categories.length === 0) {
    return [];
  }

  const categoryIds = categories.map((c) => c.id);

  const seoMetadataList = await db.seoMetadata.findMany({
    where: {
      subjectType: "CATEGORY",
      subjectId: { in: categoryIds },
      archivedAt: null,
    },
    select: {
      subjectId: true,
      sitemapIncluded: true,
    },
  });

  const seoMap = new Map(seoMetadataList.map((s) => [s.subjectId, s.sitemapIncluded]));

  return categories.map((category) => ({
    slug: category.slug,
    updatedAt: category.updatedAt,
    sitemapIncluded: seoMap.get(category.id) ?? true,
  }));
}
