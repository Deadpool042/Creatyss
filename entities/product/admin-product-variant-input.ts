type RawInputValue = FormDataEntryValue | string | null | undefined;

export type ProductVariantLifecycleStatus = "draft" | "active" | "inactive" | "archived";

export type ValidatedAdminProductVariantInput = {
  sku: string;
  slug: string | null;
  name: string | null;
  primaryImageMediaAssetId: string | null;
  status: ProductVariantLifecycleStatus;
  isDefault: boolean;
  sortOrder: number;
  barcode: string | null;
  externalReference: string | null;
  weightGrams: number | null;
  widthMm: number | null;
  heightMm: number | null;
  depthMm: number | null;
};

export type AdminProductVariantInputErrorCode =
  | "missing_sku"
  | "invalid_slug"
  | "invalid_primary_image"
  | "invalid_status"
  | "invalid_sort_order"
  | "invalid_weight_grams"
  | "invalid_width_mm"
  | "invalid_height_mm"
  | "invalid_depth_mm";

type AdminProductVariantInputSource = {
  sku: RawInputValue;
  slug: RawInputValue;
  name: RawInputValue;
  primaryImageMediaAssetId: RawInputValue;
  status: RawInputValue;
  isDefault: RawInputValue;
  sortOrder: RawInputValue;
  barcode: RawInputValue;
  externalReference: RawInputValue;
  weightGrams: RawInputValue;
  widthMm: RawInputValue;
  heightMm: RawInputValue;
  depthMm: RawInputValue;
};

export type AdminProductVariantInputValidationResult =
  | { ok: true; data: ValidatedAdminProductVariantInput }
  | { ok: false; code: AdminProductVariantInputErrorCode };

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

function parseNonNegativeInteger(value: RawInputValue): number | null {
  const normalizedValue = readTrimmedString(value);

  if (normalizedValue === null) {
    return null;
  }

  if (!/^\d+$/.test(normalizedValue)) {
    return null;
  }

  return Number(normalizedValue);
}

function normalizeOptionalInteger(value: RawInputValue): number | null | undefined {
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

function normalizeOptionalSlug(value: RawInputValue): string | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  const normalizedValue = readTrimmedString(value);

  if (normalizedValue === null) {
    return null;
  }

  const slug = normalizedValue
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");

  if (slug.length === 0) {
    return undefined;
  }

  return slug;
}

function normalizeBoolean(value: RawInputValue): boolean {
  return value === "on" || value === "true" || value === "1";
}

function isVariantLifecycleStatus(value: string | null): value is ProductVariantLifecycleStatus {
  return value === "draft" || value === "active" || value === "inactive" || value === "archived";
}

export function validateAdminProductVariantInput(
  input: AdminProductVariantInputSource
): AdminProductVariantInputValidationResult {
  const sku = readTrimmedString(input.sku);

  if (sku === null) {
    return { ok: false, code: "missing_sku" };
  }

  const slug = normalizeOptionalSlug(input.slug);

  if (slug === undefined) {
    return { ok: false, code: "invalid_slug" };
  }

  const primaryImageMediaAssetId = normalizeOptionalId(input.primaryImageMediaAssetId);

  if (primaryImageMediaAssetId === undefined) {
    return { ok: false, code: "invalid_primary_image" };
  }

  const status = readTrimmedString(input.status);

  if (!isVariantLifecycleStatus(status)) {
    return { ok: false, code: "invalid_status" };
  }

  const sortOrder = parseNonNegativeInteger(input.sortOrder);

  if (sortOrder === null) {
    return { ok: false, code: "invalid_sort_order" };
  }

  const weightGrams = normalizeOptionalInteger(input.weightGrams);
  if (weightGrams === undefined) {
    return { ok: false, code: "invalid_weight_grams" };
  }

  const widthMm = normalizeOptionalInteger(input.widthMm);
  if (widthMm === undefined) {
    return { ok: false, code: "invalid_width_mm" };
  }

  const heightMm = normalizeOptionalInteger(input.heightMm);
  if (heightMm === undefined) {
    return { ok: false, code: "invalid_height_mm" };
  }

  const depthMm = normalizeOptionalInteger(input.depthMm);
  if (depthMm === undefined) {
    return { ok: false, code: "invalid_depth_mm" };
  }

  return {
    ok: true,
    data: {
      sku,
      slug,
      name: normalizeOptionalText(input.name),
      primaryImageMediaAssetId,
      status,
      isDefault: normalizeBoolean(input.isDefault),
      sortOrder,
      barcode: normalizeOptionalText(input.barcode),
      externalReference: normalizeOptionalText(input.externalReference),
      weightGrams,
      widthMm,
      heightMm,
      depthMm,
    },
  };
}
