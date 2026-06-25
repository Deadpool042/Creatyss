"use server";

import { randomBytes } from "node:crypto";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { db } from "@/core/db";
import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { createNewsletterCampaignSchema } from "@/features/admin/marketing/newsletter/schemas/create-newsletter-campaign.schema";
import { ADMIN_NEWSLETTER_CAMPAIGNS_PATH } from "@/features/admin/marketing/newsletter/shared/admin-newsletter-routes";

function buildCampaignCode(name: string): string {
  const slug = name
    .toLowerCase()
    .normalize("NFD")
    // Strip combining diacritical marks (U+0300–U+036F)
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  const suffix = randomBytes(3).toString("hex");
  return `${slug}-${suffix}`;
}

/**
 * Crée une `NewsletterCampaign` en statut DRAFT.
 * Niveau `basic` — cf. `docs/lots/2026-06-13-engagement-newsletter-automations-cadrage.md`.
 */
export async function createNewsletterCampaignAction(formData: FormData): Promise<void> {
  const admin = await requireAuthenticatedAdmin();

  const previewTextRaw = String(formData.get("previewText") ?? "").trim();
  const bodyTextRaw = String(formData.get("bodyText") ?? "").trim();

  const parsed = createNewsletterCampaignSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    subjectLine: String(formData.get("subjectLine") ?? ""),
    previewText: previewTextRaw.length > 0 ? previewTextRaw : undefined,
    bodyHtml: String(formData.get("bodyHtml") ?? ""),
    bodyText: bodyTextRaw.length > 0 ? bodyTextRaw : undefined,
  });

  if (!parsed.success) {
    redirect(`${ADMIN_NEWSLETTER_CAMPAIGNS_PATH}?campaign_error=invalid_input`);
  }

  const storeId = await getCurrentStoreId();

  if (storeId === null) {
    redirect(`${ADMIN_NEWSLETTER_CAMPAIGNS_PATH}?campaign_error=missing_store`);
  }

  const data = parsed.data;
  const code = buildCampaignCode(data.name);

  await db.newsletterCampaign.create({
    data: {
      storeId,
      createdByUserId: admin.id,
      code,
      name: data.name,
      subjectLine: data.subjectLine,
      previewText: data.previewText ?? null,
      bodyHtml: data.bodyHtml,
      bodyText: data.bodyText ?? null,
      status: "DRAFT",
    },
  });

  revalidatePath(ADMIN_NEWSLETTER_CAMPAIGNS_PATH);
  redirect(`${ADMIN_NEWSLETTER_CAMPAIGNS_PATH}?campaign_created=1`);
}
