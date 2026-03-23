import type { Prisma } from "@prisma/client";

export const newsletterSubscriptionSelect = {
  id: true,
  listId: true,
  customerId: true,
  email: true,
  firstName: true,
  lastName: true,
  status: true,
  confirmedAt: true,
  unsubscribedAt: true,
  bouncedAt: true,
  createdAt: true,
  updatedAt: true,
} as const satisfies Prisma.NewsletterSubscriptionSelect;

export const newsletterCampaignSelect = {
  id: true,
  listId: true,
  name: true,
  subject: true,
  previewText: true,
  status: true,
  scheduledAt: true,
  sentAt: true,
  cancelledAt: true,
  recipientsCount: true,
  opensCount: true,
  clicksCount: true,
  createdAt: true,
  updatedAt: true,
} as const satisfies Prisma.NewsletterCampaignSelect;

export type NewsletterSubscriptionRow = Prisma.NewsletterSubscriptionGetPayload<{
  select: typeof newsletterSubscriptionSelect;
}>;

export type NewsletterCampaignRow = Prisma.NewsletterCampaignGetPayload<{
  select: typeof newsletterCampaignSelect;
}>;
