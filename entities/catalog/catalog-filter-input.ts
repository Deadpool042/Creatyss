export const CATALOG_AVAILABILITY_FILTER_VALUES = [
  "in-stock",
  "made-to-order",
  "unavailable",
] as const;

export type CatalogAvailabilityFilterValue =
  (typeof CATALOG_AVAILABILITY_FILTER_VALUES)[number];

export const CATALOG_AVAILABILITY_FILTER_VALUE: CatalogAvailabilityFilterValue = "in-stock";

function normalizeCatalogAvailabilityStatus(
  value: string | null
): CatalogAvailabilityFilterValue | null {
  if (value === null) {
    return null;
  }

  const normalizedValue = value.trim().toLowerCase();

  if (normalizedValue === "available") {
    return "in-stock";
  }

  if (
    normalizedValue === "in-stock" ||
    normalizedValue === "made-to-order" ||
    normalizedValue === "unavailable"
  ) {
    return normalizedValue;
  }

  return null;
}

export type CatalogFilterInput = {
  categorySlug: string | null;
  availabilityStatus: CatalogAvailabilityFilterValue | null;
  minPriceCents: number | null;
  maxPriceCents: number | null;
};

function normalizeCatalogCategorySlug(value: string | null): string | null {
  if (value === null) {
    return null;
  }

  const normalizedValue = value.trim().toLowerCase();

  if (normalizedValue.length === 0) {
    return null;
  }

  return normalizedValue;
}

export function validateCatalogFilterInput(input: {
  category: string | null;
  availability: string | null;
  minPrice?: number | null;
  maxPrice?: number | null;
}): CatalogFilterInput {
  const minPriceCents =
    typeof input.minPrice === "number" &&
    Number.isSafeInteger(input.minPrice) &&
    input.minPrice >= 0 &&
    input.minPrice <= 10_000_000
      ? input.minPrice
      : null;

  const maxPriceCentsCandidate =
    typeof input.maxPrice === "number" &&
    Number.isSafeInteger(input.maxPrice) &&
    input.maxPrice >= 0 &&
    input.maxPrice <= 10_000_000
      ? input.maxPrice
      : null;

  return {
    categorySlug: normalizeCatalogCategorySlug(input.category),
    availabilityStatus: normalizeCatalogAvailabilityStatus(input.availability),
    minPriceCents,
    maxPriceCents:
      maxPriceCentsCandidate !== null &&
      minPriceCents !== null &&
      maxPriceCentsCandidate < minPriceCents
        ? null
        : maxPriceCentsCandidate,
  };
}
