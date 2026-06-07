import "server-only";

import { queryFeatureFlagActive } from "@/features/admin/pilotage/queries/query-feature-flag-active";

export async function isRelatedProductsFeatureActive(): Promise<boolean> {
  return queryFeatureFlagActive("catalog.products.related");
}
