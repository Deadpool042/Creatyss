import { prisma } from "@/db/prisma-client";
import {
  NewsletterRepositoryError,
  type ConfirmNewsletterSubscriptionInput,
  type NewsletterSubscriber,
  type SubscribeNewsletterInput,
  type UnsubscribeNewsletterInput,
} from "./newsletter.types";
import { mapNewsletterSubscriber } from "./helpers/mappers";
import {
  parseConfirmNewsletterSubscriptionInput,
  parseSubscribeNewsletterInput,
  parseUnsubscribeNewsletterInput,
} from "./helpers/validation";
import {
  findNewsletterSubscriberRowByEmail,
  listNewsletterSubscriberRows,
} from "./queries/newsletter.queries";

export async function findNewsletterSubscriberByEmail(
  email: string
): Promise<NewsletterSubscriber | null> {
  const row = await findNewsletterSubscriberRowByEmail(email.trim().toLowerCase());

  if (!row) {
    return null;
  }

  return mapNewsletterSubscriber(row);
}

export async function listNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
  const rows = await listNewsletterSubscriberRows();
  return rows.map(mapNewsletterSubscriber);
}

export async function subscribeNewsletter(
  input: SubscribeNewsletterInput
): Promise<NewsletterSubscriber> {
  const parsedInput = parseSubscribeNewsletterInput(input);
  const normalizedEmail = parsedInput.email.trim().toLowerCase();

  await prisma.newsletterSubscriber.upsert({
    where: {
      email: normalizedEmail,
    },
    update: {
      firstName: parsedInput.firstName ?? null,
      lastName: parsedInput.lastName ?? null,
      source: parsedInput.source ?? null,
      confirmationToken: parsedInput.confirmationToken ?? null,
      status: "pending",
      unsubscribedAt: null,
    },
    create: {
      email: normalizedEmail,
      firstName: parsedInput.firstName ?? null,
      lastName: parsedInput.lastName ?? null,
      source: parsedInput.source ?? null,
      confirmationToken: parsedInput.confirmationToken ?? null,
      status: "pending",
    },
  });

  const row = await findNewsletterSubscriberRowByEmail(normalizedEmail);

  if (!row) {
    throw new NewsletterRepositoryError(
      "newsletter_subscriber_not_found",
      "Abonné newsletter introuvable."
    );
  }

  return mapNewsletterSubscriber(row);
}

export async function confirmNewsletterSubscription(
  input: ConfirmNewsletterSubscriptionInput
): Promise<NewsletterSubscriber | null> {
  const parsedInput = parseConfirmNewsletterSubscriptionInput(input);
  const normalizedEmail = parsedInput.email.trim().toLowerCase();

  const updated = await prisma.newsletterSubscriber.updateMany({
    where: {
      email: normalizedEmail,
    },
    data: {
      status: "subscribed",
      subscribedAt: new Date(),
      unsubscribedAt: null,
    },
  });

  if (updated.count === 0) {
    return null;
  }

  const row = await findNewsletterSubscriberRowByEmail(normalizedEmail);

  if (!row) {
    return null;
  }

  return mapNewsletterSubscriber(row);
}

export async function unsubscribeNewsletter(
  input: UnsubscribeNewsletterInput
): Promise<NewsletterSubscriber | null> {
  const parsedInput = parseUnsubscribeNewsletterInput(input);
  const normalizedEmail = parsedInput.email.trim().toLowerCase();

  const updated = await prisma.newsletterSubscriber.updateMany({
    where: {
      email: normalizedEmail,
    },
    data: {
      status: "unsubscribed",
      unsubscribedAt: new Date(),
    },
  });

  if (updated.count === 0) {
    return null;
  }

  const row = await findNewsletterSubscriberRowByEmail(normalizedEmail);

  if (!row) {
    return null;
  }

  return mapNewsletterSubscriber(row);
}
