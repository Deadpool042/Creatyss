import {
  ProductStatus,
  ProductVariantStatus,
} from "@/prisma-generated/client";
import type {
  AdminProductLifecycleStatus,
  AdminProductVariantLifecycleStatus,
} from "../types";

export function mapAdminProductStatus(
  status: ProductStatus
): AdminProductLifecycleStatus {
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
}

export function mapAdminProductVariantStatus(
  status: ProductVariantStatus
): AdminProductVariantLifecycleStatus {
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
}
