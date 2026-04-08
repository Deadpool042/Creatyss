//features/admin/products/navigation/utils/normalize-raw-search-params.ts
import type { RawProductsPageSearchParams } from "@/features/admin/products/navigation/types/products-page-params.types";

function getFirstValue(
  input: Record<string, string | string[] | undefined>,
  key: string
): string | undefined {
  const value = input[key];

  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export function normalizeRawProductsPageSearchParams(
  searchParams: RawProductsPageSearchParams
): Record<string, string | undefined> {
  if (!searchParams) {
    return {};
  }

  if (searchParams instanceof URLSearchParams) {
    return {
      q: searchParams.get("q") ?? undefined,
      status: searchParams.get("status") ?? undefined,
      category: searchParams.get("category") ?? undefined,
      featured: searchParams.get("featured") ?? undefined,
    };
  }

  return {
    q: getFirstValue(searchParams, "q"),
    status: getFirstValue(searchParams, "status"),
    category: getFirstValue(searchParams, "category"),
    featured: getFirstValue(searchParams, "featured"),
  };
}
