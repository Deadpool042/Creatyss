import "server-only";

import { getAnalyticsClient } from "@/features/analytics/providers/resolve-analytics-provider";
import type { AnalyticsTopPage } from "@/features/analytics/providers/analytics-provider.types";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";

export type AnalyticsTopPagesData = readonly AnalyticsTopPage[];

/**
 * Top pages visitées, via le provider analytics actif (`getAnalyticsClient`).
 * `null` si le niveau `read` du flag `engagement.analytics` n'est pas
 * atteint, ou si le provider n'a pas de données — le composant retombe
 * alors sur le mock existant.
 */
export async function getAnalyticsTopPagesData(): Promise<AnalyticsTopPagesData | null> {
  const levelMet = await meetsFeatureLevel("engagement.analytics", "read");
  if (!levelMet) {
    return null;
  }

  return getAnalyticsClient().getTopPages();
}
