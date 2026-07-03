import "server-only";

import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";

export async function isDocumentsFeatureActive(): Promise<boolean> {
  return meetsFeatureLevel("commerce.documents", "basic");
}
