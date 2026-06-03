import {
  mapProductLifecycleStatusToPrismaStatus,
  type ProductLifecycleStatus,
} from "@/entities/product";

export type { ProductLifecycleStatus };

export function mapProductStatusToPrismaStatus(status: ProductLifecycleStatus) {
  return mapProductLifecycleStatusToPrismaStatus(status);
}

export { mapProductLifecycleStatusToPrismaStatus };
