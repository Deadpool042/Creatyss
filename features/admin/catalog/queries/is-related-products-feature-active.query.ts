import "server-only";

import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";

export async function isRelatedProductsFeatureActive(): Promise<boolean> {
  return meetsFeatureLevel("catalog.products.related", "storefront");
}
