export type RawInputValue = FormDataEntryValue | string | null | undefined;

export function readTrimmedString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value.trim();
  return normalizedValue.length > 0 ? normalizedValue : null;
}

export function normalizeOptionalText(value: unknown): string | null {
  return readTrimmedString(value);
}

export function normalizeOptionalId(value: unknown): string | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  return readTrimmedString(value);
}

export function normalizeBoolean(value: unknown): boolean {
  return value === "on" || value === "true" || value === "1";
}

export function parseNonNegativeInteger(value: unknown): number | undefined {
  const normalizedValue = readTrimmedString(value);

  if (normalizedValue === null || !/^\d+$/.test(normalizedValue)) {
    return undefined;
  }

  return Number(normalizedValue);
}

export function normalizeOptionalNonNegativeInteger(value: unknown): number | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  const normalizedValue = readTrimmedString(value);

  if (normalizedValue === null) {
    return null;
  }

  if (!/^\d+$/.test(normalizedValue)) {
    return undefined;
  }

  return Number(normalizedValue);
}

export function normalizeNonNegativeIntegerOrZero(value: unknown): number | undefined {
  const normalizedValue = readTrimmedString(value);

  if (normalizedValue === null) {
    return 0;
  }

  if (!/^\d+$/.test(normalizedValue)) {
    return undefined;
  }

  return Number(normalizedValue);
}

export function normalizeProductSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalizeOptionalSlug(value: unknown): string | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  const normalizedValue = readTrimmedString(value);

  if (normalizedValue === null) {
    return null;
  }

  const slug = normalizeProductSlug(normalizedValue);
  return slug.length > 0 ? slug : undefined;
}
