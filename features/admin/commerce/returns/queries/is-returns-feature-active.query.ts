import "server-only";

import { queryFeatureFlagActive } from "@/features/feature-flags/queries/query-feature-flag-active";

export async function isReturnsFeatureActive(): Promise<boolean> {
  return queryFeatureFlagActive("commerce.returns");
}
