import "server-only";

import { queryFeatureFlagActive } from "@/features/feature-flags/queries/query-feature-flag-active";

export async function isChannelsFeatureActive(): Promise<boolean> {
  return queryFeatureFlagActive("satellite.channels");
}
