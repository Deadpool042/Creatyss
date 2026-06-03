import {
  AvailabilityStatus,
} from "@/prisma-generated/client";
import {
  type ProductAvailabilityStatus,
  mapProductLifecycleStatusToPrismaStatus,
  mapProductVariantLifecycleStatusToPrismaStatus,
  type ProductLifecycleStatus,
  type ProductVariantLifecycleStatus,
} from "@/entities/product";

export function mapEditorStatusToPrismaStatus(
  status: ProductLifecycleStatus
): ReturnType<typeof mapProductLifecycleStatusToPrismaStatus> {
  return mapProductLifecycleStatusToPrismaStatus(status);
}

export function mapEditorVariantStatusToPrismaStatus(
  status: ProductVariantLifecycleStatus
): ReturnType<typeof mapProductVariantLifecycleStatusToPrismaStatus> {
  return mapProductVariantLifecycleStatusToPrismaStatus(status);
}

export function mapEditorAvailabilityStatusToPrismaStatus(
  status: ProductAvailabilityStatus
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
