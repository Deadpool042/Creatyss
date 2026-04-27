import { z } from "zod";

function normalizeTextSearchParam(value: unknown): string | null {
  const candidate = Array.isArray(value) ? value[0] : value;

  if (typeof candidate !== "string") {
    return null;
  }

  const normalizedValue = candidate.trim();

  return normalizedValue.length > 0 ? normalizedValue : null;
}

function normalizeAvailableSearchParam(value: unknown): boolean {
  const candidate = Array.isArray(value) ? value[0] : value;

  if (typeof candidate !== "string") {
    return false;
  }

  return candidate.trim().toLowerCase() === "available";
}

export const catalogSearchParamsSchema = z.object({
  q: z.preprocess(normalizeTextSearchParam, z.string().nullable()),
  category: z.preprocess(normalizeTextSearchParam, z.string().nullable()),
  available: z.preprocess(normalizeAvailableSearchParam, z.boolean()),
});

export type CatalogSearchParams = z.infer<typeof catalogSearchParamsSchema>;
