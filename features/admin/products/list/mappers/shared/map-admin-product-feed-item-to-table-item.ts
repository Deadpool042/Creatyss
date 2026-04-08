import type { AdminProductFeedItem } from "@/features/admin/products/list/types/admin-product-feed.types";
import type { ProductTableItem } from "@/features/admin/products/list/types/product-table.types";

function buildStockLabel(
  input: Pick<AdminProductFeedItem, "stockState" | "stockQuantity">
): string {
  if (input.stockState === "out-of-stock") {
    return `Rupture (${input.stockQuantity})`;
  }

  if (input.stockState === "low-stock") {
    return `Stock faible (${input.stockQuantity})`;
  }

  if (input.stockState === "unknown") {
    return "Stock inconnu";
  }

  return `En stock (${input.stockQuantity})`;
}

export function mapAdminProductFeedItemToTableItem(
  product: AdminProductFeedItem
): ProductTableItem {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    shortDescription: product.shortDescription,
    status: product.status,

    stockQuantity: product.stockQuantity,
    stockState: product.stockState,
    stockLabel: buildStockLabel(product),

    variantCount: product.variantCount,

    priceLabel: product.priceLabel,
    compareAtPriceLabel: product.compareAtPriceLabel,
    hasPromotion: product.hasPromotion,
    priceValue: product.priceValue,

    categoryPathLabel: product.categoryPathLabel,
    categorySlug: product.categorySlug,
    categoryId: product.categoryId,

    primaryImageUrl: product.primaryImageUrl,
    primaryImageAlt: product.primaryImageAlt,

    isFeatured: product.isFeatured,
    updatedAt: product.updatedAt,

    diagnostics: {
      missingPrimaryImage: product.primaryImageUrl === null,
      missingPrice: product.priceValue === null,
    },
  };
}
