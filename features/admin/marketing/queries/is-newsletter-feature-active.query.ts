import "server-only";

import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";

export async function isNewsletterFeatureActive(): Promise<boolean> {
  return meetsFeatureLevel("engagement.newsletter", "basic");
}
