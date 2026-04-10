import type { AdminProductFeedItem, ProductTableItem } from "../../types";

export function mapAdminProductFeedItemToTableItem(
  item: AdminProductFeedItem
): ProductTableItem {
  return {
    id: item.id,
    slug: item.slug,
    name: item.name,
    shortDescription: item.shortDescription,
    status: item.status,
    isFeatured: item.isFeatured,
    primaryImageUrl: item.primaryImageUrl,
    primaryImageAlt: item.primaryImageAlt,
    categoryNames: item.categoryNames,
    categoryPathLabel: item.categoryPathLabel ?? "",
    productTypeName: item.productTypeName,
    variantCount: item.variantCount,
    stockState: item.stockState === "in-stock" ? "in-stock" : "out-of-stock",
    stockQuantity: item.stockQuantity,
    priceLabel: item.priceLabel ?? "",
    compareAtPriceLabel: item.compareAtPriceLabel ?? "",
    hasPromotion: item.hasPromotion,
    updatedAt: item.updatedAt,
  };
}
