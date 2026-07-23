import "server-only";

import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";

export async function isSearchFeatureActive(): Promise<boolean> {
  return meetsFeatureLevel("satellite.search", "basic");
}
