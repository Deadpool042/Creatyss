import { db } from "@/core/db";
import {
  publishedProductListingSelect,
  mapPublishedProductListingRecord,
} from "@/features/storefront/catalog/queries/published-products-listing";
import type { CatalogProductListItem } from "@/features/storefront/catalog/types";

export async function findFavoriteProductsByIds(
  productIds: readonly string[]
): Promise<CatalogProductListItem[]> {
  if (productIds.length === 0) {
    return [];
  }

  const ids = productIds.slice(0, 50);

  const products = await db.product.findMany({
    where: {
      id: { in: [...ids] },
      status: "ACTIVE",
      archivedAt: null,
    },
    select: publishedProductListingSelect,
  });

  const mapped = new Map<string, CatalogProductListItem>();
  for (const product of products) {
    mapped.set(product.id, mapPublishedProductListingRecord(product));
  }

  // Re-sort to match cookie order (most recently added first)
  return ids
    .map((id) => mapped.get(id))
    .filter((item): item is CatalogProductListItem => item !== undefined);
}
