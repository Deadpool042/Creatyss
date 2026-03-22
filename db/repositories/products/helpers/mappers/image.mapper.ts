import type { AdminProductImageSummary } from "@db-products/admin/image";
import type { ProductImageSummary } from "@db-products/public";
import type {
  AdminProductImageRow,
  AdminProductVariantImageRow,
  ProductDetailRow,
} from "@db-products/types/rows";

export function mapProductImageSummary(
  row: ProductDetailRow["images"][number]
): ProductImageSummary {
  return {
    id: row.id,
    mediaAssetId: row.mediaAssetId,
    storageKey: row.mediaAsset.storageKey,
    altText: row.mediaAsset.altText,
    isPrimary: row.isPrimary,
    sortOrder: row.sortOrder,
  };
}

export function mapAdminProductImageSummary(
  row: AdminProductImageRow | AdminProductVariantImageRow
): AdminProductImageSummary {
  return {
    id: row.id,
    productId: "productId" in row ? row.productId : null,
    productVariantId: "productVariantId" in row ? row.productVariantId : null,
    mediaAssetId: row.mediaAssetId,
    storageKey: row.mediaAsset.storageKey,
    altText: row.mediaAsset.altText,
    isPrimary: row.isPrimary,
    sortOrder: row.sortOrder,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}
