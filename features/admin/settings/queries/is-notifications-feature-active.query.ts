import "server-only";

import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";

export async function isNotificationsFeatureActive(): Promise<boolean> {
  return meetsFeatureLevel("platform.notifications", "basic");
}
