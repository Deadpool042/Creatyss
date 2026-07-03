import "server-only";

import { db } from "@/core/db";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";

const REVENUE_ORDER_STATUSES = ["CONFIRMED", "PROCESSING", "COMPLETED"] as const;
const DAY_MS = 24 * 60 * 60 * 1000;

export type CommerceAnalyticsDecliningProduct = {
  productId: string | null;
  productName: string;
  previousQuantity: number;
};

export type CommerceAnalyticsGrowingProduct = {
  productId: string | null;
  productName: string;
  previousQuantity: number;
  currentQuantity: number;
  growth: number;
};

export type CommerceAnalyticsRecommendations = {
  decliningProducts: CommerceAnalyticsDecliningProduct[];
  growingProducts: CommerceAnalyticsGrowingProduct[];
};

const EMPTY_RECOMMENDATIONS: CommerceAnalyticsRecommendations = {
  decliningProducts: [],
  growingProducts: [],
};

type ProductQuantityLine = {
  productId: string | null;
  productName: string;
  quantity: number;
};

function sumQuantityByProduct(lines: ProductQuantityLine[]): Map<string, ProductQuantityLine> {
  const byKey = new Map<string, ProductQuantityLine>();

  for (const line of lines) {
    const key = line.productId ?? `name:${line.productName}`;
    const existing = byKey.get(key);

    if (existing) {
      existing.quantity += line.quantity;
      continue;
    }

    byKey.set(key, { ...line });
  }

  return byKey;
}

function getCurrentMonthRange(now: Date): { periodStart: Date; periodEnd: Date } {
  const periodStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const periodEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));

  return { periodStart, periodEnd };
}

function getPreviousMonthRange(now: Date): { periodStart: Date; periodEnd: Date } {
  const periodStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
  const periodEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));

  return { periodStart, periodEnd };
}

async function findQuantityByProduct(
  storeId: string,
  periodStart: Date,
  periodEnd: Date
): Promise<Map<string, ProductQuantityLine>> {
  const lines = await db.orderLine.findMany({
    where: {
      order: {
        storeId,
        status: { in: [...REVENUE_ORDER_STATUSES] },
        placedAt: { gte: periodStart, lt: periodEnd },
      },
    },
    select: { productId: true, productName: true, quantity: true },
  });

  return sumQuantityByProduct(lines);
}

/**
 * Insights actionnables dérivés uniquement d'`Order`/`OrderLine` (même
 * périmètre de données que le niveau `insights`) :
 * - produits en repli : vendaient il y a 30-60 jours, plus aucune vente
 *   depuis 30 jours ;
 * - produits en croissance : plus forte hausse de quantité vendue entre le
 *   mois précédent et le mois courant.
 */
export async function getCommerceAnalyticsRecommendations(): Promise<CommerceAnalyticsRecommendations> {
  const storeId = await getCurrentStoreId();

  if (storeId === null) {
    return EMPTY_RECOMMENDATIONS;
  }

  const now = new Date();
  const recentWindowStart = new Date(now.getTime() - 30 * DAY_MS);
  const previousWindowStart = new Date(now.getTime() - 60 * DAY_MS);
  const { periodStart: currentMonthStart, periodEnd: currentMonthEnd } = getCurrentMonthRange(now);
  const { periodStart: previousMonthStart, periodEnd: previousMonthEnd } =
    getPreviousMonthRange(now);

  const [recentWindowMap, previousWindowMap, currentMonthMap, previousMonthMap] = await Promise.all(
    [
      findQuantityByProduct(storeId, recentWindowStart, now),
      findQuantityByProduct(storeId, previousWindowStart, recentWindowStart),
      findQuantityByProduct(storeId, currentMonthStart, currentMonthEnd),
      findQuantityByProduct(storeId, previousMonthStart, previousMonthEnd),
    ]
  );

  const decliningProducts: CommerceAnalyticsDecliningProduct[] = [...previousWindowMap.entries()]
    .filter(([key]) => (recentWindowMap.get(key)?.quantity ?? 0) === 0)
    .map(([, line]) => ({
      productId: line.productId,
      productName: line.productName,
      previousQuantity: line.quantity,
    }))
    .sort((left, right) => right.previousQuantity - left.previousQuantity)
    .slice(0, 5);

  const growingProducts: CommerceAnalyticsGrowingProduct[] = [...currentMonthMap.entries()]
    .map(([key, line]) => {
      const previousQuantity = previousMonthMap.get(key)?.quantity ?? 0;
      return {
        productId: line.productId,
        productName: line.productName,
        previousQuantity,
        currentQuantity: line.quantity,
        growth: line.quantity - previousQuantity,
      };
    })
    .filter((product) => product.previousQuantity > 0 && product.growth > 0)
    .sort((left, right) => right.growth - left.growth)
    .slice(0, 5);

  return { decliningProducts, growingProducts };
}
