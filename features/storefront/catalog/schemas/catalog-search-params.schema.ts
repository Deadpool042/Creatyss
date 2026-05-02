import { z } from "zod";
import type { CatalogAvailabilityFilterValue } from "@/entities/catalog/catalog-filter-input";

function normalizeTextSearchParam(value: unknown): string | null {
  const candidate = Array.isArray(value) ? value[0] : value;

  if (typeof candidate !== "string") {
    return null;
  }

  const normalizedValue = candidate.trim();

  return normalizedValue.length > 0 ? normalizedValue : null;
}

function normalizeAvailabilitySearchParam(value: unknown): CatalogAvailabilityFilterValue | null {
  const candidate = Array.isArray(value) ? value[0] : value;

  if (typeof candidate !== "string") {
    return null;
  }

  const normalized = candidate.trim().toLowerCase();

  if (normalized === "available" || normalized === "in-stock") {
    return "in-stock";
  }

  if (normalized === "made-to-order") {
    return "made-to-order";
  }

  if (normalized === "unavailable") {
    return "unavailable";
  }

  return null;
}

function normalizeSortSearchParam(
  value: unknown
): "featured" | "newest" | "name" | "price-asc" | "price-desc" {
  const candidate = Array.isArray(value) ? value[0] : value;

  if (
    candidate === "newest" ||
    candidate === "name" ||
    candidate === "price-asc" ||
    candidate === "price-desc"
  ) {
    return candidate;
  }

  return "featured";
}

const MAX_PRICE_FILTER_CENTS = 10_000_000;

function normalizePriceSearchParam(value: unknown): number | null {
  const candidate = Array.isArray(value) ? value[0] : value;

  if (typeof candidate !== "string") {
    return null;
  }

  const normalized = candidate.trim();

  if (!/^\d+$/.test(normalized)) {
    return null;
  }

  const parsed = Number.parseInt(normalized, 10);

  if (!Number.isSafeInteger(parsed)) {
    return null;
  }

  if (parsed < 0 || parsed > MAX_PRICE_FILTER_CENTS) {
    return null;
  }

  return parsed;
}

export const catalogSearchParamsSchema = z.object({
  q: z.preprocess(normalizeTextSearchParam, z.string().nullable()),
  category: z.preprocess(normalizeTextSearchParam, z.string().nullable()),
  availability: z.preprocess(
    normalizeAvailabilitySearchParam,
    z.enum(["in-stock", "made-to-order", "unavailable"]).nullable()
  ),
  sort: z.preprocess(
    normalizeSortSearchParam,
    z.enum(["featured", "newest", "name", "price-asc", "price-desc"])
  ),
  minPrice: z.preprocess(normalizePriceSearchParam, z.number().int().nonnegative().nullable()),
  maxPrice: z.preprocess(normalizePriceSearchParam, z.number().int().nonnegative().nullable()),
});

export type CatalogSearchParams = z.infer<typeof catalogSearchParamsSchema>;
