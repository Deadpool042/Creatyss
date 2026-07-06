import "server-only";

import { isUmamiConfigured } from "@/core/config/env/umami";
import { fetchUmamiTopPages, type UmamiTopPage } from "@/core/analytics/umami/umami-client";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";

export type UmamiTopPagesData = readonly UmamiTopPage[];

/**
 * Top pages visitées lues depuis Umami (self-hosted, REST API). `null` si
 * Umami n'est pas configuré, si le niveau `read` du flag
 * `engagement.analytics` n'est pas atteint, ou si l'appel échoue — le
 * composant retombe alors sur le mock existant.
 */
export async function getUmamiTopPagesData(): Promise<UmamiTopPagesData | null> {
  if (!isUmamiConfigured()) {
    return null;
  }

  const levelMet = await meetsFeatureLevel("engagement.analytics", "read");
  if (!levelMet) {
    return null;
  }

  return fetchUmamiTopPages();
}
