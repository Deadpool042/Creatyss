import { z } from "zod";
import {
  type CreateAdminProductInput,
  type UpdateAdminProductInput,
  AdminProductRepositoryError,
} from "@db-products/admin/product";
import { ProductRepositoryError } from "@db-products/public";

const productStatusSchema = z.enum(["draft", "published", "archived"]);
const productTypeSchema = z.enum(["simple", "variable"]);
const productKindSchema = z.enum(["physical", "digital", "hybrid"]);
const idSchema = z.string().trim().min(1);
const slugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const nameSchema = z.string().trim().min(1);
const nullableMoneySchema = z.number().int().min(0).nullable();
const nullableStockSchema = z.number().int().min(0).nullable();

const createAdminProductInputSchema = z.object({
  slug: slugSchema,
  name: nameSchema,
  shortDescription: z.string().trim().nullable().optional(),
  description: z.string().trim().nullable().optional(),
  status: productStatusSchema.optional(),
  productType: productTypeSchema,
  productKind: productKindSchema,
  isFeatured: z.boolean().optional(),
  seoTitle: z.string().trim().nullable().optional(),
  seoDescription: z.string().trim().nullable().optional(),
  publishedAt: z.date().nullable().optional(),
  simpleSku: z.string().trim().nullable().optional(),
  simplePriceCents: nullableMoneySchema.optional(),
  simpleCompareAtCents: nullableMoneySchema.optional(),
  simpleStockQuantity: nullableStockSchema.optional(),
  trackInventory: z.boolean().optional(),
  categoryIds: z.array(idSchema).optional(),
});

const updateAdminProductInputSchema = z.object({
  id: idSchema,
  slug: slugSchema,
  name: nameSchema,
  shortDescription: z.string().trim().nullable().optional(),
  description: z.string().trim().nullable().optional(),
  status: productStatusSchema.optional(),
  productType: productTypeSchema,
  productKind: productKindSchema,
  isFeatured: z.boolean().optional(),
  seoTitle: z.string().trim().nullable().optional(),
  seoDescription: z.string().trim().nullable().optional(),
  publishedAt: z.date().nullable().optional(),
  simpleSku: z.string().trim().nullable().optional(),
  simplePriceCents: nullableMoneySchema.optional(),
  simpleCompareAtCents: nullableMoneySchema.optional(),
  simpleStockQuantity: nullableStockSchema.optional(),
  trackInventory: z.boolean().optional(),
  categoryIds: z.array(idSchema).optional(),
});

export function normalizeProductSlug(value: string): string {
  return value.trim().toLowerCase();
}

export function assertValidProductId(id: string): void {
  const result = idSchema.safeParse(id);

  if (!result.success) {
    throw new ProductRepositoryError("product_not_found", "Produit introuvable.");
  }
}

export function assertProductKindBusinessRules(input: {
  productType: "simple" | "variable";
  productKind: "physical" | "digital" | "hybrid";
  simpleStockQuantity?: number | null;
  trackInventory?: boolean;
}): void {
  if (input.productKind === "digital" && input.productType !== "simple") {
    throw new AdminProductRepositoryError(
      "product_digital_type_invalid",
      "Un produit digital doit être de type simple."
    );
  }

  if (input.productKind === "digital" && input.trackInventory === true) {
    throw new AdminProductRepositoryError(
      "product_digital_inventory_invalid",
      "Un produit digital ne peut pas suivre un stock physique."
    );
  }

  if (
    input.productKind === "digital" &&
    input.simpleStockQuantity !== undefined &&
    input.simpleStockQuantity !== null
  ) {
    throw new AdminProductRepositoryError(
      "product_digital_inventory_invalid",
      "Un produit digital ne peut pas avoir de stock physique."
    );
  }
}

