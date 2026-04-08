import { ProductStatus } from "@/prisma-generated/client";

import type { AdminProductListItem } from "@/features/admin/products/list/types";

type DecimalLike = {
  toString(): string;
};

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
      parent: {
        name: string;
      } | null;
    };
  }>;
  variants: Array<{
    inventoryItems: Array<{
      onHandQuantity: number;
      reservedQuantity: number;
    }>;
    prices: Array<{
      amount: DecimalLike;
      compareAtAmount: DecimalLike | null;
    }>;
  }>;
  _count: {
    variants: number;
    productCategories: number;
  };
};

function decimalToString(value: DecimalLike | null): string | null {
  return value ? value.toString() : null;
}

function parseDecimal(value: DecimalLike | null): number | null {
  if (!value) {
    return null;
  }

  const parsed = Number.parseFloat(value.toString());
  return Number.isFinite(parsed) ? parsed : null;
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

function mapStock(input: {
  variants: Array<{
    inventoryItems: Array<{
      onHandQuantity: number;
      reservedQuantity: number;
    }>;
  }>;
}): Pick<AdminProductListItem, "stockQuantity" | "stockState"> {
  const stockQuantity = input.variants.reduce((productTotal, variant) => {
    const variantTotal = variant.inventoryItems.reduce((sum, inventoryItem) => {
      return sum + inventoryItem.onHandQuantity - inventoryItem.reservedQuantity;
    }, 0);

    return productTotal + variantTotal;
  }, 0);

  if (stockQuantity <= 0) {
    return {
      stockQuantity,
      stockState: "out-of-stock",
    };
  }

  if (stockQuantity <= 5) {
    return {
      stockQuantity,
      stockState: "low-stock",
    };
  }

  return {
    stockQuantity,
    stockState: "in-stock",
  };
}

function mapPriceSummary(input: {
  variants: Array<{
    prices: Array<{
      amount: DecimalLike;
      compareAtAmount: DecimalLike | null;
    }>;
  }>;
}): AdminProductListItem["priceSummary"] {
  const prices = input.variants.flatMap((variant) => variant.prices);

  if (prices.length === 0) {
    return {
      minAmount: null,
      maxAmount: null,
      minCompareAtAmount: null,
      hasPriceRange: false,
      hasPromotion: false,
    };
  }

  let minAmountValue: number | null = null;
  let maxAmountValue: number | null = null;
  let minAmount: string | null = null;
  let maxAmount: string | null = null;
  let minCompareAtValue: number | null = null;
  let minCompareAtAmount: string | null = null;
  let hasPromotion = false;

  for (const price of prices) {
    const amountValue = parseDecimal(price.amount);
    const compareAtValue = parseDecimal(price.compareAtAmount);

    if (amountValue !== null) {
      if (minAmountValue === null || amountValue < minAmountValue) {
        minAmountValue = amountValue;
        minAmount = decimalToString(price.amount);
      }

      if (maxAmountValue === null || amountValue > maxAmountValue) {
        maxAmountValue = amountValue;
        maxAmount = decimalToString(price.amount);
      }
    }

    if (amountValue !== null && compareAtValue !== null && compareAtValue > amountValue) {
      hasPromotion = true;

      if (minCompareAtValue === null || compareAtValue < minCompareAtValue) {
        minCompareAtValue = compareAtValue;
        minCompareAtAmount = decimalToString(price.compareAtAmount);
      }
    }
  }

  return {
    minAmount,
    maxAmount,
    minCompareAtAmount,
    hasPriceRange:
      minAmountValue !== null && maxAmountValue !== null && minAmountValue !== maxAmountValue,
    hasPromotion,
  };
}

export function mapProductListItem(product: ProductListSource): AdminProductListItem {
  const variantCount = product._count.variants;
  const priceSummary = mapPriceSummary({
    variants: product.variants,
  });
  const stock = mapStock({
    variants: product.variants,
  });
  const primaryCategory = product.productCategories[0]?.category ?? null;

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
          parentName: primaryCategory.parent?.name ?? null,
        }
      : null,
    primaryImageUrl: product.primaryImage?.publicUrl ?? null,
    primaryImageAlt: product.primaryImage?.altText ?? null,
    amount: priceSummary.minAmount,
    compareAtAmount: priceSummary.hasPriceRange ? null : priceSummary.minCompareAtAmount,
    priceSummary,
    updatedAt: product.updatedAt.toISOString(),
    stockQuantity: stock.stockQuantity,
    stockState: stock.stockState,
    diagnostics: {
      missingPrimaryImage: product.primaryImage?.publicUrl == null,
      missingPrice: priceSummary.minAmount == null,
    },
  };
}
