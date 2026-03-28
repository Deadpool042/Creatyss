import {
  CategoryStatus,
  ProductStatus,
  ProductVariantStatus,
} from "../../../src/generated/prisma/client";

export function normalizeCategoryStatus(value: string | null | undefined): CategoryStatus {
  if (value === "publish") {
    return CategoryStatus.ACTIVE;
  }

  if (value === "draft" || value === "pending" || value === "private") {
    return CategoryStatus.DRAFT;
  }

  return CategoryStatus.ACTIVE;
}

export function normalizeProductStatus(value: string): ProductStatus {
  if (value === "publish") {
    return ProductStatus.ACTIVE;
  }

  if (value === "draft" || value === "pending" || value === "private") {
    return ProductStatus.DRAFT;
  }

  return ProductStatus.ARCHIVED;
}

export function normalizeVariantStatus(
  parentStatus: ProductStatus,
  value?: string
): ProductVariantStatus {
  if (parentStatus === ProductStatus.ARCHIVED) {
    return ProductVariantStatus.ARCHIVED;
  }

  if (!value || value === "publish") {
    return ProductVariantStatus.ACTIVE;
  }

  if (value === "draft" || value === "pending" || value === "private") {
    return ProductVariantStatus.DRAFT;
  }

  return ProductVariantStatus.ARCHIVED;
}
