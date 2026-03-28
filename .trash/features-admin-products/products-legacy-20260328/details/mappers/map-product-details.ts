import { ProductStatus, ProductVariantStatus } from "@prisma-generated/client";

import type { AdminProductDetails } from "../types/product-detail-types";

type ProductDetailsSource = {
  id: string;
  slug: string | null;
  name: string;
  shortDescription: string | null;
  description: string | null;
  status: ProductStatus;
  isFeatured: boolean;
  updatedAt: Date;
  productType: {
    code: string;
  } | null;
  primaryImage: {
    publicUrl: string | null;
    altText: string | null;
  } | null;
  productCategories: Array<{
    isPrimary: boolean;
    sortOrder: number;
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
  variants: Array<{
    id: string;
    slug: string | null;
    name: string | null;
    sku: string;
    status: ProductVariantStatus;
    primaryImage: {
      publicUrl: string | null;
      altText: string | null;
    } | null;
    prices: Array<{
      amount: { toString(): string };
      compareAtAmount: { toString(): string } | null;
    }>;
    optionValues: Array<{
      optionValue: {
        label: string | null;
        value: string;
        option: {
          name: string;
        };
      };
    }>;
  }>;
};

function decimalToString(value: { toString(): string } | null): string | null {
  return value ? value.toString() : null;
}

function mapProductStatusToAdminStatus(status: ProductStatus): AdminProductDetails["status"] {
  if (status === ProductStatus.ACTIVE) {
    return "published";
  }

  if (status === ProductStatus.ARCHIVED) {
    return "archived";
  }

  return "draft";
}

function mapVariantStatusToAdminStatus(
  status: ProductVariantStatus
): AdminProductDetails["variants"][number]["status"] {
  if (status === ProductVariantStatus.ACTIVE) {
    return "published";
  }

  if (status === ProductVariantStatus.ARCHIVED) {
    return "archived";
  }

  return "draft";
}

function mapProductTypeToAdminProductType(input: {
  productTypeCode: string | null;
  variantCount: number;
}): AdminProductDetails["productType"] {
  if (input.productTypeCode === "variable") {
    return "variable";
  }

  if (input.productTypeCode === "simple") {
    return "simple";
  }

  return input.variantCount > 1 ? "variable" : "simple";
}

export function mapProductDetails(product: ProductDetailsSource): AdminProductDetails {
  const activePrice = product.prices[0] ?? null;
  const variantCount = product.variants.length;
  const productType = mapProductTypeToAdminProductType({
    productTypeCode: product.productType?.code ?? null,
    variantCount,
  });

  const categories = product.productCategories.map((item) => ({
    id: item.category.id,
    slug: item.category.slug,
    name: item.category.name,
    isPrimary: item.isPrimary,
    sortOrder: item.sortOrder,
  }));

  const primaryCategory = categories.find((category) => category.isPrimary) ?? null;

  const variants = product.variants.map((variant) => {
    const variantPrice = variant.prices[0] ?? null;

    return {
      id: variant.id,
      slug: variant.slug ?? "",
      name: variant.name,
      sku: variant.sku,
      status: mapVariantStatusToAdminStatus(variant.status),
      primaryImageUrl: variant.primaryImage?.publicUrl ?? null,
      primaryImageAlt: variant.primaryImage?.altText ?? null,
      amount: decimalToString(variantPrice?.amount ?? null),
      compareAtAmount: decimalToString(variantPrice?.compareAtAmount ?? null),
      optionValues: variant.optionValues.map((item) => ({
        optionName: item.optionValue.option.name,
        value: item.optionValue.label ?? item.optionValue.value,
      })),
    };
  });

  return {
    id: product.id,
    slug: product.slug ?? "",
    name: product.name,
    shortDescription: product.shortDescription,
    description: product.description,
    status: mapProductStatusToAdminStatus(product.status),
    isFeatured: product.isFeatured,
    productType,
    updatedAt: product.updatedAt.toISOString(),
    primaryImageUrl: product.primaryImage?.publicUrl ?? null,
    primaryImageAlt: product.primaryImage?.altText ?? null,
    categories,
    primaryCategory,
    amount: decimalToString(activePrice?.amount ?? null),
    compareAtAmount: decimalToString(activePrice?.compareAtAmount ?? null),
    variantCount,
    variants,
    diagnostics: {
      missingPrimaryImage: product.primaryImage === null || product.primaryImage.publicUrl === null,
      missingPrice: activePrice === null,
      missingCategory: categories.length === 0,
    },
  };
}
