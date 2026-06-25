import "server-only";

import { db } from "@/core/db";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";

export type AdminNewsletterCampaignDetail = {
  id: string;
  code: string;
  name: string;
  subjectLine: string;
  previewText: string | null;
  bodyHtml: string | null;
  bodyText: string | null;
  status: string;
  sentAt: Date | null;
  failedAt: Date | null;
  scheduledAt: Date | null;
  sendingStartedAt: Date | null;
  createdAt: Date;
  recipientCount: number;
  sentCount: number;
  failedCount: number;
};

/**
 * Détail d'une `NewsletterCampaign` avec compteurs de recipients par statut.
 * Retourne `null` si la campagne n'existe pas ou n'appartient pas au store.
 */
export async function getAdminNewsletterCampaignDetail(
  campaignId: string
): Promise<AdminNewsletterCampaignDetail | null> {
  const storeId = await getCurrentStoreId();

  if (storeId === null) {
    return null;
  }

  const campaign = await db.newsletterCampaign.findFirst({
    where: {
      id: campaignId,
      storeId,
      archivedAt: null,
    },
    select: {
      id: true,
      code: true,
      name: true,
      subjectLine: true,
      previewText: true,
      bodyHtml: true,
      bodyText: true,
      status: true,
      sentAt: true,
      failedAt: true,
      scheduledAt: true,
      sendingStartedAt: true,
      createdAt: true,
      _count: {
        select: { recipients: true },
      },
      recipients: {
        select: {
          sentAt: true,
          failedAt: true,
        },
      },
    },
  });

  if (!campaign) {
    return null;
  }

  const sentCount = campaign.recipients.filter((r) => r.sentAt !== null).length;
  const failedCount = campaign.recipients.filter((r) => r.failedAt !== null).length;

  return {
    id: campaign.id,
    code: campaign.code,
    name: campaign.name,
    subjectLine: campaign.subjectLine,
    previewText: campaign.previewText,
    bodyHtml: campaign.bodyHtml,
    bodyText: campaign.bodyText,
    status: campaign.status,
    sentAt: campaign.sentAt,
    failedAt: campaign.failedAt,
    scheduledAt: campaign.scheduledAt,
    sendingStartedAt: campaign.sendingStartedAt,
    createdAt: campaign.createdAt,
    recipientCount: campaign._count.recipients,
    sentCount,
    failedCount,
  };
}
