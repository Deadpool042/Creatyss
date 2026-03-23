import { prisma } from "@/db/prisma-client";
import {
  newsletterCampaignSelect,
  newsletterSubscriptionSelect,
  type NewsletterCampaignRow,
  type NewsletterSubscriptionRow,
} from "@db-newsletter/types/rows";

export async function listNewsletterSubscriptionRowsByListId(
  listId: string
): Promise<NewsletterSubscriptionRow[]> {
  return prisma.newsletterSubscription.findMany({
    where: {
      listId,
    },
    orderBy: [{ createdAt: "desc" }],
    select: newsletterSubscriptionSelect,
  });
}

export async function findNewsletterSubscriptionRowByEmail(
  listId: string,
  email: string
): Promise<NewsletterSubscriptionRow | null> {
  return prisma.newsletterSubscription.findUnique({
    where: {
      listId_email: {
        listId,
        email,
      },
    },
    select: newsletterSubscriptionSelect,
  });
}

export async function listNewsletterCampaignRowsByListId(
  listId: string
): Promise<NewsletterCampaignRow[]> {
  return prisma.newsletterCampaign.findMany({
    where: {
      listId,
    },
    orderBy: [{ createdAt: "desc" }],
    select: newsletterCampaignSelect,
  });
}

export async function findNewsletterCampaignRowById(
  id: string
): Promise<NewsletterCampaignRow | null> {
  return prisma.newsletterCampaign.findUnique({
    where: {
      id,
    },
    select: newsletterCampaignSelect,
  });
}
