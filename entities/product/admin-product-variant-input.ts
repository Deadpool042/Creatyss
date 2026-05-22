import { z } from "zod";

import {
  normalizeBoolean,
  normalizeOptionalId,
  normalizeOptionalNonNegativeInteger,
  normalizeOptionalSlug,
  normalizeOptionalText,
  parseNonNegativeInteger,
  readTrimmedString,
  type RawInputValue,
} from "./shared-input";

export type ProductVariantLifecycleStatus = "draft" | "active" | "inactive" | "archived";

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

const productVariantLifecycleStatusSchema = z.enum(["draft", "active", "inactive", "archived"]);

const adminProductVariantInputSchema = z.object({
  sku: z.preprocess((value) => readTrimmedString(value), z.string().min(1)),
  slug: z.preprocess((value) => normalizeOptionalSlug(value), z.string().nullable()),
  name: z.preprocess((value) => normalizeOptionalText(value), z.string().nullable()),
  primaryImageMediaAssetId: z.preprocess(
    (value) => normalizeOptionalId(value),
    z.string().nullable()
  ),
  status: z.preprocess(
    (value) => readTrimmedString(value),
    productVariantLifecycleStatusSchema
  ),
  isDefault: z.preprocess((value) => normalizeBoolean(value), z.boolean()),
  sortOrder: z.preprocess((value) => parseNonNegativeInteger(value), z.number().int().nonnegative()),
  barcode: z.preprocess((value) => normalizeOptionalText(value), z.string().nullable()),
  externalReference: z.preprocess((value) => normalizeOptionalText(value), z.string().nullable()),
  weightGrams: z.preprocess(
    (value) => normalizeOptionalNonNegativeInteger(value),
    z.number().int().nonnegative().nullable()
  ),
  widthMm: z.preprocess(
    (value) => normalizeOptionalNonNegativeInteger(value),
    z.number().int().nonnegative().nullable()
  ),
  heightMm: z.preprocess(
    (value) => normalizeOptionalNonNegativeInteger(value),
    z.number().int().nonnegative().nullable()
  ),
  depthMm: z.preprocess(
    (value) => normalizeOptionalNonNegativeInteger(value),
    z.number().int().nonnegative().nullable()
  ),
});

export type ValidatedAdminProductVariantInput = z.infer<typeof adminProductVariantInputSchema>;

export type AdminProductVariantInputValidationResult =
  | { ok: true; data: ValidatedAdminProductVariantInput }
  | { ok: false; code: AdminProductVariantInputErrorCode };

export function validateAdminProductVariantInput(
  input: AdminProductVariantInputSource
): AdminProductVariantInputValidationResult {
  const parsed = adminProductVariantInputSchema.safeParse(input);

  if (!parsed.success) {
    const issuePath = parsed.error.issues[0]?.path[0];

    switch (issuePath) {
      case "sku":
        return { ok: false, code: "missing_sku" };
      case "slug":
        return { ok: false, code: "invalid_slug" };
      case "primaryImageMediaAssetId":
        return { ok: false, code: "invalid_primary_image" };
      case "status":
        return { ok: false, code: "invalid_status" };
      case "sortOrder":
        return { ok: false, code: "invalid_sort_order" };
      case "weightGrams":
        return { ok: false, code: "invalid_weight_grams" };
      case "widthMm":
        return { ok: false, code: "invalid_width_mm" };
      case "heightMm":
        return { ok: false, code: "invalid_height_mm" };
      case "depthMm":
        return { ok: false, code: "invalid_depth_mm" };
      default:
        return { ok: false, code: "invalid_status" };
    }
  }

  return {
    ok: true,
    data: parsed.data,
  };
}
