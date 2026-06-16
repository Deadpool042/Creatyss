import "server-only";

import { queryFeatureFlagActive } from "@/features/feature-flags/queries/query-feature-flag-active";

export async function isTaxationFeatureActive(): Promise<boolean> {
  return queryFeatureFlagActive("commerce.taxation");
}
