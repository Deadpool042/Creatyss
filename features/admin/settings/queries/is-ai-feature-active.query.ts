import "server-only";

import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";

export async function isAiFeatureActive(): Promise<boolean> {
  return meetsFeatureLevel("ai.core", "basic");
}
