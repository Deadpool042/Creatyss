export type ValidatedCartItemInput = {
  variantId: string;
  quantity: number;
};

export type CartItemInputErrorCode =
  | "missing_variant_id"
  | "invalid_variant_id"
  | "missing_quantity"
  | "invalid_quantity";

type CartItemInputSource = {
  variantId: FormDataEntryValue | string | null | undefined;
  quantity: FormDataEntryValue | string | null | undefined;
};

export type CartItemInputValidationResult =
  | {
      ok: true;
      data: ValidatedCartItemInput;
    }
  | {
      ok: false;
      code: CartItemInputErrorCode;
    };

function readTrimmedString(value: FormDataEntryValue | string | null | undefined): string | null {
  if (typeof value !== "string") {
    return null;
  }

  return value.trim();
}

function normalizeVariantId(
  value: FormDataEntryValue | string | null | undefined
): string | null | undefined {
  const normalizedValue = readTrimmedString(value);

  if (normalizedValue === null || normalizedValue.length === 0) {
    return null;
  }

  return normalizedValue;
}

function normalizeQuantity(
  value: FormDataEntryValue | string | null | undefined
): number | null | undefined {
  const normalizedValue = readTrimmedString(value);

  if (normalizedValue === null || normalizedValue.length === 0) {
    return null;
  }

  if (!/^[0-9]+$/.test(normalizedValue)) {
    return undefined;
  }

  const numericValue = Number.parseInt(normalizedValue, 10);

  if (!Number.isSafeInteger(numericValue) || numericValue < 1) {
    return undefined;
  }

  return numericValue;
}

export function validateCartItemInput(input: CartItemInputSource): CartItemInputValidationResult {
  const variantId = normalizeVariantId(input.variantId);

  if (variantId === null) {
    return {
      ok: false,
      code: "missing_variant_id",
    };
  }

  if (variantId === undefined) {
    return {
      ok: false,
      code: "invalid_variant_id",
    };
  }

  const quantity = normalizeQuantity(input.quantity);

  if (quantity === null) {
    return {
      ok: false,
      code: "missing_quantity",
    };
  }

  if (quantity === undefined) {
    return {
      ok: false,
      code: "invalid_quantity",
    };
  }

  return {
    ok: true,
    data: {
      variantId,
      quantity,
    },
  };
}
