export type EmailStatus = "pending" | "prepared" | "sent" | "failed" | "cancelled";
export type EmailCategory = "transactional" | "support" | "newsletter" | "marketing" | "generic";
export type EmailRecipientKind = "user" | "customer" | "external";

export type EmailMessageSummary = {
  id: string;
  storeId: string;
  category: EmailCategory;
  status: EmailStatus;
  recipientKind: EmailRecipientKind;
  toEmail: string;
  toName: string | null;
  subject: string;
  preparedAt: Date | null;
  sentAt: Date | null;
  failedAt: Date | null;
  cancelledAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type EmailMessageDetail = EmailMessageSummary & {
  htmlBody: string | null;
  textBody: string | null;
  userId: string | null;
  customerId: string | null;
  templateDefinitionId: string | null;
  templateVariantId: string | null;
  notificationId: string | null;
  orderId: string | null;
  eventId: string | null;
  supportTicketId: string | null;
  failureCode: string | null;
  failureMessage: string | null;
};

export type CreateEmailMessageInput = {
  storeId: string;
  category: EmailCategory;
  recipientKind: EmailRecipientKind;
  toEmail: string;
  toName?: string | null;
  subject: string;
  htmlBody?: string | null;
  textBody?: string | null;
  userId?: string | null;
  customerId?: string | null;
  templateDefinitionId?: string | null;
  templateVariantId?: string | null;
  notificationId?: string | null;
  orderId?: string | null;
  eventId?: string | null;
  supportTicketId?: string | null;
};

export type FailEmailMessageInput = {
  failureCode?: string | null;
  failureMessage: string;
};

export class EmailMessageRepositoryError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "EmailMessageRepositoryError";
    this.code = code;
  }
}
