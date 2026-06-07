import "server-only";

import { queryFeatureFlagActive } from "@/features/admin/pilotage/queries/query-feature-flag-active";

export async function isShippingFeatureActive(): Promise<boolean> {
  return queryFeatureFlagActive("commerce.shipping");
}
