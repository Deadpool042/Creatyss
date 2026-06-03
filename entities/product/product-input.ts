import { z } from "zod";

import {
  normalizeBoolean,
  normalizeOptionalText,
  normalizeProductSlug,
  readTrimmedString,
} from "./shared-input";
import {
  PRODUCT_PUBLICATION_STATUS_VALUES,
  type ProductPublicationStatus,
} from "./product-publication-status";

export type ProductStatus = ProductPublicationStatus;
export type ProductType = "simple" | "variable";

export const PRODUCT_TYPE_VALUES = [
  "simple",
  "variable",
] as const satisfies readonly ProductType[];

export type ValidatedProductInput = {
  name: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  status: ProductStatus;
  productType: ProductType;
  isFeatured: boolean;
  categoryIds: string[];
};

export type ProductInputErrorCode =
  | "missing_name"
  | "missing_slug"
  | "invalid_slug"
  | "invalid_status"
  | "invalid_product_type"
  | "invalid_category_ids";

type ProductInputSource = {
  name: FormDataEntryValue | string | null | undefined;
  slug: FormDataEntryValue | string | null | undefined;
  shortDescription: FormDataEntryValue | string | null | undefined;
  description: FormDataEntryValue | string | null | undefined;
  seoTitle: FormDataEntryValue | string | null | undefined;
  seoDescription: FormDataEntryValue | string | null | undefined;
  status: FormDataEntryValue | string | null | undefined;
  productType: FormDataEntryValue | string | null | undefined;
  isFeatured: FormDataEntryValue | string | null | undefined;
  categoryIds: readonly FormDataEntryValue[] | readonly string[] | undefined;
};

export type ProductInputValidationResult =
  | {
      ok: true;
      data: ValidatedProductInput;
    }
  | {
      ok: false;
      code: ProductInputErrorCode;
    };

export { normalizeProductSlug };

function normalizeCategoryIds(
  values: readonly FormDataEntryValue[] | readonly string[] | undefined
): string[] | null {
  if (!values) {
    return [];
  }

  const normalizedIds: string[] = [];

  for (const value of values) {
    if (typeof value !== "string") {
      return null;
    }

    const normalizedValue = value.trim();

    if (normalizedValue.length === 0 || !/^\d+$/.test(normalizedValue)) {
      return null;
    }

    if (!normalizedIds.includes(normalizedValue)) {
      normalizedIds.push(normalizedValue);
    }
  }

  return normalizedIds;
}

const productStatusSchema = z.enum(PRODUCT_PUBLICATION_STATUS_VALUES);
const productTypeSchema = z.enum(PRODUCT_TYPE_VALUES);

const productInputSchema = z.object({
  name: z.preprocess((value) => readTrimmedString(value), z.string().min(1)),
  slug: z
    .preprocess((value) => readTrimmedString(value), z.string().min(1))
    .transform((value) => normalizeProductSlug(value))
    .refine((value) => value.length > 0),
  shortDescription: z.preprocess((value) => normalizeOptionalText(value), z.string().nullable()),
  description: z.preprocess((value) => normalizeOptionalText(value), z.string().nullable()),
  seoTitle: z.preprocess((value) => normalizeOptionalText(value), z.string().nullable()),
  seoDescription: z.preprocess((value) => normalizeOptionalText(value), z.string().nullable()),
  status: z.preprocess((value) => readTrimmedString(value), productStatusSchema),
  productType: z.preprocess((value) => readTrimmedString(value), productTypeSchema),
  isFeatured: z.preprocess((value) => normalizeBoolean(value), z.boolean()),
  categoryIds: z.preprocess((value) => normalizeCategoryIds(value as ProductInputSource["categoryIds"]), z.array(z.string())),
});

export function validateProductInput(input: ProductInputSource): ProductInputValidationResult {
  const parsed = productInputSchema.safeParse(input);

  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const issuePath = issue?.path[0];
    const receivedSlug = readTrimmedString(input.slug);

    switch (issuePath) {
      case "name":
        return { ok: false, code: "missing_name" };
      case "slug":
        if (receivedSlug === null) {
          return { ok: false, code: "missing_slug" };
        }
        return { ok: false, code: "invalid_slug" };
      case "status":
        return { ok: false, code: "invalid_status" };
      case "productType":
        return { ok: false, code: "invalid_product_type" };
      case "categoryIds":
        return { ok: false, code: "invalid_category_ids" };
      default:
        return { ok: false, code: "invalid_category_ids" };
    }
  }

  return {
    ok: true,
    data: parsed.data,
  };
}
