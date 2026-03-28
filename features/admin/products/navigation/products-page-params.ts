import { z } from "zod";

const productsPageSearchParamsSchema = z.object({
  q: z
    .string()
    .trim()
    .optional()
    .transform((value) => value ?? ""),
  status: z
    .string()
    .trim()
    .optional()
    .transform((value) => value ?? ""),
  category: z
    .string()
    .trim()
    .optional()
    .transform((value) => value ?? ""),
  featured: z
    .string()
    .trim()
    .optional()
    .transform((value) => value ?? ""),
});

export type ProductsPageParams = {
  search: string;
  status: string;
  category: string;
  featured: string;
};

type RawSearchParams = Record<string, string | string[] | undefined> | URLSearchParams | undefined;

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

function normalizeRawSearchParams(
  searchParams: RawSearchParams
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

export function parseProductsPageParams(searchParams: RawSearchParams): ProductsPageParams {
  const normalized = normalizeRawSearchParams(searchParams);
  const parsed = productsPageSearchParamsSchema.parse(normalized);

  return {
    search: parsed.q,
    status: parsed.status,
    category: parsed.category,
    featured: parsed.featured,
  };
}
