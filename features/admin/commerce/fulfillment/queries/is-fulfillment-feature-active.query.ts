import "server-only";

import { queryFeatureFlagActive } from "@/features/feature-flags/queries/query-feature-flag-active";

export async function isFulfillmentFeatureActive(): Promise<boolean> {
  return queryFeatureFlagActive("commerce.fulfillment");
}
