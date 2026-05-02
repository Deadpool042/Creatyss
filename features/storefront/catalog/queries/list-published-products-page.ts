import { db } from "@/core/db";
import type { CatalogAvailabilityFilterValue } from "@/entities/catalog/catalog-filter-input";
import {
  buildPublishedProductsCursorWhere,
  decodePublishedProductsPageCursor,
  encodePublishedProductsPageCursor,
  getPublishedProductsOrderBy,
  mapPublishedProductListingRecord,
  type CatalogListingSort,
  publishedProductListingSelect,
} from "@/features/storefront/catalog/queries/published-products-listing";
import {
  buildPublishedProductWhereInput,
  matchesStorefrontAvailabilityFilter,
} from "@/features/storefront/catalog/queries/published-products-filters";
import type { CatalogProductListItem, CatalogProductListPage } from "@/features/storefront/catalog/types";

type ListPublishedProductsPageInput = {
  searchQuery: string | null;
  categorySlug: string | null;
  availabilityStatus: CatalogAvailabilityFilterValue | null;
  minPriceCents: number | null;
  maxPriceCents: number | null;
  sort: CatalogListingSort;
  limit: number;
  cursor: string | null;
};

const DEFAULT_FETCH_BATCH_SIZE = 24;
const MAX_INTERNAL_FETCH_CYCLES = 12;

function normalizePageLimit(limit: number): number {
  if (!Number.isFinite(limit)) {
    return 12;
  }

  const normalizedLimit = Math.trunc(limit);

  if (normalizedLimit < 1) {
    return 1;
  }

  return Math.min(normalizedLimit, 48);
}

export async function listPublishedProductsPage(
  input: ListPublishedProductsPageInput
): Promise<CatalogProductListPage> {
  const normalizedLimit = normalizePageLimit(input.limit);
  const decodedCursor =
    input.cursor === null ? null : decodePublishedProductsPageCursor(input.cursor, input.sort);

  const baseWhere = buildPublishedProductWhereInput({
    searchQuery: input.searchQuery,
    categorySlug: input.categorySlug,
    minPriceCents: input.minPriceCents,
    maxPriceCents: input.maxPriceCents,
  });

  const orderBy = getPublishedProductsOrderBy(input.sort);
  const hasPostMappingFilters = input.availabilityStatus !== null;

  if (!hasPostMappingFilters) {
    const cursorWhere = decodedCursor
      ? buildPublishedProductsCursorWhere(input.sort, decodedCursor)
      : null;

    const products = await db.product.findMany({
      where: cursorWhere ? { AND: [baseWhere, cursorWhere] } : baseWhere,
      orderBy,
      take: normalizedLimit + 1,
      select: publishedProductListingSelect,
    });

    const hasMore = products.length > normalizedLimit;
    const sliced = hasMore ? products.slice(0, normalizedLimit) : products;
    const lastVisibleItem = sliced.at(-1);

    return {
      items: sliced.map(mapPublishedProductListingRecord),
      nextCursor:
        hasMore && lastVisibleItem
          ? encodePublishedProductsPageCursor(lastVisibleItem, input.sort)
          : null,
      hasMore,
    };
  }

  const targetSize = normalizedLimit + 1;
  const mappedMatches: Array<{
    item: CatalogProductListItem;
    cursor: string;
  }> = [];

  let currentCursor = decodedCursor;
  let exhausted = false;
  let cycles = 0;

  while (!exhausted && mappedMatches.length < targetSize && cycles < MAX_INTERNAL_FETCH_CYCLES) {
    cycles += 1;

    const cursorWhere = currentCursor
      ? buildPublishedProductsCursorWhere(input.sort, currentCursor)
      : null;

    const fetchBatchSize = Math.max(
      DEFAULT_FETCH_BATCH_SIZE,
      Math.min(96, targetSize * 3)
    );

    const batch = await db.product.findMany({
      where: cursorWhere ? { AND: [baseWhere, cursorWhere] } : baseWhere,
      orderBy,
      take: fetchBatchSize,
      select: publishedProductListingSelect,
    });

    if (batch.length === 0) {
      exhausted = true;
      break;
    }

    for (const product of batch) {
      const mapped = mapPublishedProductListingRecord(product);
      const matchesAvailability = matchesStorefrontAvailabilityFilter(
        mapped.availabilityStatus,
        input.availabilityStatus
      );

      if (matchesAvailability) {
        mappedMatches.push({
          item: mapped,
          cursor: encodePublishedProductsPageCursor(product, input.sort),
        });

        if (mappedMatches.length >= targetSize) {
          break;
        }
      }
    }

    const lastBatchItem = batch.at(-1);

    if (!lastBatchItem) {
      exhausted = true;
      break;
    }

    currentCursor = decodePublishedProductsPageCursor(
      encodePublishedProductsPageCursor(lastBatchItem, input.sort),
      input.sort
    );

    if (batch.length < fetchBatchSize) {
      exhausted = true;
    }
  }

  const hasMore = mappedMatches.length > normalizedLimit;
  const visibleItems = hasMore ? mappedMatches.slice(0, normalizedLimit) : mappedMatches;
  const lastVisibleMatch = visibleItems.at(-1);

  return {
    items: visibleItems.map((entry) => entry.item),
    nextCursor: hasMore && lastVisibleMatch ? lastVisibleMatch.cursor : null,
    hasMore,
  };
}
