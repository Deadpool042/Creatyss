import type { OrderStatus } from "@/entities/order/order-status";

export type { OrderStatus } from "@/entities/order/order-status";

type AllowedTransitions = Record<OrderStatus, readonly OrderStatus[]>;

const ALLOWED_ORDER_STATUS_TRANSITIONS: AllowedTransitions = {
  pending: ["cancelled"],
  paid: ["preparing", "cancelled"],
  preparing: ["shipped", "cancelled"],
  shipped: [],
  cancelled: [],
  archived: [],
};

export type OrderStatusTransitionResult =
  | {
      ok: true;
      shouldRestock: boolean;
    }
  | {
      ok: false;
    };

export function getAllowedOrderStatusTransitions(
  currentStatus: OrderStatus
): readonly OrderStatus[] {
  return ALLOWED_ORDER_STATUS_TRANSITIONS[currentStatus];
}

export function resolveOrderStatusTransition(input: {
  currentStatus: OrderStatus;
  nextStatus: OrderStatus;
}): OrderStatusTransitionResult {
  if (input.currentStatus === input.nextStatus) {
    return { ok: false };
  }

  const allowedTransitions = getAllowedOrderStatusTransitions(input.currentStatus);

  if (!allowedTransitions.includes(input.nextStatus)) {
    return { ok: false };
  }

  return {
    ok: true,
    shouldRestock: input.nextStatus === "cancelled" && input.currentStatus !== "cancelled",
  };
}
