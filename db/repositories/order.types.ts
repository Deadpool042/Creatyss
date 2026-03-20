export * from "./orders/types/public";
import type { PublicOrderConfirmation } from "./orders/types/public";
import type { OrderEmailEvent } from "./order-email.types";
export type { OrderEmailEvent } from "./order-email.types";

export type AdminOrderDetail = PublicOrderConfirmation & {
  emailEvents: OrderEmailEvent[];
};
