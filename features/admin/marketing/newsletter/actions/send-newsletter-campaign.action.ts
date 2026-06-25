"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/core/db";
import { serverEnv } from "@/core/config/env/server";
import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { resolveEmailProvider } from "@/features/email/providers/resolve-email-provider";
import { ADMIN_NEWSLETTER_CAMPAIGNS_PATH } from "@/features/admin/marketing/newsletter/shared/admin-newsletter-routes";

export type SendNewsletterCampaignResult =
  | { ok: true; sentCount: number; failedCount: number }
  | { ok: false; error: string };

function buildUnsubscribeUrl(subscriberId: string): string {
  const token = Buffer.from(subscriberId).toString("base64url");
  return `${serverEnv.appUrl}/api/newsletter/unsubscribe?token=${token}`;
}

function buildEmailHtml(bodyHtml: string, unsubscribeUrl: string): string {
  return `${bodyHtml}
<p style="font-size:12px;color:#666666;margin-top:24px;border-top:1px solid #eeeeee;padding-top:12px;">
  Pour vous désabonner de cette liste, <a href="${unsubscribeUrl}" style="color:#666666;">cliquez ici</a>.
</p>`;
}

function buildEmailText(bodyText: string, unsubscribeUrl: string): string {
  return `${bodyText}

---
Pour vous désabonner : ${unsubscribeUrl}`;
}

/**
 * Envoie une `NewsletterCampaign` à tous les abonnés SUBSCRIBED du store.
 *
 * Invariants :
 * - La campagne doit être en statut DRAFT et appartenir au store courant.
 * - Seuls les abonnés avec status=SUBSCRIBED reçoivent l'email.
 * - Le lien de désinscription (RGPD/LPM) est injecté dans chaque email.
 * - Idempotence : les recipients dont sentAt est non nul sont ignorés.
 * - Résultat : SENT si au moins un succès, FAILED si tous échouent.
 */
export async function sendNewsletterCampaignAction(
  campaignId: string
): Promise<SendNewsletterCampaignResult> {
  await requireAuthenticatedAdmin();

  const storeId = await getCurrentStoreId();

  if (!storeId) {
    return { ok: false, error: "Boutique introuvable." };
  }

  const campaign = await db.newsletterCampaign.findUnique({
    where: { id: campaignId },
    select: {
      id: true,
      storeId: true,
      status: true,
      subjectLine: true,
      bodyHtml: true,
      bodyText: true,
    },
  });

  if (!campaign) {
    return { ok: false, error: "Campagne introuvable." };
  }

  if (campaign.storeId !== storeId) {
    return { ok: false, error: "Campagne introuvable." };
  }

  if (campaign.status !== "DRAFT") {
    return { ok: false, error: "La campagne n'est plus en statut brouillon." };
  }

  // Passe en SENDING immédiatement pour éviter les doubles envois.
  await db.newsletterCampaign.update({
    where: { id: campaignId },
    data: {
      status: "SENDING",
      sendingStartedAt: new Date(),
    },
  });

  // Récupère tous les abonnés SUBSCRIBED du store.
  const subscribers = await db.newsletterSubscriber.findMany({
    where: {
      storeId,
      status: "SUBSCRIBED",
    },
    select: { id: true, email: true },
  });

  // Crée (ou ignore si déjà existant) un recipient pour chaque abonné.
  for (const subscriber of subscribers) {
    await db.newsletterCampaignRecipient.upsert({
      where: {
        newsletterCampaignId_newsletterSubscriberId: {
          newsletterCampaignId: campaignId,
          newsletterSubscriberId: subscriber.id,
        },
      },
      create: {
        newsletterCampaignId: campaignId,
        newsletterSubscriberId: subscriber.id,
        email: subscriber.email,
      },
      update: {},
    });
  }

  // Récupère les recipients qui n'ont pas encore été envoyés (idempotence).
  const pendingRecipients = await db.newsletterCampaignRecipient.findMany({
    where: {
      newsletterCampaignId: campaignId,
      sentAt: null,
    },
    select: {
      id: true,
      email: true,
      newsletterSubscriberId: true,
    },
  });

  const emailProvider = resolveEmailProvider();
  let sentCount = 0;
  let failedCount = 0;

  for (const recipient of pendingRecipients) {
    const unsubscribeUrl = buildUnsubscribeUrl(recipient.newsletterSubscriberId);

    try {
      await emailProvider.sendTransactionalEmail({
        to: recipient.email,
        subject: campaign.subjectLine,
        html: buildEmailHtml(campaign.bodyHtml ?? "", unsubscribeUrl),
        text: buildEmailText(campaign.bodyText ?? "", unsubscribeUrl),
      });

      await db.newsletterCampaignRecipient.update({
        where: { id: recipient.id },
        data: { sentAt: new Date() },
      });

      sentCount++;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);

      await db.newsletterCampaignRecipient.update({
        where: { id: recipient.id },
        data: {
          failedAt: new Date(),
          errorMessage,
        },
      });

      console.error(
        `[newsletter] Échec envoi recipient ${recipient.id} (${recipient.email}):`,
        error
      );

      failedCount++;
    }
  }

  const allFailed = sentCount === 0 && failedCount > 0;
  const now = new Date();

  await db.newsletterCampaign.update({
    where: { id: campaignId },
    data: {
      status: allFailed ? "FAILED" : "SENT",
      sentAt: allFailed ? null : now,
      failedAt: allFailed ? now : null,
    },
  });

  revalidatePath(ADMIN_NEWSLETTER_CAMPAIGNS_PATH);

  return { ok: true, sentCount, failedCount };
}
