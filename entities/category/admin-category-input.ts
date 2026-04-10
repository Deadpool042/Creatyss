type RawInputValue = FormDataEntryValue | string | null | undefined;

export type ValidatedAdminCategoryInput = {
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  primaryImageId: string | null;
  isFeatured: boolean;
  sortOrder: number;
};

export type AdminCategoryInputErrorCode =
  | "missing_name"
  | "missing_slug"
  | "invalid_slug"
  | "invalid_parent_id"
  | "invalid_primary_image"
  | "invalid_sort_order";

export type AdminCategoryInputValidationResult =
  | { ok: true; data: ValidatedAdminCategoryInput }
  | { ok: false; code: AdminCategoryInputErrorCode };

function readTrimmedString(value: RawInputValue): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value.trim();
  return normalizedValue.length > 0 ? normalizedValue : null;
}

function normalizeOptionalText(value: RawInputValue): string | null {
  return readTrimmedString(value);
}

function normalizeOptionalId(value: RawInputValue): string | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  const normalizedValue = readTrimmedString(value);

  if (normalizedValue === null) {
    return null;
  }

  return normalizedValue;
}

function normalizeBoolean(value: RawInputValue): boolean {
  return value === "on" || value === "true" || value === "1";
}

function parseNonNegativeInteger(value: RawInputValue): number | null {
  const normalizedValue = readTrimmedString(value);

  if (normalizedValue === null || !/^\d+$/.test(normalizedValue)) {
    return null;
  }

  return Number(normalizedValue);
}

export function normalizeCategorySlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function validateAdminCategoryInput(input: {
  name: RawInputValue;
  slug: RawInputValue;
  description: RawInputValue;
  parentId: RawInputValue;
  primaryImageId: RawInputValue;
  isFeatured: RawInputValue;
  sortOrder: RawInputValue;
}): AdminCategoryInputValidationResult {
  const name = readTrimmedString(input.name);

  if (name === null) {
    return { ok: false, code: "missing_name" };
  }

  const rawSlug = readTrimmedString(input.slug);

  if (rawSlug === null) {
    return { ok: false, code: "missing_slug" };
  }

  const slug = normalizeCategorySlug(rawSlug);

  if (slug.length === 0) {
    return { ok: false, code: "invalid_slug" };
  }

  const parentId = normalizeOptionalId(input.parentId);
  if (parentId === undefined) {
    return { ok: false, code: "invalid_parent_id" };
  }

  const primaryImageId = normalizeOptionalId(input.primaryImageId);
  if (primaryImageId === undefined) {
    return { ok: false, code: "invalid_primary_image" };
  }

  const sortOrder = parseNonNegativeInteger(input.sortOrder);
  if (sortOrder === null) {
    return { ok: false, code: "invalid_sort_order" };
  }

  return {
    ok: true,
    data: {
      name,
      slug,
      description: normalizeOptionalText(input.description),
      parentId,
      primaryImageId,
      isFeatured: normalizeBoolean(input.isFeatured),
      sortOrder,
    },
  };
}
