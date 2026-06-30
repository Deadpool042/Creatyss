import { describe, expect, it, vi } from "vitest";

vi.mock("@/core/db", () => ({ db: {} }));

import type { Prisma } from "@/prisma-generated/client";
import { restockCancelledOrderInventory } from "@/features/admin/commerce/orders/services/update-admin-order-status.service";

const ORDER_ID = "order_test_1";
const ITEM_A = "inv_item_a";
const ITEM_B = "inv_item_b";

type MockMovement = { inventoryItemId: string; quantityDelta: number };

function makeTx(movements: MockMovement[]) {
  return {
    inventoryMovement: {
      findMany: vi.fn().mockResolvedValue(movements),
      create: vi.fn().mockResolvedValue({}),
    },
    inventoryItem: {
      update: vi.fn().mockResolvedValue({}),
    },
  } as unknown as Prisma.TransactionClient;
}

describe("restockCancelledOrderInventory", () => {
  it("no-op quand aucun mouvement CONSUMPTION order n'existe", async () => {
    const tx = makeTx([]);
    await restockCancelledOrderInventory(tx, ORDER_ID);
    expect(tx.inventoryItem.update).not.toHaveBeenCalled();
    expect(tx.inventoryMovement.create).not.toHaveBeenCalled();
  });

  it("applique onHand += consommé et crée un RELEASE quand net < 0", async () => {
    const tx = makeTx([{ inventoryItemId: ITEM_A, quantityDelta: -3 }]);
    await restockCancelledOrderInventory(tx, ORDER_ID);
    expect(tx.inventoryItem.update).toHaveBeenCalledWith({
      where: { id: ITEM_A },
      data: { onHandQuantity: { increment: 3 } },
    });
    expect(tx.inventoryMovement.create).toHaveBeenCalledWith({
      data: {
        inventoryItemId: ITEM_A,
        type: "RELEASE",
        quantityDelta: 3,
        referenceType: "order",
        referenceId: ORDER_ID,
        reason: "order_cancelled",
      },
    });
  });

  it("idempotence : RELEASE déjà présent annule le CONSUMPTION (net = 0) → no-op", async () => {
    const tx = makeTx([
      { inventoryItemId: ITEM_A, quantityDelta: -3 },
      { inventoryItemId: ITEM_A, quantityDelta: 3 },
    ]);
    await restockCancelledOrderInventory(tx, ORDER_ID);
    expect(tx.inventoryItem.update).not.toHaveBeenCalled();
    expect(tx.inventoryMovement.create).not.toHaveBeenCalled();
  });

  it("no-op si net >= 0 (sur-restitution déjà présente)", async () => {
    const tx = makeTx([
      { inventoryItemId: ITEM_A, quantityDelta: -2 },
      { inventoryItemId: ITEM_A, quantityDelta: 5 },
    ]);
    await restockCancelledOrderInventory(tx, ORDER_ID);
    expect(tx.inventoryItem.update).not.toHaveBeenCalled();
    expect(tx.inventoryMovement.create).not.toHaveBeenCalled();
  });

  it("agrège correctement plusieurs items distincts en une seule passe", async () => {
    const tx = makeTx([
      { inventoryItemId: ITEM_A, quantityDelta: -2 },
      { inventoryItemId: ITEM_B, quantityDelta: -1 },
    ]);
    await restockCancelledOrderInventory(tx, ORDER_ID);
    expect(tx.inventoryItem.update).toHaveBeenCalledTimes(2);
    expect(tx.inventoryMovement.create).toHaveBeenCalledTimes(2);
    expect(tx.inventoryItem.update).toHaveBeenCalledWith({
      where: { id: ITEM_A },
      data: { onHandQuantity: { increment: 2 } },
    });
    expect(tx.inventoryItem.update).toHaveBeenCalledWith({
      where: { id: ITEM_B },
      data: { onHandQuantity: { increment: 1 } },
    });
  });

  it("n'agit que sur l'item dont le net est négatif quand les items ont des soldes mixtes", async () => {
    const tx = makeTx([
      { inventoryItemId: ITEM_A, quantityDelta: -3 },
      { inventoryItemId: ITEM_A, quantityDelta: 3 }, // déjà restitué
      { inventoryItemId: ITEM_B, quantityDelta: -1 },
    ]);
    await restockCancelledOrderInventory(tx, ORDER_ID);
    expect(tx.inventoryItem.update).toHaveBeenCalledTimes(1);
    expect(tx.inventoryItem.update).toHaveBeenCalledWith({
      where: { id: ITEM_B },
      data: { onHandQuantity: { increment: 1 } },
    });
    expect(tx.inventoryMovement.create).toHaveBeenCalledTimes(1);
  });
});
