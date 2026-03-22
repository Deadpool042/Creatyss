import type { EmailTemplateDetail, EmailTemplateSummary } from "../email-template.types";
import type { NewsletterSubscriber } from "../newsletter.types";
import type { OrderEmailEvent } from "../order-email.types";
import type {
  OrderEmailEventRow,
  EmailTemplateListRow,
  EmailTemplateDetailRow,
  NewsletterSubscriberRow,
} from "../types/rows";

export function mapOrderEmailEvent(row: OrderEmailEventRow): OrderEmailEvent {
  return {
    id: row.id,
    orderId: row.orderId,
    emailTemplateId: row.emailTemplateId,
    templateKey: row.templateKey,
    recipientEmail: row.recipientEmail,
    subject: row.subject,
    status: row.status,
    provider: row.provider,
    providerMessageId: row.providerMessageId,
    payloadJson: row.payloadJson,
    lastError: row.lastError,
    sentAt: row.sentAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function mapEmailTemplateSummary(row: EmailTemplateListRow): EmailTemplateSummary {
  return {
    id: row.id,
    key: row.key,
    name: row.name,
    type: row.type,
    status: row.status,
    updatedAt: row.updatedAt,
  };
}

export function mapEmailTemplateDetail(row: EmailTemplateDetailRow): EmailTemplateDetail {
  return {
    id: row.id,
    key: row.key,
    name: row.name,
    type: row.type,
    subjectTemplate: row.subjectTemplate,
    bodyHtml: row.bodyHtml,
    bodyText: row.bodyText,
    status: row.status,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function mapNewsletterSubscriber(row: NewsletterSubscriberRow): NewsletterSubscriber {
  return {
    id: row.id,
    email: row.email,
    firstName: row.firstName,
    lastName: row.lastName,
    status: row.status,
    source: row.source,
    confirmationToken: row.confirmationToken,
    subscribedAt: row.subscribedAt,
    unsubscribedAt: row.unsubscribedAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}
