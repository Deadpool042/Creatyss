import { Prisma } from "@prisma/client";
import { prisma } from "@/db/prisma-client";
import { listOrderEmailEventsByOrderId } from "@/db/repositories/order-email.repository";
import { createOrderReference } from "@/entities/order/order-reference";
import {
  OrderRepositoryError,
  type CreateOrderFromGuestCartResult,
  type OrderStatus,
  type PublicOrderConfirmation,
  type AdminOrderSummary,
  type OrderEmailContext,
  type AdminOrderDetail,
  type ShipOrderInput,
  type UpdateOrderStatusInput,
} from "./order.types";
import {
  mapAdminOrderSummaryRow,
  mapOrderEmailContextRow,
  mapPrismaOrder,
} from "./orders/helpers/mappers";
import {
  createOrderFromGuestCartInTx,
  shipOrderInTx,
  updateOrderStatusInTx,
} from "./orders/helpers/transactions";
import { isValidNumericId, isValidOrderReference } from "./orders/helpers/validation";
import {
  findAdminOrderRowById,
  findOrderEmailContextRowById,
  findPublicOrderRowByReference,
  listAdminOrderRows,
} from "./orders/queries/order-reads.queries";

export async function findPublicOrderByReference(
  reference: string
): Promise<PublicOrderConfirmation | null> {
  if (!isValidOrderReference(reference)) {
    return null;
  }

  const row = await findPublicOrderRowByReference(reference);

  return row !== null ? mapPrismaOrder(row) : null;
}

export async function findOrderEmailContextById(id: string): Promise<OrderEmailContext | null> {
  if (!isValidNumericId(id)) {
    return null;
  }

  const row = await findOrderEmailContextRowById(BigInt(id));

  if (row === null) {
    return null;
  }

  return mapOrderEmailContextRow(row);
}

export async function listAdminOrders(): Promise<AdminOrderSummary[]> {
  const rows = await listAdminOrderRows();
  return rows.map(mapAdminOrderSummaryRow);
}

export async function findAdminOrderById(id: string): Promise<AdminOrderDetail | null> {
  if (!isValidNumericId(id)) {
    return null;
  }

  const row = await findAdminOrderRowById(BigInt(id));

  if (row === null) {
    return null;
  }

  const emailEvents = await listOrderEmailEventsByOrderId(id);

  return {
    ...mapPrismaOrder(row),
    emailEvents,
  };
}

// --- Order mutations ---

// Serializable isolation reproduces the SELECT FOR UPDATE semantics of the original SQL:
// - Prevents concurrent checkouts from the same cart from over-decrementing stock.
// - Ensures cart existence check and deletion are atomic.
// The retry loop for reference uniqueness is OUTSIDE the transaction since a failed
// Prisma operation inside a transaction causes an automatic rollback.
export async function createOrderFromGuestCartToken(
  token: string
): Promise<CreateOrderFromGuestCartResult> {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const reference = createOrderReference();

    try {
      return await prisma.$transaction(
        async (tx) => createOrderFromGuestCartInTx(tx, token, reference),
        { isolationLevel: "Serializable" }
      );
    } catch (error) {
      // Retry on reference uniqueness collision only
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        const target = (error.meta as { target?: string[] } | undefined)?.target;
        if (Array.isArray(target) && target.includes("reference")) {
          continue;
        }
      }

      if (error instanceof OrderRepositoryError) {
        throw error;
      }

      throw error;
    }
  }

  throw new OrderRepositoryError("create_failed", "Order reference generation failed.");
}

export async function updateOrderStatus(
  input: UpdateOrderStatusInput
): Promise<OrderStatus | null> {
  if (!isValidNumericId(input.id)) {
    return null;
  }

  const orderId = BigInt(input.id);

  // Serializable isolation reproduces SELECT FOR UPDATE semantics.
  return prisma
    .$transaction(
      async (tx) => updateOrderStatusInTx(tx, orderId, input.nextStatus),
      { isolationLevel: "Serializable" }
    )
    .catch((error) => {
      if (error instanceof OrderRepositoryError) {
        throw error;
      }

      throw error;
    });
}

export async function shipOrder(input: ShipOrderInput): Promise<OrderStatus | null> {
  if (!isValidNumericId(input.id)) {
    return null;
  }

  const orderId = BigInt(input.id);

  // Serializable isolation reproduces SELECT FOR UPDATE semantics.
  return prisma
    .$transaction(
      async (tx) => shipOrderInTx(tx, orderId, input.trackingReference),
      { isolationLevel: "Serializable" }
    )
    .catch((error) => {
      if (error instanceof OrderRepositoryError) {
        throw error;
      }

      throw error;
    });
}
