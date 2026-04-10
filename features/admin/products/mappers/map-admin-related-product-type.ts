import { RelatedProductType } from "@/prisma-generated/client";
import type { AdminRelatedProductType } from "../types";

export function mapAdminRelatedProductType(
  type: RelatedProductType
): AdminRelatedProductType {
  switch (type) {
    case RelatedProductType.RELATED:
      return "related";
    case RelatedProductType.CROSS_SELL:
      return "cross_sell";
    case RelatedProductType.UP_SELL:
      return "up_sell";
    case RelatedProductType.ACCESSORY:
      return "accessory";
    case RelatedProductType.SIMILAR:
      return "similar";
  }
}
