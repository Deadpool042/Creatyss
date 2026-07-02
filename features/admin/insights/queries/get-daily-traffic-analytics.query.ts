import "server-only";

import { db } from "@/core/db";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import {
  getUtcDayRange,
  STOREFRONT_ANALYTICS_DIMENSION_KEY,
  STOREFRONT_ANALYTICS_DIMENSION_TYPE,
  STOREFRONT_ANALYTICS_METRICS,
} from "@/features/analytics/tracking/record-storefront-analytics-event.service";

export type DailyTrafficMetric = Readonly<{
  today: number;
  yesterday: number;
  /** Variation en % vs hier — `null` si hier est à zéro (non calculable). */
  deltaPercent: number | null;
}>;

export type DailyTrafficAnalytics = Readonly<{
  periodStart: Date;
  periodEnd: Date;
  productViews: DailyTrafficMetric;
  cartAdditions: DailyTrafficMetric;
}>;

const EMPTY_METRIC: DailyTrafficMetric = {
  today: 0,
  yesterday: 0,
  deltaPercent: null,
};

function buildMetric(today: number, yesterday: number): DailyTrafficMetric {
  return {
    today,
    yesterday,
    deltaPercent: yesterday > 0 ? ((today - yesterday) / yesterday) * 100 : null,
  };
}

/**
 * Compteurs storefront « aujourd'hui vs hier » lus depuis les
 * `AnalyticsSnapshot` quotidiens alimentés par
 * `recordStorefrontAnalyticsEvent` (tracking anonyme sans cookie).
 */
export async function getDailyTrafficAnalytics(): Promise<DailyTrafficAnalytics> {
  const storeId = await getCurrentStoreId();
  const now = new Date();
  const { periodStart: todayStart, periodEnd: todayEnd } = getUtcDayRange(now);
  const yesterdayStart = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000);

  if (storeId === null) {
    return {
      periodStart: todayStart,
      periodEnd: todayEnd,
      productViews: EMPTY_METRIC,
      cartAdditions: EMPTY_METRIC,
    };
  }

  const snapshots = await db.analyticsSnapshot.findMany({
    where: {
      analyticsMetric: {
        storeId,
        code: {
          in: [
            STOREFRONT_ANALYTICS_METRICS.productView.code,
            STOREFRONT_ANALYTICS_METRICS.cartAddition.code,
          ],
        },
      },
      dimensionType: STOREFRONT_ANALYTICS_DIMENSION_TYPE,
      dimensionKey: STOREFRONT_ANALYTICS_DIMENSION_KEY,
      status: "READY",
      periodStart: { in: [yesterdayStart, todayStart] },
    },
    select: {
      periodStart: true,
      valueInteger: true,
      analyticsMetric: { select: { code: true } },
    },
  });

  const countFor = (code: string, periodStart: Date): number => {
    const row = snapshots.find(
      (snapshot) =>
        snapshot.analyticsMetric.code === code &&
        snapshot.periodStart.getTime() === periodStart.getTime()
    );

    return row?.valueInteger ?? 0;
  };

  const productViewCode = STOREFRONT_ANALYTICS_METRICS.productView.code;
  const cartAdditionCode = STOREFRONT_ANALYTICS_METRICS.cartAddition.code;

  return {
    periodStart: todayStart,
    periodEnd: todayEnd,
    productViews: buildMetric(
      countFor(productViewCode, todayStart),
      countFor(productViewCode, yesterdayStart)
    ),
    cartAdditions: buildMetric(
      countFor(cartAdditionCode, todayStart),
      countFor(cartAdditionCode, yesterdayStart)
    ),
  };
}
