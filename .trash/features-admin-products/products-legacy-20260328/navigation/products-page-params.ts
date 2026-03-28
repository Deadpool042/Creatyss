import { z } from "zod";

const productsPageModeSchema = z.enum(["view", "edit"]);

const productsPageSearchParamsSchema = z.object({
  selected: z
    .string()
    .trim()
    .min(1)
    .optional()
    .transform((value) => value ?? null),
  mode: productsPageModeSchema.optional().default("view"),
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

export type ProductsPageMode = z.infer<typeof productsPageModeSchema>;

export type ProductsPageParams = {
  selectedSlug: string | null;
  mode: ProductsPageMode;
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
      selected: searchParams.get("selected") ?? undefined,
      mode: searchParams.get("mode") ?? undefined,
      q: searchParams.get("q") ?? undefined,
      status: searchParams.get("status") ?? undefined,
      category: searchParams.get("category") ?? undefined,
      featured: searchParams.get("featured") ?? undefined,
    };
  }

  return {
    selected: getFirstValue(searchParams, "selected"),
    mode: getFirstValue(searchParams, "mode"),
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
    selectedSlug: parsed.selected,
    mode: parsed.mode,
    search: parsed.q,
    status: parsed.status,
    category: parsed.category,
    featured: parsed.featured,
  };
}