export function parseCreateAdminProductInput(
  input: CreateAdminProductInput
): CreateAdminProductInput {
  const result = createAdminProductInputSchema.safeParse(input);

  if (!result.success) {
    const issue = result.error.issues[0];

    switch (issue?.path[0]) {
      case "slug":
        throw new AdminProductRepositoryError(
          "product_slug_invalid",
          "Le slug produit est invalide."
        );
      case "name":
        throw new AdminProductRepositoryError(
          "product_name_invalid",
          "Le nom produit est invalide."
        );
      case "productType":
        throw new AdminProductRepositoryError(
          "product_type_invalid",
          "Le type produit est invalide."
        );
      case "productKind":
        throw new AdminProductRepositoryError(
          "product_kind_invalid",
          "La nature du produit est invalide."
        );
      case "simplePriceCents":
      case "simpleCompareAtCents":
        throw new AdminProductRepositoryError(
          "product_price_invalid",
          "Le prix produit est invalide."
        );
      case "simpleStockQuantity":
        throw new AdminProductRepositoryError(
          "product_stock_invalid",
          "Le stock produit est invalide."
        );
      case "categoryIds":
        throw new AdminProductRepositoryError(
          "product_category_invalid",
          "Les catégories produit sont invalides."
        );
      default:
        throw new AdminProductRepositoryError(
          "product_name_invalid",
          "Les données produit sont invalides."
        );
    }
  }

  const data = result.data;
  const parsed: CreateAdminProductInput = {
    slug: data.slug,
    name: data.name,
    productType: data.productType,
    productKind: data.productKind,
  };

  if (data.shortDescription !== undefined) {
    parsed.shortDescription = data.shortDescription;
  }
  if (data.description !== undefined) parsed.description = data.description;
  if (data.status !== undefined) parsed.status = data.status;
  if (data.isFeatured !== undefined) parsed.isFeatured = data.isFeatured;
  if (data.seoTitle !== undefined) parsed.seoTitle = data.seoTitle;
  if (data.seoDescription !== undefined) {
    parsed.seoDescription = data.seoDescription;
  }
  if (data.publishedAt !== undefined) parsed.publishedAt = data.publishedAt;
  if (data.simpleSku !== undefined) parsed.simpleSku = data.simpleSku;
  if (data.simplePriceCents !== undefined) {
    parsed.simplePriceCents = data.simplePriceCents;
  }
  if (data.simpleCompareAtCents !== undefined) {
    parsed.simpleCompareAtCents = data.simpleCompareAtCents;
  }
  if (data.simpleStockQuantity !== undefined) {
    parsed.simpleStockQuantity = data.simpleStockQuantity;
  }
  if (data.trackInventory !== undefined) {
    parsed.trackInventory = data.trackInventory;
  }
  if (data.categoryIds !== undefined) parsed.categoryIds = data.categoryIds;

  return parsed;
}

export function parseUpdateAdminProductInput(
  input: UpdateAdminProductInput
): UpdateAdminProductInput {
  const result = updateAdminProductInputSchema.safeParse(input);

  if (!result.success) {
    const issue = result.error.issues[0];

    switch (issue?.path[0]) {
      case "id":
        throw new AdminProductRepositoryError("product_not_found", "Produit introuvable.");
      case "slug":
        throw new AdminProductRepositoryError(
          "product_slug_invalid",
          "Le slug produit est invalide."
        );
      case "name":
        throw new AdminProductRepositoryError(
          "product_name_invalid",
          "Le nom produit est invalide."
        );
      case "productType":
        throw new AdminProductRepositoryError(
          "product_type_invalid",
          "Le type produit est invalide."
        );
      case "productKind":
        throw new AdminProductRepositoryError(
          "product_kind_invalid",
          "La nature du produit est invalide."
        );
      case "simplePriceCents":
      case "simpleCompareAtCents":
        throw new AdminProductRepositoryError(
          "product_price_invalid",
          "Le prix produit est invalide."
        );
      case "simpleStockQuantity":
        throw new AdminProductRepositoryError(
          "product_stock_invalid",
          "Le stock produit est invalide."
        );
      case "categoryIds":
        throw new AdminProductRepositoryError(
          "product_category_invalid",
          "Les catégories produit sont invalides."
        );
      default:
        throw new AdminProductRepositoryError(
          "product_name_invalid",
          "Les données produit sont invalides."
        );
    }
  }

  const data = result.data;
  const parsed: UpdateAdminProductInput = {
    id: data.id,
    slug: data.slug,
    name: data.name,
    productType: data.productType,
    productKind: data.productKind,
  };

  if (data.shortDescription !== undefined) {
    parsed.shortDescription = data.shortDescription;
  }
  if (data.description !== undefined) parsed.description = data.description;
  if (data.status !== undefined) parsed.status = data.status;
  if (data.isFeatured !== undefined) parsed.isFeatured = data.isFeatured;
  if (data.seoTitle !== undefined) parsed.seoTitle = data.seoTitle;
  if (data.seoDescription !== undefined) {
    parsed.seoDescription = data.seoDescription;
  }
  if (data.publishedAt !== undefined) parsed.publishedAt = data.publishedAt;
  if (data.simpleSku !== undefined) parsed.simpleSku = data.simpleSku;
  if (data.simplePriceCents !== undefined) {
    parsed.simplePriceCents = data.simplePriceCents;
  }
  if (data.simpleCompareAtCents !== undefined) {
    parsed.simpleCompareAtCents = data.simpleCompareAtCents;
  }
  if (data.simpleStockQuantity !== undefined) {
    parsed.simpleStockQuantity = data.simpleStockQuantity;
  }
  if (data.trackInventory !== undefined) {
    parsed.trackInventory = data.trackInventory;
  }
  if (data.categoryIds !== undefined) parsed.categoryIds = data.categoryIds;

  return parsed;
}
