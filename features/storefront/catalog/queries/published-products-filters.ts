import type { CatalogAvailabilityFilterValue } from "@/entities/catalog/catalog-filter-input";

type BuildPublishedProductWhereInput = {
  searchQuery: string | null;
  categorySlug: string | null;
  minPriceCents: number | null;
  maxPriceCents: number | null;
};

export function buildPublishedProductWhereInput(input: BuildPublishedProductWhereInput) {
  const hasPriceFilter = input.minPriceCents !== null || input.maxPriceCents !== null;
  const catalogPriceCentsFilter = hasPriceFilter
    ? {
        ...(input.minPriceCents !== null ? { gte: input.minPriceCents } : {}),
        ...(input.maxPriceCents !== null ? { lte: input.maxPriceCents } : {}),
      }
    : null;

  return {
    status: "ACTIVE" as const,
    archivedAt: null,
    ...(input.searchQuery
      ? {
          OR: [
            { name: { contains: input.searchQuery, mode: "insensitive" as const } },
            { slug: { contains: input.searchQuery, mode: "insensitive" as const } },
            { shortDescription: { contains: input.searchQuery, mode: "insensitive" as const } },
            { description: { contains: input.searchQuery, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(input.categorySlug
      ? {
          productCategories: {
            some: {
              category: {
                OR: [
                  { slug: input.categorySlug },
                  { parent: { slug: input.categorySlug } },
                ],
              },
            },
          },
        }
      : {}),
    ...(catalogPriceCentsFilter
      ? {
          catalogPriceCents: {
            not: null,
            ...catalogPriceCentsFilter,
          },
        }
      : {}),
  };
}

export function filterProductsByStorefrontAvailability<T extends { availabilityStatus: CatalogAvailabilityFilterValue }>(
  products: T[],
  availabilityStatus: CatalogAvailabilityFilterValue | null
): T[] {
  if (availabilityStatus === null) {
    return products;
  }

  return products.filter((product) => product.availabilityStatus === availabilityStatus);
}

export function matchesStorefrontAvailabilityFilter(
  availabilityStatus: CatalogAvailabilityFilterValue,
  selectedAvailabilityStatus: CatalogAvailabilityFilterValue | null
): boolean {
  if (selectedAvailabilityStatus === null) {
    return true;
  }

  return availabilityStatus === selectedAvailabilityStatus;
}
