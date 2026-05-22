import { z } from "zod";

import {
  normalizeBoolean,
  normalizeNonNegativeIntegerOrZero,
  normalizeOptionalId,
  normalizeOptionalText,
  readTrimmedString,
} from "./shared-input";

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

const createProductImageInputSchema = z.object({
  mediaAssetId: z.preprocess((value) => readTrimmedString(value), z.string().min(1)),
  variantId: z.preprocess((value) => normalizeOptionalId(value), z.string().nullable()),
  altText: z.preprocess((value) => normalizeOptionalText(value), z.string().nullable()),
  sortOrder: z.preprocess(
    (value) => normalizeNonNegativeIntegerOrZero(value),
    z.number().int().nonnegative()
  ),
  isPrimary: z.preprocess((value) => normalizeBoolean(value), z.boolean()),
});

const updateProductImageInputSchema = z.object({
  altText: z.preprocess((value) => normalizeOptionalText(value), z.string().nullable()),
  sortOrder: z.preprocess(
    (value) => normalizeNonNegativeIntegerOrZero(value),
    z.number().int().nonnegative()
  ),
  isPrimary: z.preprocess((value) => normalizeBoolean(value), z.boolean()),
});

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

export function validateCreateProductImageInput(
  input: CreateProductImageInputSource
): CreateProductImageValidationResult {
  const parsed = createProductImageInputSchema.safeParse(input);

  if (!parsed.success) {
    const issuePath = parsed.error.issues[0]?.path[0];

    switch (issuePath) {
      case "mediaAssetId":
        return { ok: false, code: "missing_media_asset" };
      case "variantId":
        return { ok: false, code: "invalid_variant" };
      case "sortOrder":
        return { ok: false, code: "invalid_sort_order" };
      default:
        return { ok: false, code: "invalid_media_asset" };
    }
  }

  return {
    ok: true,
    data: parsed.data,
  };
}

export function validateUpdateProductImageInput(
  input: UpdateProductImageInputSource
): UpdateProductImageValidationResult {
  const parsed = updateProductImageInputSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      code: "invalid_sort_order",
    };
  }

  return {
    ok: true,
    data: parsed.data,
  };
}
