import { db } from "@/core/db";
import type { CatalogAvailabilityFilterValue } from "@/entities/catalog/catalog-filter-input";
import {
  mapPublishedProductListingRecord,
  publishedProductListingSelect,
} from "@/features/storefront/catalog/queries/published-products-listing";
import {
  buildPublishedProductWhereInput,
  matchesStorefrontAvailabilityFilter,
} from "@/features/storefront/catalog/queries/published-products-filters";

type CountPublishedProductsInput = {
  searchQuery: string | null;
  categorySlug: string | null;
  availabilityStatus: CatalogAvailabilityFilterValue | null;
  minPriceCents: number | null;
  maxPriceCents: number | null;
};

export async function countPublishedProducts(
  input: CountPublishedProductsInput
): Promise<number> {
  const where = buildPublishedProductWhereInput({
    searchQuery: input.searchQuery,
    categorySlug: input.categorySlug,
    minPriceCents: input.minPriceCents,
    maxPriceCents: input.maxPriceCents,
  });

  const hasPostMappingFilters = input.availabilityStatus !== null;

  if (!hasPostMappingFilters) {
    return db.product.count({ where });
  }

  const products = await db.product.findMany({
    where,
    select: publishedProductListingSelect,
  });

  return products.reduce((count, product) => {
    const mapped = mapPublishedProductListingRecord(product);
    const matchesAvailability = matchesStorefrontAvailabilityFilter(
      mapped.availabilityStatus,
      input.availabilityStatus
    );

    return matchesAvailability ? count + 1 : count;
  }, 0);
}
