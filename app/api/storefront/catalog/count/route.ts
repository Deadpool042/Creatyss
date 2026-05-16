import { NextResponse } from "next/server";

import { validateCatalogFilterInput } from "@/entities/catalog/catalog-filter-input";
import { validateCatalogSearchQuery } from "@/entities/catalog/catalog-search-input";
import { countPublishedProducts } from "@/features/storefront/catalog";
import { catalogSearchParamsSchema } from "@/features/storefront/catalog/schemas/catalog-search-params.schema";

type CatalogCountSearchParams = {
  q?: string | string[];
  category?: string | string[];
  availability?: string | string[];
  minPrice?: string | string[];
  maxPrice?: string | string[];
  sort?: string | string[];
};

function toCatalogCountSearchParams(searchParams: URLSearchParams): CatalogCountSearchParams {
  return {
    q: searchParams.getAll("q"),
    category: searchParams.getAll("category"),
    availability: searchParams.getAll("availability"),
    minPrice: searchParams.getAll("minPrice"),
    maxPrice: searchParams.getAll("maxPrice"),
    sort: searchParams.getAll("sort"),
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawSearchParams = toCatalogCountSearchParams(searchParams);

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
      categories: parsedSearchParams.category,
      availability: parsedSearchParams.availability,
      minPrice: parsedSearchParams.minPrice,
      maxPrice: parsedSearchParams.maxPrice,
    });

    const count = await countPublishedProducts({
      searchQuery,
      categorySlugs: filters.categorySlugs,
      availabilityStatus: filters.availabilityStatus,
      minPriceCents: filters.minPriceCents,
      maxPriceCents: filters.maxPriceCents,
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error("storefront_catalog_count_failed", error);
    return NextResponse.json({ error: "internal_server_error" }, { status: 500 });
  }
}
