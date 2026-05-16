import { db } from "@/core/db";
import type { CatalogAvailabilityFilterValue } from "@/entities/catalog/catalog-filter-input";
import {
  getPublishedProductsOrderBy,
  mapPublishedProductListingRecord,
  publishedProductListingSelect,
} from "@/features/storefront/catalog/queries/published-products-listing";
import {
  buildPublishedProductWhereInput,
  matchesStorefrontAvailabilityFilter,
} from "@/features/storefront/catalog/queries/published-products-filters";
import type { CatalogProductListItem } from "@/features/storefront/catalog/types";

export async function listPublishedProducts(input: {
  searchQuery: string | null;
  categorySlugs: string[];
  availabilityStatus: CatalogAvailabilityFilterValue | null;
  minPriceCents: number | null;
  maxPriceCents: number | null;
  sort: "featured" | "newest" | "name" | "price-asc" | "price-desc";
}): Promise<CatalogProductListItem[]> {
  const products = await db.product.findMany({
    where: buildPublishedProductWhereInput({
      searchQuery: input.searchQuery,
      categorySlugs: input.categorySlugs,
      minPriceCents: input.minPriceCents,
      maxPriceCents: input.maxPriceCents,
    }),
    orderBy: getPublishedProductsOrderBy(input.sort),
    select: publishedProductListingSelect,
  });

  const mapped: CatalogProductListItem[] = [];

  for (const product of products) {
    const item = mapPublishedProductListingRecord(product);
    const matchesAvailability = matchesStorefrontAvailabilityFilter(
      item.availabilityStatus,
      input.availabilityStatus
    );

    if (matchesAvailability) {
      mapped.push(item);
    }
  }

  return mapped;
}
