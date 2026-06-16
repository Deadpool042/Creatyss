import "server-only";

import { queryFeatureFlagActive } from "@/features/feature-flags/queries/query-feature-flag-active";

export async function isAiFeatureActive(): Promise<boolean> {
  return queryFeatureFlagActive("ai.core");
}
