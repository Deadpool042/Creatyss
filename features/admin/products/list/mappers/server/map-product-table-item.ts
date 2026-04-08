//features/admin/products/list/mappers/server/map-product-table-item.ts
import type { AdminProductListItem, ProductTableItem } from "@/features/admin/products/list/types";

function buildCategoryPathLabel(input: AdminProductListItem["primaryCategory"]): string | null {
  if (!input) {
    return null;
  }

  if (input.parentName && input.parentName.trim().length > 0) {
    return `${input.parentName} > ${input.name}`;
  }

  return input.name;
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

function parsePriceNumber(value: string | null): number | null {
  if (!value) {
    return null;
  }

  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function buildPriceLabel(input: AdminProductListItem["priceSummary"]): string {
  if (!input.minAmount) {
    return "—";
  }

  const minAmountLabel = formatPriceValue(input.minAmount) ?? "—";

  if (input.hasPriceRange) {
    return `À partir de ${minAmountLabel}`;
  }

  return minAmountLabel;
}

function buildCompareAtLabel(input: AdminProductListItem["priceSummary"]): string | null {
  if (input.hasPriceRange) {
    return null;
  }

  return formatPriceValue(input.minCompareAtAmount);
}

function buildStockLabel(input: Pick<ProductTableItem, "stockState" | "stockQuantity">): string {
  if (input.stockState === "out-of-stock") {
    return `Rupture (${input.stockQuantity})`;
  }

  if (input.stockState === "low-stock") {
    return `Stock faible (${input.stockQuantity})`;
  }

  return `En stock (${input.stockQuantity})`;
}

export function mapProductTableItem(product: AdminProductListItem): ProductTableItem {
  const categoryPathLabel = buildCategoryPathLabel(product.primaryCategory);
  const priceLabel = buildPriceLabel(product.priceSummary);
  const compareAtPriceLabel = buildCompareAtLabel(product.priceSummary);
  const priceValue = parsePriceNumber(product.priceSummary.minAmount);

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    shortDescription: product.shortDescription,
    status: product.status,
    stockQuantity: product.stockQuantity,
    stockState: product.stockState,
    stockLabel: buildStockLabel({
      stockQuantity: product.stockQuantity,
      stockState: product.stockState,
    }),
    variantCount: product.variantCount,
    priceLabel,
    compareAtPriceLabel,
    hasPromotion: product.priceSummary.hasPromotion,
    priceValue,
    categoryPathLabel,
    categorySlug: product.primaryCategory?.slug ?? null,
    categoryId: product.primaryCategory?.id ?? null,
    primaryImageUrl: product.primaryImageUrl,
    primaryImageAlt: product.primaryImageAlt,
    isFeatured: product.isFeatured,
    updatedAt: product.updatedAt,
    diagnostics: product.diagnostics,
  };
}
