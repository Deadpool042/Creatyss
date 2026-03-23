import type { Prisma } from "@prisma/client";

export const emailMessageSelect = {
  id: true,
  storeId: true,
  category: true,
  status: true,
  recipientKind: true,
  userId: true,
  customerId: true,
  toEmail: true,
  toName: true,
  subject: true,
  htmlBody: true,
  textBody: true,
  templateDefinitionId: true,
  templateVariantId: true,
  notificationId: true,
  orderId: true,
  eventId: true,
  supportTicketId: true,
  preparedAt: true,
  sentAt: true,
  failedAt: true,
  cancelledAt: true,
  failureCode: true,
  failureMessage: true,
  createdAt: true,
  updatedAt: true,
} as const satisfies Prisma.EmailMessageSelect;

export type EmailMessageRow = Prisma.EmailMessageGetPayload<{
  select: typeof emailMessageSelect;
}>;
