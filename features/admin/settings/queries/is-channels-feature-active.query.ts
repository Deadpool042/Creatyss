import "server-only";

import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";

export async function isChannelsFeatureActive(): Promise<boolean> {
  return meetsFeatureLevel("satellite.channels", "basic");
}
