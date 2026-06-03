import {
  ProductStatus,
  ProductVariantStatus,
} from "@/prisma-generated/client";

import type {
  ProductLifecycleStatus,
} from "./product-lifecycle-status";
import type { ProductVariantLifecycleStatus } from "./product-variant-lifecycle-status";

function unreachable(value: never): never {
  throw new Error(`unreachable status: ${String(value)}`);
}

export function mapProductLifecycleStatusToPrismaStatus(
  status: ProductLifecycleStatus
): ProductStatus {
  switch (status) {
    case "draft":
      return ProductStatus.DRAFT;
    case "active":
      return ProductStatus.ACTIVE;
    case "inactive":
      return ProductStatus.INACTIVE;
    case "archived":
      return ProductStatus.ARCHIVED;
  }

  return unreachable(status);
}

export function mapPrismaProductStatusToLifecycleStatus(
  status: ProductStatus
): ProductLifecycleStatus {
  switch (status) {
    case ProductStatus.DRAFT:
      return "draft";
    case ProductStatus.ACTIVE:
      return "active";
    case ProductStatus.INACTIVE:
      return "inactive";
    case ProductStatus.ARCHIVED:
      return "archived";
  }

  return unreachable(status);
}

export function mapProductVariantLifecycleStatusToPrismaStatus(
  status: ProductVariantLifecycleStatus
): ProductVariantStatus {
  switch (status) {
    case "draft":
      return ProductVariantStatus.DRAFT;
    case "active":
      return ProductVariantStatus.ACTIVE;
    case "inactive":
      return ProductVariantStatus.INACTIVE;
    case "archived":
      return ProductVariantStatus.ARCHIVED;
  }

  return unreachable(status);
}

export function mapPrismaProductVariantStatusToLifecycleStatus(
  status: ProductVariantStatus
): ProductVariantLifecycleStatus {
  switch (status) {
    case ProductVariantStatus.DRAFT:
      return "draft";
    case ProductVariantStatus.ACTIVE:
      return "active";
    case ProductVariantStatus.INACTIVE:
      return "inactive";
    case ProductVariantStatus.ARCHIVED:
      return "archived";
  }

  return unreachable(status);
}
