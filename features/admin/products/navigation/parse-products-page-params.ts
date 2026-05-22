import {
  productsPageSearchParamsSchema,
  normalizeRawProductsPageSearchParams,
  type ProductsPageParams,
  type RawProductsPageSearchParams,
} from "./products-page-params";

export function parseProductsPageParams(
  searchParams: RawProductsPageSearchParams
): ProductsPageParams {
  const normalized = normalizeRawProductsPageSearchParams(searchParams);
  const parsed = productsPageSearchParamsSchema.parse(normalized);

  return {
    search: parsed.q,
    status: parsed.status,
    category: parsed.category,
    featured: parsed.featured,
  };
}
