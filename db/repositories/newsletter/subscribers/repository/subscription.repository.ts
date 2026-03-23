import { prisma } from "@/db/prisma-client";
import {
  mapNewsletterSubscription,
  mapNewsletterSubscriptionStatusToPrisma,
} from "@db-newsletter/helpers/mappers";
import {
  normalizeNewsletterEmail,
  parseConfirmNewsletterSubscriptionInput,
  parseSubscribeNewsletterInput,
  parseUnsubscribeNewsletterInput,
} from "@db-newsletter/helpers/validation";
import {
  findNewsletterSubscriptionRowByEmail,
  listNewsletterSubscriptionRowsByListId,
} from "@db-newsletter/queries/newsletter.queries";
import type {
  ConfirmNewsletterSubscriptionInput,
  NewsletterSubscriptionDetail,
  NewsletterSubscriptionSummary,
  SubscribeNewsletterInput,
  UnsubscribeNewsletterInput,
} from "@db-newsletter/subscribers/types/subscription.types";

export async function listNewsletterSubscriptions(
  listId: string
): Promise<NewsletterSubscriptionSummary[]> {
  const rows = await listNewsletterSubscriptionRowsByListId(listId.trim());
  return rows.map(mapNewsletterSubscription);
}

export async function findNewsletterSubscriptionByEmail(
  listId: string,
  email: string
): Promise<NewsletterSubscriptionDetail | null> {
  const row = await findNewsletterSubscriptionRowByEmail(listId.trim(), normalizeNewsletterEmail(email));
  return row ? mapNewsletterSubscription(row) : null;
}

export async function subscribeNewsletter(
  input: SubscribeNewsletterInput
): Promise<NewsletterSubscriptionDetail> {
  const parsedInput = parseSubscribeNewsletterInput(input);

  await prisma.newsletterSubscription.upsert({
    where: {
      listId_email: {
        listId: parsedInput.listId,
        email: parsedInput.email,
      },
    },
    update: {
      customerId: parsedInput.customerId ?? null,
      firstName: parsedInput.firstName ?? null,
      lastName: parsedInput.lastName ?? null,
      status: mapNewsletterSubscriptionStatusToPrisma("pending"),
      confirmedAt: null,
      unsubscribedAt: null,
      bouncedAt: null,
    },
    create: {
      listId: parsedInput.listId,
      customerId: parsedInput.customerId ?? null,
      email: parsedInput.email,
      firstName: parsedInput.firstName ?? null,
      lastName: parsedInput.lastName ?? null,
      status: mapNewsletterSubscriptionStatusToPrisma("pending"),
    },
    select: {
      id: true,
    },
  });

  const row = await findNewsletterSubscriptionRowByEmail(parsedInput.listId, parsedInput.email);

  if (!row) {
    throw new Error("Newsletter subscription not found after upsert.");
  }

  return mapNewsletterSubscription(row);
}

export async function confirmNewsletterSubscription(
  input: ConfirmNewsletterSubscriptionInput
): Promise<NewsletterSubscriptionDetail | null> {
  const parsedInput = parseConfirmNewsletterSubscriptionInput(input);

  const updated = await prisma.newsletterSubscription.updateMany({
    where: {
      listId: parsedInput.listId,
      email: parsedInput.email,
    },
    data: {
      status: mapNewsletterSubscriptionStatusToPrisma("active"),
      confirmedAt: new Date(),
      unsubscribedAt: null,
    },
  });

  if (updated.count === 0) {
    return null;
  }

  const row = await findNewsletterSubscriptionRowByEmail(parsedInput.listId, parsedInput.email);
  return row ? mapNewsletterSubscription(row) : null;
}

export async function unsubscribeNewsletter(
  input: UnsubscribeNewsletterInput
): Promise<NewsletterSubscriptionDetail | null> {
  const parsedInput = parseUnsubscribeNewsletterInput(input);

  const updated = await prisma.newsletterSubscription.updateMany({
    where: {
      listId: parsedInput.listId,
      email: parsedInput.email,
    },
    data: {
      status: mapNewsletterSubscriptionStatusToPrisma("unsubscribed"),
      unsubscribedAt: new Date(),
    },
  });

  if (updated.count === 0) {
    return null;
  }

  const row = await findNewsletterSubscriptionRowByEmail(parsedInput.listId, parsedInput.email);
  return row ? mapNewsletterSubscription(row) : null;
}
