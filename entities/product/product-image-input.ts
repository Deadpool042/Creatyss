export type ValidatedCreateProductImageInput = {
  mediaAssetId: string;
  variantId: string | null;
  altText: string | null;
  sortOrder: number;
  isPrimary: boolean;
};

export type ValidatedUpdateProductImageInput = {
  altText: string | null;
  sortOrder: number;
  isPrimary: boolean;
};

export type ProductImageInputErrorCode =
  | "missing_media_asset"
  | "invalid_media_asset"
  | "invalid_variant"
  | "invalid_sort_order";

type CreateProductImageInputSource = {
  mediaAssetId: FormDataEntryValue | string | null | undefined;
  variantId: FormDataEntryValue | string | null | undefined;
  altText: FormDataEntryValue | string | null | undefined;
  sortOrder: FormDataEntryValue | string | null | undefined;
  isPrimary: FormDataEntryValue | string | null | undefined;
};

type UpdateProductImageInputSource = {
  altText: FormDataEntryValue | string | null | undefined;
  sortOrder: FormDataEntryValue | string | null | undefined;
  isPrimary: FormDataEntryValue | string | null | undefined;
};

export type CreateProductImageValidationResult =
  | {
      ok: true;
      data: ValidatedCreateProductImageInput;
    }
  | {
      ok: false;
      code: ProductImageInputErrorCode;
    };

export type UpdateProductImageValidationResult =
  | {
      ok: true;
      data: ValidatedUpdateProductImageInput;
    }
  | {
      ok: false;
      code: ProductImageInputErrorCode;
    };

function readTrimmedString(value: FormDataEntryValue | string | null | undefined): string | null {
  if (typeof value !== "string") {
    return null;
  }

  return value.trim();
}

function normalizeOptionalText(
  value: FormDataEntryValue | string | null | undefined
): string | null {
  const normalizedValue = readTrimmedString(value);

  if (normalizedValue === null || normalizedValue.length === 0) {
    return null;
  }

  return normalizedValue;
}

function normalizeSortOrder(value: FormDataEntryValue | string | null | undefined): number | null {
  const normalizedValue = readTrimmedString(value);

  if (normalizedValue === null || normalizedValue.length === 0) {
    return 0;
  }

  if (!/^\d+$/.test(normalizedValue)) {
    return null;
  }

  return Number(normalizedValue);
}

function normalizeOptionalVariantId(
  value: FormDataEntryValue | string | null | undefined
): string | null | undefined {
  const normalizedValue = readTrimmedString(value);

  if (normalizedValue === null || normalizedValue.length === 0) {
    return null;
  }

  if (!/^[0-9]+$/.test(normalizedValue)) {
    return undefined;
  }

  return normalizedValue;
}

export function validateCreateProductImageInput(
  input: CreateProductImageInputSource
): CreateProductImageValidationResult {
  const mediaAssetId = readTrimmedString(input.mediaAssetId);

  if (mediaAssetId === null || mediaAssetId.length === 0) {
    return {
      ok: false,
      code: "missing_media_asset",
    };
  }

  if (!/^[0-9]+$/.test(mediaAssetId)) {
    return {
      ok: false,
      code: "invalid_media_asset",
    };
  }

  const variantId = normalizeOptionalVariantId(input.variantId);

  if (variantId === undefined) {
    return {
      ok: false,
      code: "invalid_variant",
    };
  }

  const sortOrder = normalizeSortOrder(input.sortOrder);

  if (sortOrder === null) {
    return {
      ok: false,
      code: "invalid_sort_order",
    };
  }

  return {
    ok: true,
    data: {
      mediaAssetId,
      variantId,
      altText: normalizeOptionalText(input.altText),
      sortOrder,
      isPrimary: input.isPrimary === "on" || input.isPrimary === "true" || input.isPrimary === "1",
    },
  };
}

export function validateUpdateProductImageInput(
  input: UpdateProductImageInputSource
): UpdateProductImageValidationResult {
  const sortOrder = normalizeSortOrder(input.sortOrder);

  if (sortOrder === null) {
    return {
      ok: false,
      code: "invalid_sort_order",
    };
  }

  return {
    ok: true,
    data: {
      altText: normalizeOptionalText(input.altText),
      sortOrder,
      isPrimary: input.isPrimary === "on" || input.isPrimary === "true" || input.isPrimary === "1",
    },
  };
}
