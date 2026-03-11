export const CATALOG_AVAILABILITY_FILTER_VALUE = "available";

export type CatalogFilterInput = {
  categorySlug: string | null;
  onlyAvailable: boolean;
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
}): CatalogFilterInput {
  return {
    categorySlug: normalizeCatalogCategorySlug(input.category),
    onlyAvailable:
      input.availability === CATALOG_AVAILABILITY_FILTER_VALUE
  };
}
