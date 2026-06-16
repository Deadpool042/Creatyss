import "server-only";

import { queryFeatureFlagActive } from "@/features/feature-flags/queries/query-feature-flag-active";

export async function isRelatedProductsFeatureActive(): Promise<boolean> {
  return queryFeatureFlagActive("catalog.products.related");
}
