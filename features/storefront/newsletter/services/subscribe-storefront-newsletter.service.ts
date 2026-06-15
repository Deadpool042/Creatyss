import "server-only";

import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { queueNewsletterSubscribedAutomationJobs } from "@/features/automations/services/queue-newsletter-subscribed-automation-jobs.service";
import { withTransaction } from "@/core/db/transactions/with-transaction";
import type { StorefrontNewsletterSubscribeInput } from "@/features/storefront/newsletter/schemas/storefront-newsletter-subscribe.schema";

export type SubscribeStorefrontNewsletterResult =
  | { ok: true; created: boolean; reactivated: boolean; queuedAutomationJobs: number }
  | { ok: false; error: "missing_store" };

/**
 * Point d'entrée storefront idempotent :
 * - crée l'abonné si absent ;
 * - considère une nouvelle souscription explicite comme une réactivation ;
 * - laisse inchangé un abonné déjà SUBSCRIBED.
 */
export async function subscribeStorefrontNewsletter(
  input: StorefrontNewsletterSubscribeInput
): Promise<SubscribeStorefrontNewsletterResult> {
  const storeId = await getCurrentStoreId();

  if (storeId === null) {
    return { ok: false, error: "missing_store" };
  }

  return withTransaction(async (tx) => {
    const existing = await tx.newsletterSubscriber.findUnique({
      where: {
        storeId_email: {
          storeId,
          email: input.email,
        },
      },
      select: {
        id: true,
        status: true,
        archivedAt: true,
      },
    });

    if (existing === null) {
      const subscribedAt = new Date();
      const subscriber = await tx.newsletterSubscriber.create({
        data: {
          storeId,
          email: input.email,
          status: "SUBSCRIBED",
          source: "storefront",
          subscribedAt,
        },
        select: { id: true },
      });

      const queuedAutomationJobs = await queueNewsletterSubscribedAutomationJobs(tx, {
        storeId,
        newsletterSubscriberId: subscriber.id,
        occurredAt: subscribedAt,
      });

      return { ok: true, created: true, reactivated: false, queuedAutomationJobs };
    }

    if (existing.status === "SUBSCRIBED" && existing.archivedAt === null) {
      return { ok: true, created: false, reactivated: false, queuedAutomationJobs: 0 };
    }

    const subscribedAt = new Date();
    const subscriber = await tx.newsletterSubscriber.update({
      where: { id: existing.id },
      data: {
        status: "SUBSCRIBED",
        source: "storefront",
        subscribedAt,
        unsubscribedAt: null,
        bouncedAt: null,
        archivedAt: null,
      },
      select: { id: true },
    });

    const queuedAutomationJobs = await queueNewsletterSubscribedAutomationJobs(tx, {
      storeId,
      newsletterSubscriberId: subscriber.id,
      occurredAt: subscribedAt,
    });

    return { ok: true, created: false, reactivated: true, queuedAutomationJobs };
  });
}
