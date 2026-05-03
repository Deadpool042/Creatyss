import type { BoutiqueSortValue } from "@/features/storefront/catalog/boutique-page/types";
import type { CatalogAvailabilityFilterValue } from "@/entities/catalog/catalog-filter-input";

type BuildBoutiqueUrlInput = {
  q?: string | null;
  category?: string | null;
  availability?: CatalogAvailabilityFilterValue | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  sort?: BoutiqueSortValue;
  page?: number | null;
};

export function buildBoutiqueUrl(input: BuildBoutiqueUrlInput): string {
  const params = new URLSearchParams();

  if (input.q && input.q.trim().length > 0) {
    params.set("q", input.q.trim());
  }

  if (input.category && input.category.trim().length > 0) {
    params.set("category", input.category.trim());
  }

  if (input.availability) {
    params.set("availability", input.availability);
  }

  if (
    typeof input.minPrice === "number" &&
    Number.isSafeInteger(input.minPrice) &&
    input.minPrice >= 0
  ) {
    params.set("minPrice", String(input.minPrice));
  }

  if (
    typeof input.maxPrice === "number" &&
    Number.isSafeInteger(input.maxPrice) &&
    input.maxPrice >= 0
  ) {
    params.set("maxPrice", String(input.maxPrice));
  }

  if (input.sort && input.sort !== "featured") {
    params.set("sort", input.sort);
  }

  if (
    typeof input.page === "number" &&
    Number.isSafeInteger(input.page) &&
    input.page > 1
  ) {
    params.set("page", String(input.page));
  }

  const query = params.toString();
  return query.length > 0 ? `/boutique?${query}` : "/boutique";
}
