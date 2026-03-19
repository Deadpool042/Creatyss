export type OrderEmailEventType = "order_created" | "payment_succeeded" | "order_shipped";

export type OrderEmailEventStatus = "pending" | "sent" | "failed";

export type OrderEmailEvent = {
  id: string;
  orderId: string;
  eventType: OrderEmailEventType;
  status: OrderEmailEventStatus;
  recipientEmail: string;
  provider: "resend" | "brevo";
  providerMessageId: string | null;
  lastError: string | null;
  sentAt: string | null;
  createdAt: string;
  updatedAt: string;
};
