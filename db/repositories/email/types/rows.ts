import type { Prisma } from "@prisma/client";

export const orderEmailEventSelect = {
  id: true,
  orderId: true,
  emailTemplateId: true,
  templateKey: true,
  recipientEmail: true,
  subject: true,
  status: true,
  provider: true,
  providerMessageId: true,
  payloadJson: true,
  lastError: true,
  sentAt: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.OrderEmailEventSelect;

export const emailTemplateListSelect = {
  id: true,
  key: true,
  name: true,
  type: true,
  status: true,
  updatedAt: true,
} satisfies Prisma.EmailTemplateSelect;

export const emailTemplateDetailSelect = {
  id: true,
  key: true,
  name: true,
  type: true,
  subjectTemplate: true,
  bodyHtml: true,
  bodyText: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.EmailTemplateSelect;

export const newsletterSubscriberSelect = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  status: true,
  source: true,
  confirmationToken: true,
  subscribedAt: true,
  unsubscribedAt: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.NewsletterSubscriberSelect;

export type OrderEmailEventRow = Prisma.OrderEmailEventGetPayload<{
  select: typeof orderEmailEventSelect;
}>;

export type EmailTemplateListRow = Prisma.EmailTemplateGetPayload<{
  select: typeof emailTemplateListSelect;
}>;

export type EmailTemplateDetailRow = Prisma.EmailTemplateGetPayload<{
  select: typeof emailTemplateDetailSelect;
}>;

export type NewsletterSubscriberRow = Prisma.NewsletterSubscriberGetPayload<{
  select: typeof newsletterSubscriberSelect;
}>;
