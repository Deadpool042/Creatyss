import "server-only";

import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";

export async function isFulfillmentFeatureActive(): Promise<boolean> {
  return meetsFeatureLevel("commerce.fulfillment", "manual");
}
