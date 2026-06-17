import "server-only";

import { db } from "@/core/db";

export type InventoryGovernanceData = Readonly<{
  totalItems: number;
  activeItems: number;
  lowStock: number;
}>;

export async function getInventoryGovernanceData(): Promise<InventoryGovernanceData | null> {
  try {
    const [totalItems, activeItems, itemsWithThreshold] = await Promise.all([
      db.inventoryItem.count(),
      db.inventoryItem.count({
        where: { status: "ACTIVE" },
      }),
      db.inventoryItem.findMany({
        where: {
          status: "ACTIVE",
          lowStockThreshold: { not: null },
        },
        select: {
          onHandQuantity: true,
          lowStockThreshold: true,
        },
      }),
    ]);

    const lowStock = itemsWithThreshold.filter(
      (item) =>
        item.lowStockThreshold !== null &&
        item.onHandQuantity <= item.lowStockThreshold
    ).length;

    return {
      totalItems,
      activeItems,
      lowStock,
    };
  } catch {
    return null;
  }
}
