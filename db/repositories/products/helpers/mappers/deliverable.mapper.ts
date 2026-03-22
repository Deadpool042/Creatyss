import type { AdminProductDeliverableDetail } from "@db-products/admin/deliverable";
import type { ProductDeliverableRow } from "@db-products/types/rows";

export function mapAdminProductDeliverable(
  row: ProductDeliverableRow
): AdminProductDeliverableDetail {
  return {
    id: row.id,
    productId: row.productId,
    mediaAssetId: row.mediaAssetId,
    name: row.name,
    kind: row.kind,
    isPrimary: row.isPrimary,
    sortOrder: row.sortOrder,
    requiresPurchase: row.requiresPurchase,
    isActive: row.isActive,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}
