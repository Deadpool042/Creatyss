import "server-only";

import { queryFeatureFlagActive } from "@/features/feature-flags/queries/query-feature-flag-active";

export async function isShippingFeatureActive(): Promise<boolean> {
  return queryFeatureFlagActive("commerce.shipping");
}
