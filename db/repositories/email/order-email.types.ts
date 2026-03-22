export type OrderEmailEventStatus = "pending" | "sent" | "failed";

export type OrderEmailEvent = {
  id: string;
  orderId: string;
  emailTemplateId: string | null;
  templateKey: string;
  recipientEmail: string;
  subject: string;
  status: OrderEmailEventStatus;
  provider: string | null;
  providerMessageId: string | null;
  payloadJson: unknown;
  lastError: string | null;
  sentAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateOrderEmailEventInput = {
  orderId: string;
  emailTemplateId?: string | null;
  templateKey: string;
  recipientEmail: string;
  subject: string;
  payloadJson?: unknown;
  provider?: string | null;
};

export type MarkOrderEmailEventSentInput = {
  id: string;
  provider?: string | null;
  providerMessageId?: string | null;
  sentAt?: Date;
};

export type MarkOrderEmailEventFailedInput = {
  id: string;
  provider?: string | null;
  lastError: string;
};

export type OrderEmailRepositoryErrorCode =
  | "order_email_event_not_found"
  | "order_email_order_not_found"
  | "order_email_template_invalid"
  | "order_email_recipient_invalid"
  | "order_email_subject_invalid"
  | "order_email_last_error_invalid";

export class OrderEmailRepositoryError extends Error {
  readonly code: OrderEmailRepositoryErrorCode;

  constructor(code: OrderEmailRepositoryErrorCode, message: string) {
    super(message);
    this.name = "OrderEmailRepositoryError";
    this.code = code;
  }
}
