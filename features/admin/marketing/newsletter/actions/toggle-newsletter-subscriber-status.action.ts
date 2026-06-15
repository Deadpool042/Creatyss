"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/core/db";
import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { ADMIN_NEWSLETTER_PATH } from "@/features/admin/marketing/newsletter/shared/admin-newsletter-routes";

export type ToggleNewsletterSubscriberStatusResult =
  | { ok: true; newStatus: string }
  | { ok: false; error: string };

/**
 * Bascule un `NewsletterSubscriber` entre SUBSCRIBED et UNSUBSCRIBED
 * (PENDING/BOUNCED → SUBSCRIBED). Niveau `basic` — n'a aucun effet sur une
 * campagne (cf.
 * `docs/lots/2026-06-13-engagement-newsletter-automations-cadrage.md`).
 */
export async function toggleNewsletterSubscriberStatusAction(
  subscriberId: string
): Promise<ToggleNewsletterSubscriberStatusResult> {
  await requireAuthenticatedAdmin();

  const subscriber = await db.newsletterSubscriber.findUnique({
    where: { id: subscriberId },
    select: { id: true, status: true, archivedAt: true },
  });

  if (!subscriber || subscriber.archivedAt) {
    return { ok: false, error: "Abonné introuvable." };
  }

  const now = new Date();
  const nextStatus = subscriber.status === "SUBSCRIBED" ? "UNSUBSCRIBED" : "SUBSCRIBED";

  await db.newsletterSubscriber.update({
    where: { id: subscriberId },
    data:
      nextStatus === "SUBSCRIBED"
        ? { status: nextStatus, subscribedAt: now, unsubscribedAt: null }
        : { status: nextStatus, unsubscribedAt: now },
  });

  revalidatePath(ADMIN_NEWSLETTER_PATH);

  return { ok: true, newStatus: nextStatus };
}
