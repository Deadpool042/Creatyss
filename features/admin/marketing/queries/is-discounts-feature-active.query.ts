import "server-only";

import { queryFeatureFlagActive } from "@/features/feature-flags/queries/query-feature-flag-active";

export async function isDiscountsFeatureActive(): Promise<boolean> {
  return queryFeatureFlagActive("commerce.discounts");
}
