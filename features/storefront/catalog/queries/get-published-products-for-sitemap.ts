import { db } from "@/core/db";
import type { CatalogSitemapProduct } from "@/features/storefront/catalog/types";

export async function getPublishedProductsForSitemap(): Promise<CatalogSitemapProduct[]> {
  const products = await db.product.findMany({
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

  if (products.length === 0) {
    return [];
  }

  const productIds = products.map((p) => p.id);

  const seoMetadataList = await db.seoMetadata.findMany({
    where: {
      subjectType: "PRODUCT",
      subjectId: { in: productIds },
      archivedAt: null,
    },
    select: {
      subjectId: true,
      sitemapIncluded: true,
    },
  });

  const seoMap = new Map(seoMetadataList.map((s) => [s.subjectId, s.sitemapIncluded]));

  return products.map((product) => ({
    slug: product.slug,
    updatedAt: product.updatedAt,
    sitemapIncluded: seoMap.get(product.id) ?? true,
  }));
}
