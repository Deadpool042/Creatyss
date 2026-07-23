import "server-only";

import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";

export async function isPublicEventsFeatureActive(): Promise<boolean> {
  return meetsFeatureLevel("engagement.public-events", "basic");
}
