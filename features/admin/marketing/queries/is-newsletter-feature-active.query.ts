import "server-only";

import { queryFeatureFlagActive } from "@/features/feature-flags/queries/query-feature-flag-active";

export async function isNewsletterFeatureActive(): Promise<boolean> {
  return queryFeatureFlagActive("engagement.newsletter");
}
