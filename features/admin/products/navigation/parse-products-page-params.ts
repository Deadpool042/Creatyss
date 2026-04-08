//features/admin/products/navigation/products-page-params.ts
import { productsPageSearchParamsSchema } from "@/features/admin/products/navigation/schemas/products-page-params.schema";
import type {
  ProductsPageParams,
  RawProductsPageSearchParams,
} from "@/features/admin/products/navigation/types/products-page-params.types";
import { normalizeRawProductsPageSearchParams } from "@/features/admin/products/navigation/utils/normalize-raw-search-params";

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
