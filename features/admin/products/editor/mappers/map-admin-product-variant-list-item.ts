import { ProductStatus } from "@/prisma-generated/client";

import type { AdminProductVariantListItem } from "@/features/admin/products/editor/types/product-variants.types";

type ProductVariantListSource = {
  id: string;
  productId: string;
  slug: string | null;
  name: string | null;
  sku: string;
  status: ProductStatus;
  isDefault: boolean;
  sortOrder: number;
  primaryImageId: string | null;
  primaryImage: {
    publicUrl: string | null;
    altText: string | null;
  } | null;
  prices: Array<{
    amount: { toString(): string };
    compareAtAmount: { toString(): string } | null;
  }>;
};

function decimalToString(value: { toString(): string } | null): string | null {
  return value ? value.toString() : null;
}

function mapProductStatusToAdminVariantStatus(
  status: ProductStatus
): AdminProductVariantListItem["status"] {
  if (status === ProductStatus.ACTIVE) {
    return "published";
  }

  if (status === ProductStatus.ARCHIVED) {
    return "archived";
  }

  return "draft";
}

export function mapAdminProductVariantListItem(
  variant: ProductVariantListSource
): AdminProductVariantListItem {
  const activePrice = variant.prices[0] ?? null;

  return {
    id: variant.id,
    productId: variant.productId,
    slug: variant.slug ?? "",
    name: variant.name ?? "",
    sku: variant.sku,
    status: mapProductStatusToAdminVariantStatus(variant.status),
    isDefault: variant.isDefault,
    sortOrder: variant.sortOrder,
    primaryImageId: variant.primaryImageId,
    primaryImageUrl: variant.primaryImage?.publicUrl ?? null,
    primaryImageAlt: variant.primaryImage?.altText ?? null,
    amount: decimalToString(activePrice?.amount ?? null),
    compareAtAmount: decimalToString(activePrice?.compareAtAmount ?? null),
  };
}
