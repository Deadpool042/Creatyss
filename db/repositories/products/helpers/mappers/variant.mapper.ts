import type {
  AdminProductVariantDetail,
  AdminProductVariantSummary,
} from "@db-products/admin/variant";
import type { ProductVariantSummary } from "@db-products/public";
import type { ProductVariantRow } from "@db-products/types/rows";

export function mapProductVariantSummary(row: ProductVariantRow): ProductVariantSummary {
  return {
    id: row.id,
    name: row.name,
    colorName: row.colorName,
    colorHex: row.colorHex,
    sku: row.sku,
    priceCents: row.priceCents,
    compareAtCents: row.compareAtCents,
    stockQuantity: row.stockQuantity,
    trackInventory: row.trackInventory,
    isDefault: row.isDefault,
    status: row.status,
    sortOrder: row.sortOrder,
  };
}

export function mapAdminProductVariantSummary(row: ProductVariantRow): AdminProductVariantSummary {
  return {
    id: row.id,
    productId: row.productId,
    name: row.name,
    colorName: row.colorName,
    colorHex: row.colorHex,
    sku: row.sku,
    priceCents: row.priceCents,
    compareAtCents: row.compareAtCents,
    stockQuantity: row.stockQuantity,
    trackInventory: row.trackInventory,
    isDefault: row.isDefault,
    status: row.status,
    sortOrder: row.sortOrder,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function mapAdminProductVariantDetail(row: ProductVariantRow): AdminProductVariantDetail {
  return mapAdminProductVariantSummary(row);
}
