import "server-only";

import { db } from "@/core/db";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";

export type AdminNewsletterCampaignSummary = {
  id: string;
  code: string;
  name: string;
  subjectLine: string;
  status: string;
  sentAt: Date | null;
  scheduledAt: Date | null;
  createdAt: Date;
  recipientCount: number;
};

/**
 * Liste les `NewsletterCampaign` non archivées du store courant,
 * triées par `createdAt desc`.
 * Niveau `basic` — cf. `docs/lots/2026-06-13-engagement-newsletter-automations-cadrage.md`.
 */
export async function listAdminNewsletterCampaigns(): Promise<AdminNewsletterCampaignSummary[]> {
  const storeId = await getCurrentStoreId();

  if (storeId === null) {
    return [];
  }

  const rows = await db.newsletterCampaign.findMany({
    where: {
      storeId,
      archivedAt: null,
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      code: true,
      name: true,
      subjectLine: true,
      status: true,
      sentAt: true,
      scheduledAt: true,
      createdAt: true,
      _count: {
        select: { recipients: true },
      },
    },
  });

  return rows.map((row) => ({
    id: row.id,
    code: row.code,
    name: row.name,
    subjectLine: row.subjectLine,
    status: row.status,
    sentAt: row.sentAt,
    scheduledAt: row.scheduledAt,
    createdAt: row.createdAt,
    recipientCount: row._count.recipients,
  }));
}
