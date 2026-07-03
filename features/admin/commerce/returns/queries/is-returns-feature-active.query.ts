import "server-only";

import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";

export async function isReturnsFeatureActive(): Promise<boolean> {
  return meetsFeatureLevel("commerce.returns", "manual");
}
