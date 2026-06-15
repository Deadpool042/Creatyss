import "server-only";

import { db } from "@/core/db";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import type { AdminNewsletterSubscriberSummary } from "@/features/admin/marketing/newsletter/types/admin-newsletter-subscriber.types";

/**
 * Liste les `NewsletterSubscriber` du store courant (non archivés), pour la
 * page admin `/admin/marketing/newsletter` — niveau `basic`
 * (cf. `docs/lots/2026-06-13-engagement-newsletter-automations-cadrage.md`).
 */
export async function listAdminNewsletterSubscribers(): Promise<AdminNewsletterSubscriberSummary[]> {
  const storeId = await getCurrentStoreId();

  if (storeId === null) {
    return [];
  }

  return db.newsletterSubscriber.findMany({
    where: { storeId, archivedAt: null },
    orderBy: [{ createdAt: "desc" }],
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      status: true,
      source: true,
      createdAt: true,
    },
  });
}
