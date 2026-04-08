import { ProductStatus, type Prisma } from "@/prisma-generated/client";

import type { AdminProductFeedItem } from "@/features/admin/products/list/types/admin-product-feed.types";

type DecimalLike = {
  toString(): string;
};

type ProductFeedRow = Prisma.ProductGetPayload<{
  select: {
    id: true;
    slug: true;
    name: true;
    shortDescription: true;
    description: true;
    status: true;
    isFeatured: true;
    updatedAt: true;
    primaryImage: {
      select: {
        publicUrl: true;
        altText: true;
      };
    };
    variants: {
      select: {
        inventoryItems: {
          where: {
            status: "ACTIVE";
          };
          select: {
            onHandQuantity: true;
            reservedQuantity: true;
          };
        };
        prices: {
          where: {
            isActive: true;
          };
          select: {
            amount: true;
            compareAtAmount: true;
          };
        };
      };
    };
    _count: {
      select: {
        variants: true;
      };
    };
    productCategories: {
      where: {
        isPrimary: true;
      };
      orderBy: {
        sortOrder: "asc";
      };
      take: 1;
      select: {
        category: {
          select: {
            id: true;
            slug: true;
            name: true;
            parent: {
              select: {
                name: true;
              };
            };
          };
        };
      };
    };
  };
}>;

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

function normalizeProductStatus(status: ProductStatus): AdminProductFeedItem["status"] {
  if (status === ProductStatus.ACTIVE) {
    return "published";
  }

  if (status === ProductStatus.ARCHIVED) {
    return "archived";
  }

  return "draft";
}

function mapStock(input: {
  variants: Array<{
    inventoryItems: Array<{
      onHandQuantity: number;
      reservedQuantity: number;
    }>;
  }>;
}): Pick<AdminProductFeedItem, "stockQuantity" | "stockState"> {
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
}): {
  minAmount: string | null;
  maxAmount: string | null;
  minCompareAtAmount: string | null;
  hasPriceRange: boolean;
  hasPromotion: boolean;
} {
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

function formatPriceValue(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const parsed = Number.parseFloat(value);

  if (!Number.isFinite(parsed)) {
    return value;
  }

  return `${parsed.toFixed(2)} €`;
}

function buildPriceLabel(input: { minAmount: string | null; hasPriceRange: boolean }): string {
  if (!input.minAmount) {
    return "—";
  }

  const minAmountLabel = formatPriceValue(input.minAmount) ?? "—";

  if (input.hasPriceRange) {
    return `À partir de ${minAmountLabel}`;
  }

  return minAmountLabel;
}

function buildCompareAtPriceLabel(input: {
  minCompareAtAmount: string | null;
  hasPriceRange: boolean;
}): string | null {
  if (input.hasPriceRange) {
    return null;
  }

  return formatPriceValue(input.minCompareAtAmount);
}

function buildCategoryPathLabel(
  input: {
    name: string;
    parentName: string | null;
  } | null
): string | null {
  if (!input) {
    return null;
  }

  if (input.parentName && input.parentName.trim().length > 0) {
    return `${input.parentName} > ${input.name}`;
  }

  return input.name;
}

export function mapAdminProductFeedItem(product: ProductFeedRow): AdminProductFeedItem {
  const priceSummary = mapPriceSummary({
    variants: product.variants,
  });

  const stock = mapStock({
    variants: product.variants,
  });

  const primaryCategory = product.productCategories[0]?.category ?? null;
  const minPriceValue = priceSummary.minAmount
    ? parseDecimal({ toString: () => priceSummary.minAmount as string })
    : null;

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    shortDescription: product.shortDescription ?? product.description ?? null,
    status: normalizeProductStatus(product.status),

    primaryImageUrl: product.primaryImage?.publicUrl ?? null,
    primaryImageAlt: product.primaryImage?.altText ?? null,

    stockQuantity: stock.stockQuantity,
    stockState: stock.stockState,
    variantCount: product._count.variants,

    priceLabel: buildPriceLabel(priceSummary),
    compareAtPriceLabel: buildCompareAtPriceLabel(priceSummary),
    hasPromotion: priceSummary.hasPromotion,
    priceValue: minPriceValue,

    categoryPathLabel: buildCategoryPathLabel(
      primaryCategory
        ? {
            name: primaryCategory.name,
            parentName: primaryCategory.parent?.name ?? null,
          }
        : null
    ),
    categorySlug: primaryCategory?.slug ?? null,
    categoryId: primaryCategory?.id ?? null,

    isFeatured: product.isFeatured,
    updatedAt: product.updatedAt.toISOString(),
  };
}
