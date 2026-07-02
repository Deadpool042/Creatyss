import "server-only";

import { db } from "@/core/db";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";

/**
 * Nombre d'abonnés SUBSCRIBED du store courant — les destinataires effectifs
 * d'un envoi de campagne (mêmes critères que `send-newsletter-campaign.action.ts`).
 */
export async function countSubscribedNewsletterSubscribers(): Promise<number> {
  const storeId = await getCurrentStoreId();

  if (storeId === null) {
    return 0;
  }

  return db.newsletterSubscriber.count({
    where: { storeId, status: "SUBSCRIBED" },
  });
}
