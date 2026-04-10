export type { AdminOrderDetail, AdminOrderSummary } from "@/features/orders/lib/order.types";
export type { OrderEmailEventStatus } from "@/features/email/order-email.types";

export type OrderDetailSearchParams = Record<string, string | string[] | undefined>;
