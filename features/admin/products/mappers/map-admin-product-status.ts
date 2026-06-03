import {
  mapPrismaProductStatusToLifecycleStatus,
  mapPrismaProductVariantStatusToLifecycleStatus,
} from "@/entities/product";
import type {
  AdminProductLifecycleStatus,
  AdminProductVariantLifecycleStatus,
} from "../types";

export function mapAdminProductStatus(
  status: Parameters<typeof mapPrismaProductStatusToLifecycleStatus>[0]
): AdminProductLifecycleStatus {
  return mapPrismaProductStatusToLifecycleStatus(status);
}

export function mapAdminProductVariantStatus(
  status: Parameters<typeof mapPrismaProductVariantStatusToLifecycleStatus>[0]
): AdminProductVariantLifecycleStatus {
  return mapPrismaProductVariantStatusToLifecycleStatus(status);
}
