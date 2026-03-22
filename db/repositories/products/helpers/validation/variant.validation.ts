import { z } from "zod";
import {
  AdminProductVariantRepositoryError,
  type CreateAdminProductVariantInput,
  type UpdateAdminProductVariantInput,
} from "@db-products/admin/variant";

const productVariantStatusSchema = z.enum(["draft", "published", "archived"]);
const idSchema = z.string().trim().min(1);
const nameSchema = z.string().trim().min(1);
const nullableMoneySchema = z.number().int().min(0).nullable();
const nullableStockSchema = z.number().int().min(0).nullable();
const sortOrderSchema = z.number().int().min(0);

const createAdminProductVariantInputSchema = z.object({
  productId: idSchema,
  name: nameSchema,
  colorName: z.string().trim().nullable().optional(),
  colorHex: z.string().trim().nullable().optional(),
  sku: z.string().trim().nullable().optional(),
  priceCents: nullableMoneySchema.optional(),
  compareAtCents: nullableMoneySchema.optional(),
  stockQuantity: nullableStockSchema.optional(),
  trackInventory: z.boolean().optional(),
  isDefault: z.boolean().optional(),
  status: productVariantStatusSchema.optional(),
  sortOrder: sortOrderSchema.optional(),
});

const updateAdminProductVariantInputSchema = z.object({
  id: idSchema,
  name: nameSchema,
  colorName: z.string().trim().nullable().optional(),
  colorHex: z.string().trim().nullable().optional(),
  sku: z.string().trim().nullable().optional(),
  priceCents: nullableMoneySchema.optional(),
  compareAtCents: nullableMoneySchema.optional(),
  stockQuantity: nullableStockSchema.optional(),
  trackInventory: z.boolean().optional(),
  isDefault: z.boolean().optional(),
  status: productVariantStatusSchema.optional(),
  sortOrder: sortOrderSchema.optional(),
});

export function parseCreateAdminProductVariantInput(
  input: CreateAdminProductVariantInput
): CreateAdminProductVariantInput {
  const result = createAdminProductVariantInputSchema.safeParse(input);

  if (!result.success) {
    const issue = result.error.issues[0];

    switch (issue?.path[0]) {
      case "productId":
        throw new AdminProductVariantRepositoryError(
          "product_variant_product_not_found",
          "Produit de la variante introuvable."
        );
      case "name":
        throw new AdminProductVariantRepositoryError(
          "product_variant_name_invalid",
          "Le nom de variante est invalide."
        );
      case "priceCents":
      case "compareAtCents":
        throw new AdminProductVariantRepositoryError(
          "product_variant_price_invalid",
          "Le prix de variante est invalide."
        );
      case "stockQuantity":
        throw new AdminProductVariantRepositoryError(
          "product_variant_stock_invalid",
          "Le stock de variante est invalide."
        );
      default:
        throw new AdminProductVariantRepositoryError(
          "product_variant_name_invalid",
          "Les données de variante sont invalides."
        );
    }
  }

  const data = result.data;
  const parsed: CreateAdminProductVariantInput = {
    productId: data.productId,
    name: data.name,
  };

  if (data.colorName !== undefined) parsed.colorName = data.colorName;
  if (data.colorHex !== undefined) parsed.colorHex = data.colorHex;
  if (data.sku !== undefined) parsed.sku = data.sku;
  if (data.priceCents !== undefined) parsed.priceCents = data.priceCents;
  if (data.compareAtCents !== undefined) {
    parsed.compareAtCents = data.compareAtCents;
  }
  if (data.stockQuantity !== undefined) {
    parsed.stockQuantity = data.stockQuantity;
  }
  if (data.trackInventory !== undefined) {
    parsed.trackInventory = data.trackInventory;
  }
  if (data.isDefault !== undefined) parsed.isDefault = data.isDefault;
  if (data.status !== undefined) parsed.status = data.status;
  if (data.sortOrder !== undefined) parsed.sortOrder = data.sortOrder;

  return parsed;
}

export function parseUpdateAdminProductVariantInput(
  input: UpdateAdminProductVariantInput
): UpdateAdminProductVariantInput {
  const result = updateAdminProductVariantInputSchema.safeParse(input);

  if (!result.success) {
    const issue = result.error.issues[0];

    switch (issue?.path[0]) {
      case "id":
        throw new AdminProductVariantRepositoryError(
          "product_variant_not_found",
          "Variante introuvable."
        );
      case "name":
        throw new AdminProductVariantRepositoryError(
          "product_variant_name_invalid",
          "Le nom de variante est invalide."
        );
      case "priceCents":
      case "compareAtCents":
        throw new AdminProductVariantRepositoryError(
          "product_variant_price_invalid",
          "Le prix de variante est invalide."
        );
      case "stockQuantity":
        throw new AdminProductVariantRepositoryError(
          "product_variant_stock_invalid",
          "Le stock de variante est invalide."
        );
      default:
        throw new AdminProductVariantRepositoryError(
          "product_variant_name_invalid",
          "Les données de variante sont invalides."
        );
    }
  }

  const data = result.data;
  const parsed: UpdateAdminProductVariantInput = {
    id: data.id,
    name: data.name,
  };

  if (data.colorName !== undefined) parsed.colorName = data.colorName;
  if (data.colorHex !== undefined) parsed.colorHex = data.colorHex;
  if (data.sku !== undefined) parsed.sku = data.sku;
  if (data.priceCents !== undefined) parsed.priceCents = data.priceCents;
  if (data.compareAtCents !== undefined) {
    parsed.compareAtCents = data.compareAtCents;
  }
  if (data.stockQuantity !== undefined) {
    parsed.stockQuantity = data.stockQuantity;
  }
  if (data.trackInventory !== undefined) {
    parsed.trackInventory = data.trackInventory;
  }
  if (data.isDefault !== undefined) parsed.isDefault = data.isDefault;
  if (data.status !== undefined) parsed.status = data.status;
  if (data.sortOrder !== undefined) parsed.sortOrder = data.sortOrder;

  return parsed;
}
