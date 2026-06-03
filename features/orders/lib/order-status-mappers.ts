import type { OrderStatus } from "@/entities/order/order-status-transition";

export type PrismaOrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "COMPLETED"
  | "CANCELLED"
  | "ARCHIVED";

export type PrismaPaymentStatus =
  | "PENDING"
  | "AUTHORIZED"
  | "CAPTURED"
  | "PARTIALLY_REFUNDED"
  | "REFUNDED"
  | "FAILED"
  | "CANCELLED"
  | "EXPIRED";

export type PrismaPaymentMethodType =
  | "CARD"
  | "BANK_TRANSFER"
  | "WALLET"
  | "CASH_ON_DELIVERY"
  | "OTHER";

export type AppPaymentStatus = "pending" | "succeeded" | "failed";

export function toAppOrderStatus(prismaStatus: PrismaOrderStatus): OrderStatus {
  const map: Record<PrismaOrderStatus, OrderStatus> = {
    PENDING: "pending",
    CONFIRMED: "paid",
    PROCESSING: "preparing",
    COMPLETED: "shipped",
    CANCELLED: "cancelled",
    ARCHIVED: "archived",
  };

  return map[prismaStatus];
}

export function toPrismaOrderStatus(appStatus: OrderStatus): PrismaOrderStatus {
  const map: Record<OrderStatus, PrismaOrderStatus> = {
    pending: "PENDING",
    paid: "CONFIRMED",
    preparing: "PROCESSING",
    shipped: "COMPLETED",
    cancelled: "CANCELLED",
    archived: "ARCHIVED",
  };

  return map[appStatus];
}

export function toAppPaymentStatus(prismaStatus: PrismaPaymentStatus): AppPaymentStatus {
  if (prismaStatus === "CAPTURED" || prismaStatus === "PARTIALLY_REFUNDED") {
    return "succeeded";
  }

  if (
    prismaStatus === "FAILED" ||
    prismaStatus === "CANCELLED" ||
    prismaStatus === "EXPIRED"
  ) {
    return "failed";
  }

  return "pending";
}
