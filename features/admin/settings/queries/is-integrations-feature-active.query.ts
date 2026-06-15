import "server-only";

import { queryFeatureFlagActive } from "@/features/admin/pilotage/queries/query-feature-flag-active";

export async function isIntegrationsFeatureActive(): Promise<boolean> {
  return queryFeatureFlagActive("platform.integrations");
}
