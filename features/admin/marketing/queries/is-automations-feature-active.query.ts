import "server-only";

import { queryFeatureFlagActive } from "@/features/admin/pilotage/queries/query-feature-flag-active";

export async function isAutomationsFeatureActive(): Promise<boolean> {
  return queryFeatureFlagActive("engagement.automations");
}
