import "server-only";

import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";

export async function isAnalyticsFeatureActive(): Promise<boolean> {
  return meetsFeatureLevel("engagement.analytics", "read");
}
