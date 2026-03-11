export const MAX_CATALOG_SEARCH_QUERY_LENGTH = 100;

export function normalizeCatalogSearchQuery(value: string | null): string | null {
  if (value === null) {
    return null;
  }

  const normalizedValue = value.trim().replace(/\s+/g, " ");

  if (normalizedValue.length === 0) {
    return null;
  }

  return normalizedValue;
}

export function validateCatalogSearchQuery(value: string | null): string | null {
  const normalizedValue = normalizeCatalogSearchQuery(value);

  if (normalizedValue === null) {
    return null;
  }

  return normalizedValue.slice(0, MAX_CATALOG_SEARCH_QUERY_LENGTH);
}
