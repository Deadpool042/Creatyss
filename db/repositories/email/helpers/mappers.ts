import type {
  EmailCategory,
  EmailMessageDetail,
  EmailMessageSummary,
  EmailRecipientKind,
  EmailStatus,
} from "@db-email/messages";
import type { EmailMessageRow } from "@db-email/types/rows";

export function mapEmailCategoryToPrisma(
  category: EmailCategory
): "TRANSACTIONAL" | "SUPPORT" | "NEWSLETTER" | "MARKETING" | "GENERIC" {
  switch (category) {
    case "transactional":
      return "TRANSACTIONAL";
    case "support":
      return "SUPPORT";
    case "newsletter":
      return "NEWSLETTER";
    case "marketing":
      return "MARKETING";
    case "generic":
      return "GENERIC";
  }
}

export function mapEmailMessageStatusToPrisma(
  status: EmailStatus
): "PENDING" | "PREPARED" | "SENT" | "FAILED" | "CANCELLED" {
  switch (status) {
    case "pending":
      return "PENDING";
    case "prepared":
      return "PREPARED";
    case "sent":
      return "SENT";
    case "failed":
      return "FAILED";
    case "cancelled":
      return "CANCELLED";
  }
}

export function mapEmailRecipientKindToPrisma(
  recipientKind: EmailRecipientKind
): "USER" | "CUSTOMER" | "EXTERNAL" {
  switch (recipientKind) {
    case "user":
      return "USER";
    case "customer":
      return "CUSTOMER";
    case "external":
      return "EXTERNAL";
  }
}

function mapEmailCategory(
  category: "TRANSACTIONAL" | "SUPPORT" | "NEWSLETTER" | "MARKETING" | "GENERIC"
): EmailCategory {
  switch (category) {
    case "TRANSACTIONAL":
      return "transactional";
    case "SUPPORT":
      return "support";
    case "NEWSLETTER":
      return "newsletter";
    case "MARKETING":
      return "marketing";
    case "GENERIC":
      return "generic";
  }
}

function mapEmailStatus(
  status: "PENDING" | "PREPARED" | "SENT" | "FAILED" | "CANCELLED"
): EmailStatus {
  switch (status) {
    case "PENDING":
      return "pending";
    case "PREPARED":
      return "prepared";
    case "SENT":
      return "sent";
    case "FAILED":
      return "failed";
    case "CANCELLED":
      return "cancelled";
  }
}

function mapEmailRecipientKind(
  recipientKind: "USER" | "CUSTOMER" | "EXTERNAL"
): EmailRecipientKind {
  switch (recipientKind) {
    case "USER":
      return "user";
    case "CUSTOMER":
      return "customer";
    case "EXTERNAL":
      return "external";
  }
}

export function mapEmailSummary(row: EmailMessageRow): EmailMessageSummary {
  return {
    id: row.id,
    storeId: row.storeId,
    category: mapEmailCategory(row.category),
    status: mapEmailStatus(row.status),
    recipientKind: mapEmailRecipientKind(row.recipientKind),
    toEmail: row.toEmail,
    toName: row.toName,
    subject: row.subject,
    preparedAt: row.preparedAt,
    sentAt: row.sentAt,
    failedAt: row.failedAt,
    cancelledAt: row.cancelledAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function mapEmailMessageDetail(row: EmailMessageRow): EmailMessageDetail {
  return {
    ...mapEmailSummary(row),
    htmlBody: row.htmlBody,
    textBody: row.textBody,
    userId: row.userId,
    customerId: row.customerId,
    templateDefinitionId: row.templateDefinitionId,
    templateVariantId: row.templateVariantId,
    notificationId: row.notificationId,
    orderId: row.orderId,
    eventId: row.eventId,
    supportTicketId: row.supportTicketId,
    failureCode: row.failureCode,
    failureMessage: row.failureMessage,
  };
}
