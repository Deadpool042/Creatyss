import { z } from "zod";

import {
  PRODUCT_LIFECYCLE_STATUS_VALUES,
  type ProductLifecycleStatus,
} from "@/entities/product/product-lifecycle-status";

// ---------------------------------------------------------------------------
// Types (formerly types/products-page-params.types.ts)
// ---------------------------------------------------------------------------

export type ProductsPageStatusParam = "" | ProductLifecycleStatus;

export type ProductsPageFeaturedParam = "" | "featured" | "standard";

export type ProductsPageParams = {
  search: string;
  status: ProductsPageStatusParam;
  category: string;
  featured: ProductsPageFeaturedParam;
};

export type RawProductsPageSearchParams =
  | Record<string, string | string[] | undefined>
  | URLSearchParams
  | undefined;

const PRODUCTS_PAGE_STATUS_VALUES = ["", ...PRODUCT_LIFECYCLE_STATUS_VALUES] as const satisfies readonly (
  | ""
  | ProductLifecycleStatus
)[];

// ---------------------------------------------------------------------------
// Schemas (formerly schemas/products-page-params.schema.ts)
// ---------------------------------------------------------------------------

export const productsPageStatusSchema = z
  .enum(PRODUCTS_PAGE_STATUS_VALUES)
  .catch("");

export const productsPageFeaturedSchema = z.enum(["", "featured", "standard"]);

export const productsPageSearchParamsSchema = z.object({
  q: z
    .string()
    .trim()
    .optional()
    .transform((value) => value ?? ""),
  status: z
    .string()
    .trim()
    .optional()
    .transform((value) => value ?? "")
    .pipe(productsPageStatusSchema),
  category: z
    .string()
    .trim()
    .optional()
    .transform((value) => value ?? ""),
  featured: z
    .string()
    .trim()
    .optional()
    .transform((value) => value ?? "")
    .pipe(productsPageFeaturedSchema),
});

// ---------------------------------------------------------------------------
// Normalize (formerly utils/normalize-raw-search-params.ts)
// ---------------------------------------------------------------------------

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
