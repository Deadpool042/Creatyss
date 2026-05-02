import { NextResponse } from "next/server";

import { getUploadsPublicPath } from "@/core/uploads";
import { validateCatalogFilterInput } from "@/entities/catalog/catalog-filter-input";
import { validateCatalogSearchQuery } from "@/entities/catalog/catalog-search-input";
import { mapBoutiqueProductCardItem } from "@/features/storefront/catalog/boutique-page/composition/map-boutique-product-card-item";
import { listPublishedProductsPage } from "@/features/storefront/catalog";
import { catalogSearchParamsSchema } from "@/features/storefront/catalog/schemas/catalog-search-params.schema";

type CatalogProductsSearchParams = {
  q?: string | string[];
  category?: string | string[];
  availability?: string | string[];
  minPrice?: string | string[];
  maxPrice?: string | string[];
  sort?: string | string[];
};

const DEFAULT_PRODUCTS_PAGE_LIMIT = 12;
const MIN_PRODUCTS_PAGE_LIMIT = 1;
const MAX_PRODUCTS_PAGE_LIMIT = 24;

function toCatalogProductsSearchParams(
  searchParams: URLSearchParams
): CatalogProductsSearchParams {
  return {
    q: searchParams.getAll("q"),
    category: searchParams.getAll("category"),
    availability: searchParams.getAll("availability"),
    minPrice: searchParams.getAll("minPrice"),
    maxPrice: searchParams.getAll("maxPrice"),
    sort: searchParams.getAll("sort"),
  };
}

function normalizeProductsPageLimit(rawLimit: string | null): number {
  if (rawLimit === null) {
    return DEFAULT_PRODUCTS_PAGE_LIMIT;
  }

  const parsed = Number.parseInt(rawLimit, 10);

  if (!Number.isFinite(parsed)) {
    return DEFAULT_PRODUCTS_PAGE_LIMIT;
  }

  if (parsed < MIN_PRODUCTS_PAGE_LIMIT) {
    return MIN_PRODUCTS_PAGE_LIMIT;
  }

  if (parsed > MAX_PRODUCTS_PAGE_LIMIT) {
    return MAX_PRODUCTS_PAGE_LIMIT;
  }

  return parsed;
}

function normalizeProductsPageCursor(rawCursor: string | null): string | null {
  if (rawCursor === null) {
    return null;
  }

  const trimmedCursor = rawCursor.trim();

  return trimmedCursor.length > 0 ? trimmedCursor : null;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawSearchParams = toCatalogProductsSearchParams(searchParams);
    const rawLimit = searchParams.get("limit");
    const rawCursor = searchParams.get("cursor");

    const parsedSearchParams = catalogSearchParamsSchema.parse({
      q: rawSearchParams.q,
      category: rawSearchParams.category,
      availability: rawSearchParams.availability,
      minPrice: rawSearchParams.minPrice,
      maxPrice: rawSearchParams.maxPrice,
      sort: rawSearchParams.sort,
    });

    const searchQuery = validateCatalogSearchQuery(parsedSearchParams.q);
    const filters = validateCatalogFilterInput({
      category: parsedSearchParams.category,
      availability: parsedSearchParams.availability,
      minPrice: parsedSearchParams.minPrice,
      maxPrice: parsedSearchParams.maxPrice,
    });

    const page = await listPublishedProductsPage({
      searchQuery,
      categorySlug: filters.categorySlug,
      availabilityStatus: filters.availabilityStatus,
      minPriceCents: filters.minPriceCents,
      maxPriceCents: filters.maxPriceCents,
      sort: parsedSearchParams.sort,
      limit: normalizeProductsPageLimit(rawLimit),
      cursor: normalizeProductsPageCursor(rawCursor),
    });

    const uploadsPublicPath = getUploadsPublicPath();

    return NextResponse.json({
      items: page.items.map((item) =>
        mapBoutiqueProductCardItem({
          product: item,
          uploadsPublicPath,
        })
      ),
      nextCursor: page.nextCursor,
      hasMore: page.hasMore,
    });
  } catch (error) {
    console.error("storefront_catalog_products_failed", error);
    return NextResponse.json({ error: "internal_server_error" }, { status: 500 });
  }
}
