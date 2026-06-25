"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/core/db";
import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { ADMIN_NEWSLETTER_CAMPAIGNS_PATH } from "@/features/admin/marketing/newsletter/shared/admin-newsletter-routes";

export type ArchiveNewsletterCampaignResult = { ok: true } | { ok: false; error: string };

/**
 * Archive une `NewsletterCampaign` du store courant.
 * Guard : la campagne doit appartenir au store courant.
 */
export async function archiveNewsletterCampaignAction(
  campaignId: string
): Promise<ArchiveNewsletterCampaignResult> {
  await requireAuthenticatedAdmin();

  const storeId = await getCurrentStoreId();

  if (!storeId) {
    return { ok: false, error: "Boutique introuvable." };
  }

  const campaign = await db.newsletterCampaign.findFirst({
    where: {
      id: campaignId,
      storeId,
      archivedAt: null,
    },
    select: { id: true },
  });

  if (!campaign) {
    return { ok: false, error: "Campagne introuvable." };
  }

  await db.newsletterCampaign.update({
    where: { id: campaignId },
    data: {
      status: "ARCHIVED",
      archivedAt: new Date(),
    },
  });

  revalidatePath(ADMIN_NEWSLETTER_CAMPAIGNS_PATH);

  return { ok: true };
}
