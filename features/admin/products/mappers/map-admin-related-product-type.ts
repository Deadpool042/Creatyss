import { mapPrismaRelatedTypeToProductRelatedType } from "@/entities/product";
import type { AdminRelatedProductType } from "../types";

export function mapAdminRelatedProductType(
  type: Parameters<typeof mapPrismaRelatedTypeToProductRelatedType>[0]
): AdminRelatedProductType {
  return mapPrismaRelatedTypeToProductRelatedType(type);
}
