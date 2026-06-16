import "server-only";

import { db } from "@/core/db";

const INVENTORY_FORECAST_WINDOW_DAYS = 30;
const MILLIS_PER_DAY = 24 * 60 * 60 * 1000;

export type AdminInventoryForecastItem = {
  variantId: string;
  soldQuantityLast30Days: number;
  averageDailyUnits: number;
  estimatedCoverageDays: number | null;
};

export async function getAdminProductInventoryForecast(
  productId: string,
  variantSnapshots: ReadonlyArray<{
    id: string;
    availableQuantity: number;
  }>
): Promise<Map<string, AdminInventoryForecastItem>> {
  if (productId.trim().length === 0 || variantSnapshots.length === 0) {
    return new Map();
  }

  const since = new Date(Date.now() - INVENTORY_FORECAST_WINDOW_DAYS * MILLIS_PER_DAY);
  const variantIds = variantSnapshots.map((variant) => variant.id);
  const availableByVariantId = new Map(
    variantSnapshots.map((variant) => [variant.id, Math.max(0, variant.availableQuantity)])
  );

  const orderLines = await db.orderLine.findMany({
    where: {
      productId,
      variantId: { in: variantIds },
      order: {
        placedAt: { gte: since },
        status: { notIn: ["CANCELLED", "ARCHIVED"] },
        archivedAt: null,
      },
    },
    select: {
      variantId: true,
      quantity: true,
    },
  });

  const soldQuantityByVariantId = new Map<string, number>();

  for (const line of orderLines) {
    if (line.variantId === null) {
      continue;
    }

    soldQuantityByVariantId.set(
      line.variantId,
      (soldQuantityByVariantId.get(line.variantId) ?? 0) + line.quantity
    );
  }

  return new Map(
    variantIds.map((variantId) => {
      const soldQuantityLast30Days = soldQuantityByVariantId.get(variantId) ?? 0;
      const averageDailyUnits = soldQuantityLast30Days / INVENTORY_FORECAST_WINDOW_DAYS;
      const availableQuantity = availableByVariantId.get(variantId) ?? 0;
      const estimatedCoverageDays =
        averageDailyUnits > 0 ? availableQuantity / averageDailyUnits : null;

      return [
        variantId,
        {
          variantId,
          soldQuantityLast30Days,
          averageDailyUnits,
          estimatedCoverageDays,
        },
      ];
    })
  );
}
