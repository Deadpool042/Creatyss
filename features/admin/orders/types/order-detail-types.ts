export type { AdminOrderDetail, AdminOrderSummary } from "@/db/repositories/order.types";
export type { OrderEmailEventStatus } from "@/db/repositories/order-email.types";

export type OrderDetailSearchParams = Record<string, string | string[] | undefined>;
