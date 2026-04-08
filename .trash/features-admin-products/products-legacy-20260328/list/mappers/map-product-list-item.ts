import { ProductStatus } from "@/prisma-generated/client";

import type { AdminProductListItem } from "../types/product-list.types";

type ProductListSource = {
  id: string;
  slug: string | null;
  name: string;
  shortDescription: string | null;
  status: ProductStatus;
  isFeatured: boolean;
  updatedAt: Date;
  primaryImage: {
    publicUrl: string | null;
    altText: string | null;
  } | null;
  productType: {
    code: string;
  } | null;
  productCategories: Array<{
    category: {
      id: string;
      slug: string;
      name: string;
    };
  }>;
  prices: Array<{
    amount: { toString(): string };
    compareAtAmount: { toString(): string } | null;
  }>;
  _count: {
    variants: number;
    productCategories: number;
  };
};

function decimalToString(value: { toString(): string } | null): string | null {
  return value ? value.toString() : null;
}

function mapProductStatusToAdminStatus(status: ProductStatus): AdminProductListItem["status"] {
  if (status === ProductStatus.ACTIVE) {
    return "published";
  }

  if (status === ProductStatus.ARCHIVED) {
    return "archived";
  }

  return "draft";
}

function mapProductTypeToAdminProductType(input: {
  productTypeCode: string | null;
  variantCount: number;
}): AdminProductListItem["productType"] {
  if (input.productTypeCode === "variable") {
    return "variable";
  }

  if (input.productTypeCode === "simple") {
    return "simple";
  }

  return input.variantCount > 1 ? "variable" : "simple";
}

export function mapProductListItem(product: ProductListSource): AdminProductListItem {
  const variantCount = product._count.variants;
  const primaryCategory = product.productCategories[0]?.category ?? null;
  const activePrice = product.prices[0] ?? null;

  return {
    id: product.id,
    slug: product.slug ?? "",
    name: product.name,
    shortDescription: product.shortDescription,
    status: mapProductStatusToAdminStatus(product.status),
    isFeatured: product.isFeatured,
    productType: mapProductTypeToAdminProductType({
      productTypeCode: product.productType?.code ?? null,
      variantCount,
    }),
    variantCount,
    categoryCount: product._count.productCategories,
    primaryCategory: primaryCategory
      ? {
          id: primaryCategory.id,
          slug: primaryCategory.slug,
          name: primaryCategory.name,
        }
      : null,
    primaryImageUrl: product.primaryImage?.publicUrl ?? null,
    primaryImageAlt: product.primaryImage?.altText ?? null,
    amount: decimalToString(activePrice?.amount ?? null),
    compareAtAmount: decimalToString(activePrice?.compareAtAmount ?? null),
    updatedAt: product.updatedAt.toISOString(),
    diagnostics: {
      missingPrimaryImage: product.primaryImage === null || product.primaryImage.publicUrl === null,
      missingPrice: activePrice === null,
    },
  };
}
