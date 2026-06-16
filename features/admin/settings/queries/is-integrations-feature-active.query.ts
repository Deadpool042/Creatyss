import "server-only";

import { queryFeatureFlagActive } from "@/features/feature-flags/queries/query-feature-flag-active";

export async function isIntegrationsFeatureActive(): Promise<boolean> {
  return queryFeatureFlagActive("platform.integrations");
}
