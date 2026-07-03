import "server-only";

import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";

export async function isWebhooksFeatureActive(): Promise<boolean> {
  return meetsFeatureLevel("platform.webhooks", "read");
}
