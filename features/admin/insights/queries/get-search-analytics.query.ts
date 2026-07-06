import "server-only";

import { db } from "@/core/db";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import {
  getUtcDayRange,
  STOREFRONT_ANALYTICS_DIMENSION_KEY,
  STOREFRONT_ANALYTICS_DIMENSION_TYPE,
  STOREFRONT_ANALYTICS_METRICS,
} from "@/features/analytics/tracking/record-storefront-analytics-event.service";

const DAY_MS = 24 * 60 * 60 * 1000;
const TOP_TERMS_WINDOW_DAYS = 30;
const TOP_TERMS_LIMIT = 5;
const SEARCH_TERM_DIMENSION_TYPE = "term";

export type SearchAnalyticsTerm = Readonly<{ term: string; count: number }>;

export type SearchAnalyticsZeroResults = Readonly<{
  today: number;
  yesterday: number;
  /** Variation en % vs hier — `null` si hier est à zéro (non calculable). */
  deltaPercent: number | null;
}>;

export type SearchAnalytics = Readonly<{
  topTerms: SearchAnalyticsTerm[];
  zeroResults: SearchAnalyticsZeroResults;
}>;

const EMPTY_SEARCH_ANALYTICS: SearchAnalytics = {
  topTerms: [],
  zeroResults: { today: 0, yesterday: 0, deltaPercent: null },
};

/**
 * Lecture des métriques de recherche storefront écrites par
 * `trackStorefrontSearchEvent` (tracking anonyme sans cookie, sans lien à
 * une conversion — cf. `docs/roadmap/analyses-cockpit-analytique/lot-5-cockpit-consolide-cadrage.md`) :
 * - top termes recherchés : somme des compteurs quotidiens par terme normalisé
 *   sur une fenêtre glissante de 30 jours ;
 * - recherches sans résultat : compteur agrégé (sans détail par terme)
 *   aujourd'hui vs hier, même calcul que `getDailyTrafficAnalytics`.
 */
export async function getSearchAnalytics(): Promise<SearchAnalytics> {
  const storeId = await getCurrentStoreId();

  if (storeId === null) {
    return EMPTY_SEARCH_ANALYTICS;
  }

  const now = new Date();
  const { periodStart: todayStart, periodEnd: todayEnd } = getUtcDayRange(now);
  const yesterdayStart = new Date(todayStart.getTime() - DAY_MS);
  const windowStart = new Date(todayStart.getTime() - TOP_TERMS_WINDOW_DAYS * DAY_MS);

  const [termSnapshots, zeroResultSnapshots] = await Promise.all([
    db.analyticsSnapshot.groupBy({
      by: ["dimensionKey"],
      where: {
        analyticsMetric: { storeId, code: STOREFRONT_ANALYTICS_METRICS.searchTermQuery.code },
        dimensionType: SEARCH_TERM_DIMENSION_TYPE,
        status: "READY",
        periodStart: { gte: windowStart, lt: todayEnd },
      },
      _sum: { valueInteger: true },
    }),
    db.analyticsSnapshot.findMany({
      where: {
        analyticsMetric: { storeId, code: STOREFRONT_ANALYTICS_METRICS.searchZeroResults.code },
        dimensionType: STOREFRONT_ANALYTICS_DIMENSION_TYPE,
        dimensionKey: STOREFRONT_ANALYTICS_DIMENSION_KEY,
        status: "READY",
        periodStart: { in: [yesterdayStart, todayStart] },
      },
      select: { periodStart: true, valueInteger: true },
    }),
  ]);

  const topTerms: SearchAnalyticsTerm[] = termSnapshots
    .filter((row): row is typeof row & { dimensionKey: string } => row.dimensionKey !== null)
    .map((row) => ({ term: row.dimensionKey, count: row._sum.valueInteger ?? 0 }))
    .sort((left, right) => right.count - left.count)
    .slice(0, TOP_TERMS_LIMIT);

  const countFor = (periodStart: Date): number =>
    zeroResultSnapshots.find((row) => row.periodStart.getTime() === periodStart.getTime())
      ?.valueInteger ?? 0;

  const today = countFor(todayStart);
  const yesterday = countFor(yesterdayStart);

  return {
    topTerms,
    zeroResults: {
      today,
      yesterday,
      deltaPercent: yesterday > 0 ? ((today - yesterday) / yesterday) * 100 : null,
    },
  };
}
