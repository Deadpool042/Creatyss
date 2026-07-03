import "server-only";

import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";

export async function isShippingFeatureActive(): Promise<boolean> {
  return meetsFeatureLevel("commerce.shipping", "read");
}
