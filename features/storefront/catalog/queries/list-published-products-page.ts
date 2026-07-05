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
import type { CatalogProductListPage } from "@/features/storefront/catalog/types";

type ListPublishedProductsPageInput = {
  searchQuery: string | null;
  searchProductIds?: string[] | null;
  categorySlugs: string[];
  availabilityStatus: CatalogAvailabilityFilterValue | null;
  minPriceCents: number | null;
  maxPriceCents: number | null;
  sort: CatalogListingSort;
  limit: number;
  cursor: string | null;
  skip?: number;
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
    searchProductIds: input.searchProductIds ?? null,
    categorySlugs: input.categorySlugs,
    minPriceCents: input.minPriceCents,
    maxPriceCents: input.maxPriceCents,
  });

  const orderBy = getPublishedProductsOrderBy(input.sort);
  const hasPostMappingFilters = input.availabilityStatus !== null;
  const hasCategoryFilter = input.categorySlugs.length > 0;

  const skipOffset =
    typeof input.skip === "number" && Number.isSafeInteger(input.skip) && input.skip > 0
      ? input.skip
      : 0;

  // Fast path : sans filtre catégorie ni disponibilité, Prisma ne génère pas de JOIN
  // sur la relation parent → pas de risque de doublons, take=N+1 est fiable.
  if (!hasPostMappingFilters && !hasCategoryFilter) {
    const cursorWhere = decodedCursor
      ? buildPublishedProductsCursorWhere(input.sort, decodedCursor)
      : null;

    const products = await db.product.findMany({
      where: cursorWhere ? { AND: [baseWhere, cursorWhere] } : baseWhere,
      orderBy,
      take: normalizedLimit + 1,
      ...(skipOffset > 0 ? { skip: skipOffset } : {}),
      select: publishedProductListingSelect,
    });

    const hasMore = products.length > normalizedLimit;
    const sliced = hasMore ? products.slice(0, normalizedLimit) : products;

    return {
      items: sliced.map(mapPublishedProductListingRecord),
      hasMore,
    };
  }

  const targetSize = normalizedLimit + 1 + skipOffset;
  const mappedMatches: CatalogProductListPage["items"] = [];
  const seenIds = new Set<string>();

  let currentCursor = decodedCursor;
  let exhausted = false;
  let cycles = 0;

  while (!exhausted && mappedMatches.length < targetSize && cycles < MAX_INTERNAL_FETCH_CYCLES) {
    cycles += 1;

    const cursorWhere = currentCursor
      ? buildPublishedProductsCursorWhere(input.sort, currentCursor)
      : null;

    const fetchBatchSize = Math.max(DEFAULT_FETCH_BATCH_SIZE, Math.min(96, targetSize * 3));

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
      if (seenIds.has(product.id)) continue;
      seenIds.add(product.id);

      const mapped = mapPublishedProductListingRecord(product);
      const matchesAvailability = matchesStorefrontAvailabilityFilter(
        mapped.availabilityStatus,
        input.availabilityStatus
      );

      if (matchesAvailability) {
        mappedMatches.push(mapped);

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

  const skippedMatches = skipOffset > 0 ? mappedMatches.slice(skipOffset) : mappedMatches;
  const hasMore = skippedMatches.length > normalizedLimit;
  const visibleItems = hasMore ? skippedMatches.slice(0, normalizedLimit) : skippedMatches;

  return {
    items: visibleItems,
    hasMore,
  };
}
