export type ProductVariantStatus = "draft" | "published";

export type ValidatedProductVariantInput = {
  name: string;
  colorName: string;
  colorHex: string | null;
  sku: string;
  price: string;
  compareAtPrice: string | null;
  stockQuantity: number;
  isDefault: boolean;
  status: ProductVariantStatus;
};

export type ProductVariantInputErrorCode =
  | "missing_variant_name"
  | "missing_color_name"
  | "invalid_color_hex"
  | "missing_sku"
  | "missing_price"
  | "invalid_price"
  | "invalid_compare_at_price"
  | "compare_at_price_below_price"
  | "missing_stock_quantity"
  | "invalid_stock_quantity"
  | "invalid_variant_status";

type ProductVariantInputSource = {
  name: FormDataEntryValue | string | null | undefined;
  colorName: FormDataEntryValue | string | null | undefined;
  colorHex: FormDataEntryValue | string | null | undefined;
  sku: FormDataEntryValue | string | null | undefined;
  price: FormDataEntryValue | string | null | undefined;
  compareAtPrice: FormDataEntryValue | string | null | undefined;
  stockQuantity: FormDataEntryValue | string | null | undefined;
  isDefault: FormDataEntryValue | string | null | undefined;
  status: FormDataEntryValue | string | null | undefined;
};

export type ProductVariantInputValidationResult =
  | {
      ok: true;
      data: ValidatedProductVariantInput;
    }
  | {
      ok: false;
      code: ProductVariantInputErrorCode;
    };

function readTrimmedString(value: FormDataEntryValue | string | null | undefined): string | null {
  if (typeof value !== "string") {
    return null;
  }

  return value.trim();
}

function normalizeOptionalColorHex(
  value: FormDataEntryValue | string | null | undefined
): string | null | undefined {
  const normalizedValue = readTrimmedString(value);

  if (normalizedValue === null || normalizedValue.length === 0) {
    return null;
  }

  if (!/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(normalizedValue)) {
    return undefined;
  }

  return normalizedValue.toUpperCase();
}

function normalizeMoneyValue(
  value: FormDataEntryValue | string | null | undefined
): string | null | undefined {
  const normalizedValue = readTrimmedString(value);

  if (normalizedValue === null || normalizedValue.length === 0) {
    return null;
  }

  const canonicalValue = normalizedValue.replace(",", ".");

  if (!/^\d+(?:\.\d{1,2})?$/.test(canonicalValue)) {
    return undefined;
  }

  const numericValue = Number(canonicalValue);

  if (!Number.isFinite(numericValue) || numericValue < 0) {
    return undefined;
  }

  return numericValue.toFixed(2);
}

function normalizeStockQuantity(
  value: FormDataEntryValue | string | null | undefined
): number | null | undefined {
  const normalizedValue = readTrimmedString(value);

  if (normalizedValue === null || normalizedValue.length === 0) {
    return null;
  }

  if (!/^\d+$/.test(normalizedValue)) {
    return undefined;
  }

  const numericValue = Number.parseInt(normalizedValue, 10);

  if (!Number.isSafeInteger(numericValue) || numericValue < 0) {
    return undefined;
  }

  return numericValue;
}

function isVariantStatus(value: string | null): value is ProductVariantStatus {
  return value === "draft" || value === "published";
}

export function validateProductVariantInput(
  input: ProductVariantInputSource
): ProductVariantInputValidationResult {
  const name = readTrimmedString(input.name);

  if (name === null || name.length === 0) {
    return {
      ok: false,
      code: "missing_variant_name",
    };
  }

  const colorName = readTrimmedString(input.colorName);

  if (colorName === null || colorName.length === 0) {
    return {
      ok: false,
      code: "missing_color_name",
    };
  }

  const colorHex = normalizeOptionalColorHex(input.colorHex);

  if (colorHex === undefined) {
    return {
      ok: false,
      code: "invalid_color_hex",
    };
  }

  const sku = readTrimmedString(input.sku);

  if (sku === null || sku.length === 0) {
    return {
      ok: false,
      code: "missing_sku",
    };
  }

  const price = normalizeMoneyValue(input.price);

  if (price === null) {
    return {
      ok: false,
      code: "missing_price",
    };
  }

  if (price === undefined) {
    return {
      ok: false,
      code: "invalid_price",
    };
  }

  const compareAtPrice = normalizeMoneyValue(input.compareAtPrice);

  if (compareAtPrice === undefined) {
    return {
      ok: false,
      code: "invalid_compare_at_price",
    };
  }

  if (compareAtPrice !== null && Number(compareAtPrice) < Number(price)) {
    return {
      ok: false,
      code: "compare_at_price_below_price",
    };
  }

  const stockQuantity = normalizeStockQuantity(input.stockQuantity);

  if (stockQuantity === null) {
    return {
      ok: false,
      code: "missing_stock_quantity",
    };
  }

  if (stockQuantity === undefined) {
    return {
      ok: false,
      code: "invalid_stock_quantity",
    };
  }

  const status = readTrimmedString(input.status);

  if (!isVariantStatus(status)) {
    return {
      ok: false,
      code: "invalid_variant_status",
    };
  }

  return {
    ok: true,
    data: {
      name,
      colorName,
      colorHex,
      sku,
      price,
      compareAtPrice,
      stockQuantity,
      isDefault: input.isDefault === "on" || input.isDefault === "true" || input.isDefault === "1",
      status,
    },
  };
}
