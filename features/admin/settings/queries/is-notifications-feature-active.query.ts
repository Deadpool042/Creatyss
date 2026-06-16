import "server-only";

import { queryFeatureFlagActive } from "@/features/feature-flags/queries/query-feature-flag-active";

export async function isNotificationsFeatureActive(): Promise<boolean> {
  return queryFeatureFlagActive("platform.notifications");
}
