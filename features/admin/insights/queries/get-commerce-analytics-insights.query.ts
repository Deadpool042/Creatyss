import "server-only";

import { db } from "@/core/db";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";

const REVENUE_ORDER_STATUSES = ["CONFIRMED", "PROCESSING", "COMPLETED"] as const;

function getCurrentMonthRange(now: Date): { periodStart: Date; periodEnd: Date } {
  const periodStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const periodEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));

  return { periodStart, periodEnd };
}

export type CommerceAnalyticsStatusBreakdown = {
  status: "PENDING" | "CONFIRMED" | "PROCESSING" | "COMPLETED" | "CANCELLED" | "ARCHIVED";
  count: number;
};

export type CommerceAnalyticsTopProduct = {
  productId: string | null;
  productName: string;
  quantitySold: number;
  revenue: number;
};

export type CommerceAnalyticsInsights = {
  periodStart: Date;
  periodEnd: Date;
  averageOrderValue: number;
  totalConfirmedOrders: number;
  statusBreakdown: CommerceAnalyticsStatusBreakdown[];
  topProducts: CommerceAnalyticsTopProduct[];
};

export async function getCommerceAnalyticsInsights(): Promise<CommerceAnalyticsInsights> {
  const storeId = await getCurrentStoreId();
  const { periodStart, periodEnd } = getCurrentMonthRange(new Date());

  if (storeId === null) {
    return {
      periodStart,
      periodEnd,
      averageOrderValue: 0,
      totalConfirmedOrders: 0,
      statusBreakdown: [],
      topProducts: [],
    };
  }

  const [confirmedAggregate, statusBreakdownRows, monthlyOrderLines] = await Promise.all([
    db.order.aggregate({
      where: {
        storeId,
        status: { in: [...REVENUE_ORDER_STATUSES] },
        placedAt: { gte: periodStart, lt: periodEnd },
      },
      _sum: { totalAmount: true },
      _count: { _all: true },
    }),
    db.order.groupBy({
      by: ["status"],
      where: {
        storeId,
        createdAt: { gte: periodStart, lt: periodEnd },
      },
      _count: { id: true },
    }),
    db.orderLine.findMany({
      where: {
        order: {
          storeId,
          status: { in: [...REVENUE_ORDER_STATUSES] },
          placedAt: { gte: periodStart, lt: periodEnd },
        },
      },
      select: {
        productId: true,
        productName: true,
        quantity: true,
        lineTotalAmount: true,
      },
    }),
  ]);

  const totalConfirmedOrders = confirmedAggregate._count._all;
  const revenueSum = confirmedAggregate._sum.totalAmount?.toNumber() ?? 0;
  const averageOrderValue = totalConfirmedOrders > 0 ? revenueSum / totalConfirmedOrders : 0;

  const topProductsByKey = new Map<string, CommerceAnalyticsTopProduct>();

  for (const line of monthlyOrderLines) {
    const key = line.productId ?? `name:${line.productName}`;
    const existing = topProductsByKey.get(key);

    if (existing) {
      existing.quantitySold += line.quantity;
      existing.revenue += line.lineTotalAmount.toNumber();
      continue;
    }

    topProductsByKey.set(key, {
      productId: line.productId,
      productName: line.productName,
      quantitySold: line.quantity,
      revenue: line.lineTotalAmount.toNumber(),
    });
  }

  const topProducts = [...topProductsByKey.values()]
    .sort((left, right) => right.revenue - left.revenue || right.quantitySold - left.quantitySold)
    .slice(0, 5);

  return {
    periodStart,
    periodEnd,
    averageOrderValue,
    totalConfirmedOrders,
    statusBreakdown: statusBreakdownRows
      .map((row) => ({
        status: row.status,
        count: row._count.id,
      }))
      .sort((left, right) => right.count - left.count),
    topProducts,
  };
}
