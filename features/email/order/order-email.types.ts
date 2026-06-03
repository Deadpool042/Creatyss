import type { EmailProviderKind } from "../providers/email-provider.types";

export type OrderEmailEventType = "order_created" | "payment_succeeded" | "order_shipped";

export type OrderEmailEventStatus = "pending" | "sent" | "failed";

export type OrderEmailEventProvider = EmailProviderKind | "resend";

export type OrderEmailEvent = {
  id: string;
  orderId: string;
  eventType: OrderEmailEventType;
  status: OrderEmailEventStatus;
  recipientEmail: string;
  provider: OrderEmailEventProvider;
  providerMessageId: string | null;
  lastError: string | null;
  sentAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateOrderEmailEventIfAbsentInput = {
  orderId: string;
  eventType: OrderEmailEventType;
  recipientEmail: string;
  provider: EmailProviderKind;
};

export type MarkOrderEmailEventSentInput = {
  id: string;
  providerMessageId: string | null;
};

export type MarkOrderEmailEventFailedInput = {
  id: string;
  lastError: string;
};
