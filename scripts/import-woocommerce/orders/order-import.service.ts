import type { PrismaClient } from "../../../src/generated/prisma/client";
import type { WooOrder } from "../schemas";
import { endProgress, logProgress } from "../shared/logging";
import { mapWooOrderToImportedOrder } from "./order-mappers";
import { createOrderWithRelations, findOrderBySource, updateOrder } from "./order.repository";
import type { ImportOrdersResult } from "./order.types";

export async function importOrders(
  prisma: PrismaClient,
  input: {
    storeId: string;
    orders: readonly WooOrder[];
    customerIdByExternalId: ReadonlyMap<string, string>;
    productIdByExternalId: ReadonlyMap<string, string>;
    variantIdByExternalId: ReadonlyMap<string, string>;
  }
): Promise<ImportOrdersResult> {
  let imported = 0;
  let updated = 0;

  for (const [index, wooOrder] of input.orders.entries()) {
    logProgress(index + 1, input.orders.length, "Importing orders");

    const mappedOrder = mapWooOrderToImportedOrder(
      wooOrder,
      input.customerIdByExternalId,
      input.productIdByExternalId,
      input.variantIdByExternalId
    );

    const existingOrder = await findOrderBySource(prisma, input.storeId, mappedOrder.sourceId);

    if (existingOrder) {
      await updateOrder(prisma, existingOrder.id, mappedOrder);
      updated += 1;
      continue;
    }

    await createOrderWithRelations(prisma, input.storeId, mappedOrder);
    imported += 1;
  }

  if (input.orders.length > 0) {
    endProgress(`Imported ${imported} orders (${updated} updated)`);
  }

  return {
    imported,
    updated,
  };
}
