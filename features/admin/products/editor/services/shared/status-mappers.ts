import {
  AvailabilityStatus,
  ProductStatus,
  ProductVariantStatus,
} from "@/prisma-generated/client";

export function mapEditorStatusToPrismaStatus(
  status: "draft" | "active" | "inactive" | "archived"
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
