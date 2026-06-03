import { RelatedProductType } from "@/prisma-generated/client";

import type { ProductRelatedType } from "./product-related-type";

export function mapProductRelatedTypeToPrismaRelatedType(
  type: ProductRelatedType
): RelatedProductType {
  switch (type) {
    case "related":
      return RelatedProductType.RELATED;
    case "cross_sell":
      return RelatedProductType.CROSS_SELL;
    case "up_sell":
      return RelatedProductType.UP_SELL;
    case "accessory":
      return RelatedProductType.ACCESSORY;
    case "similar":
      return RelatedProductType.SIMILAR;
  }
}

export function mapPrismaRelatedTypeToProductRelatedType(
  type: RelatedProductType
): ProductRelatedType {
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
