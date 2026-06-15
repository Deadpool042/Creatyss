import "server-only";

import { queryFeatureFlagActive } from "@/features/admin/pilotage/queries/query-feature-flag-active";

export async function isFulfillmentFeatureActive(): Promise<boolean> {
  return queryFeatureFlagActive("commerce.fulfillment");
}
