import { z } from "zod";

function readTrimmedString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value.trim();
  return normalizedValue.length > 0 ? normalizedValue : null;
}

function normalizeOptionalId(value: unknown): string | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  return readTrimmedString(value);
}

function normalizeBoolean(value: unknown): boolean {
  return value === "on" || value === "true" || value === "1";
}

function parseNonNegativeInteger(value: unknown): number | undefined {
  const normalizedValue = readTrimmedString(value);

  if (normalizedValue === null || !/^\d+$/.test(normalizedValue)) {
    return undefined;
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

const categoryNameSchema = z
  .preprocess((value) => readTrimmedString(value), z.string().min(1, { message: "missing_name" }));

const categorySlugSchema = z
  .preprocess((value) => readTrimmedString(value), z.string().min(1, { message: "missing_slug" }))
  .transform((value) => normalizeCategorySlug(value))
  .refine((value) => value.length > 0, { message: "invalid_slug" });

const categoryDescriptionSchema = z.preprocess(
  (value) => readTrimmedString(value),
  z.string().nullable()
);

const categoryIsFeaturedSchema = z.preprocess((value) => normalizeBoolean(value), z.boolean());

const categoryParentIdSchema = z
  .preprocess((value) => normalizeOptionalId(value), z.string().nullable())
  .refine((value) => value !== undefined, { message: "invalid_parent_id" });

const categoryPrimaryImageIdSchema = z
  .preprocess((value) => normalizeOptionalId(value), z.string().nullable())
  .refine((value) => value !== undefined, { message: "invalid_primary_image" });

const categorySortOrderSchema = z
  .preprocess((value) => parseNonNegativeInteger(value), z.number().int().nonnegative())
  .refine((value) => value !== undefined, { message: "invalid_sort_order" });

export const categoryInputSchema = z.object({
  name: categoryNameSchema,
  slug: categorySlugSchema,
  description: categoryDescriptionSchema,
  isFeatured: categoryIsFeaturedSchema,
});

export const adminCategoryInputSchema = categoryInputSchema.extend({
  parentId: categoryParentIdSchema,
  primaryImageId: categoryPrimaryImageIdSchema,
  sortOrder: categorySortOrderSchema,
});

export type CategoryInputSchema = z.infer<typeof categoryInputSchema>;
export type AdminCategoryInputSchema = z.infer<typeof adminCategoryInputSchema>;
