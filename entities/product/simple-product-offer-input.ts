export type ValidatedSimpleProductOfferInput = {
  sku: string;
  price: string;
  compareAtPrice: string | null;
  stockQuantity: number;
};

export type SimpleProductOfferInputErrorCode =
  | "missing_sku"
  | "missing_price"
  | "invalid_price"
  | "invalid_compare_at_price"
  | "compare_at_price_below_price"
  | "missing_stock_quantity"
  | "invalid_stock_quantity";

type SimpleProductOfferInputSource = {
  sku: FormDataEntryValue | string | null | undefined;
  price: FormDataEntryValue | string | null | undefined;
  compareAtPrice: FormDataEntryValue | string | null | undefined;
  stockQuantity: FormDataEntryValue | string | null | undefined;
};

export type SimpleProductOfferInputValidationResult =
  | {
      ok: true;
      data: ValidatedSimpleProductOfferInput;
    }
  | {
      ok: false;
      code: SimpleProductOfferInputErrorCode;
    };

function readTrimmedString(
  value: FormDataEntryValue | string | null | undefined
): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value.trim();

  return normalizedValue.length > 0 ? normalizedValue : null;
}

function normalizeMoneyValue(
  value: FormDataEntryValue | string | null | undefined
): string | null | undefined {
  const normalizedValue = readTrimmedString(value);

  if (normalizedValue === null) {
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

  if (normalizedValue === null) {
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

export function validateSimpleProductOfferInput(
  input: SimpleProductOfferInputSource
): SimpleProductOfferInputValidationResult {
  const sku = readTrimmedString(input.sku);

  if (sku === null) {
    return {
      ok: false,
      code: "missing_sku"
    };
  }

  const price = normalizeMoneyValue(input.price);

  if (price === null) {
    return {
      ok: false,
      code: "missing_price"
    };
  }

  if (price === undefined) {
    return {
      ok: false,
      code: "invalid_price"
    };
  }

  const compareAtPrice = normalizeMoneyValue(input.compareAtPrice);

  if (compareAtPrice === undefined) {
    return {
      ok: false,
      code: "invalid_compare_at_price"
    };
  }

  if (compareAtPrice !== null && Number(compareAtPrice) < Number(price)) {
    return {
      ok: false,
      code: "compare_at_price_below_price"
    };
  }

  const stockQuantity = normalizeStockQuantity(input.stockQuantity);

  if (stockQuantity === null) {
    return {
      ok: false,
      code: "missing_stock_quantity"
    };
  }

  if (stockQuantity === undefined) {
    return {
      ok: false,
      code: "invalid_stock_quantity"
    };
  }

  return {
    ok: true,
    data: {
      sku,
      price,
      compareAtPrice,
      stockQuantity
    }
  };
}
