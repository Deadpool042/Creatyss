import "server-only";

import { queryFeatureFlagActive } from "@/features/feature-flags/queries/query-feature-flag-active";

export async function isAutomationsFeatureActive(): Promise<boolean> {
  return queryFeatureFlagActive("engagement.automations");
}
