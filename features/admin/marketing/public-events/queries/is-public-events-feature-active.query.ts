import "server-only";

import { queryFeatureFlagActive } from "@/features/feature-flags/queries/query-feature-flag-active";

export async function isPublicEventsFeatureActive(): Promise<boolean> {
  return queryFeatureFlagActive("engagement.public-events");
}
