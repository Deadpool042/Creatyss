import type { OrderStatus } from "@/entities/order/order-status-transition";

export type AdminOrderPaymentStatus = "pending" | "succeeded" | "failed";

export type AdminOrderSummary = {
  id: string;
  reference: string;
  status: OrderStatus;
  paymentStatus: AdminOrderPaymentStatus;
  customerEmail: string;
  customerFirstName: string;
  customerLastName: string;
  totalAmount: string;
  lineCount: number;
  createdAt: string;
  updatedAt: string;
};
