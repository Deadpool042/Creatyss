import {
  AvailabilityStatus,
  ProductVariantStatus,
  type ProductStatus,
} from "@/prisma-generated/client";
import {
  mapProductStatusToPrismaStatus,
  type ProductLifecycleStatus,
} from "@/features/admin/products/services";

export function mapEditorStatusToPrismaStatus(
  status: ProductLifecycleStatus
): ProductStatus {
  return mapProductStatusToPrismaStatus(status);
}

export function mapEditorVariantStatusToPrismaStatus(
  status: "draft" | "active" | "inactive" | "archived"
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
}

export function mapEditorAvailabilityStatusToPrismaStatus(
  status: "available" | "unavailable" | "preorder" | "backorder" | "discontinued" | "archived"
): AvailabilityStatus {
  switch (status) {
    case "available":
      return AvailabilityStatus.AVAILABLE;
    case "preorder":
      return AvailabilityStatus.PREORDER;
    case "backorder":
      return AvailabilityStatus.BACKORDER;
    case "discontinued":
      return AvailabilityStatus.DISCONTINUED;
    case "archived":
      return AvailabilityStatus.ARCHIVED;
    default:
      return AvailabilityStatus.UNAVAILABLE;
  }
}
