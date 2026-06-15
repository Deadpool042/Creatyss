import "server-only";

import { db } from "@/core/db";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";

export type MonthlyCommerceAnalytics = Readonly<{
  periodStart: Date;
  periodEnd: Date;
  revenue: number;
  ordersCount: number;
  newCustomersCount: number;
  cancellationRate: number;
}>;

const EMPTY_RESULT: Omit<MonthlyCommerceAnalytics, "periodStart" | "periodEnd"> = {
  revenue: 0,
  ordersCount: 0,
  newCustomersCount: 0,
  cancellationRate: 0,
};

const REVENUE_ORDER_STATUSES = ["CONFIRMED", "PROCESSING", "COMPLETED"] as const;

function getCurrentMonthRange(now: Date): { periodStart: Date; periodEnd: Date } {
  const periodStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const periodEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));

  return { periodStart, periodEnd };
}

/**
 * Agrégats commerce (`Order`/`Customer`) du mois courant, pour le bloc « Ce
 * mois » du cockpit `engagement.analytics` (cf.
 * `docs/lots/2026-06-13-engagement-analytics-cadrage.md`, décision B1).
 *
 * Lecture live à la demande — non historisée, `AnalyticsMetric`/
 * `AnalyticsSnapshot` ne sont pas alimentés par cette query.
 */
export async function getMonthlyCommerceAnalytics(): Promise<MonthlyCommerceAnalytics> {
  const storeId = await getCurrentStoreId();
  const { periodStart, periodEnd } = getCurrentMonthRange(new Date());

  if (storeId === null) {
    return { ...EMPTY_RESULT, periodStart, periodEnd };
  }

  const [revenueAggregate, newCustomersCount, totalCreatedCount, cancelledCreatedCount] =
    await Promise.all([
      db.order.aggregate({
        where: {
          storeId,
          status: { in: [...REVENUE_ORDER_STATUSES] },
          placedAt: { gte: periodStart, lt: periodEnd },
        },
        _sum: { totalAmount: true },
        _count: { _all: true },
      }),
      db.customer.count({
        where: {
          storeId,
          createdAt: { gte: periodStart, lt: periodEnd },
        },
      }),
      db.order.count({
        where: {
          storeId,
          createdAt: { gte: periodStart, lt: periodEnd },
        },
      }),
      db.order.count({
        where: {
          storeId,
          status: "CANCELLED",
          createdAt: { gte: periodStart, lt: periodEnd },
        },
      }),
    ]);

  const cancellationRate =
    totalCreatedCount > 0 ? (cancelledCreatedCount / totalCreatedCount) * 100 : 0;

  return {
    periodStart,
    periodEnd,
    revenue: revenueAggregate._sum.totalAmount?.toNumber() ?? 0,
    ordersCount: revenueAggregate._count._all,
    newCustomersCount,
    cancellationRate,
  };
}
