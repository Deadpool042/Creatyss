import "server-only";

import { queryFeatureFlagActive } from "@/features/admin/pilotage/queries/query-feature-flag-active";

export async function isChannelsFeatureActive(): Promise<boolean> {
  return queryFeatureFlagActive("satellite.channels");
}
