"use server";

import { revalidatePath } from "next/cache";

import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";
import { ADMIN_MARKETING_INTENTS_PATH } from "@/features/admin/marketing/shared/admin-marketing-routes";
import { getAdminNewsletterCampaignDetailPath } from "@/features/admin/marketing/newsletter/shared/admin-newsletter-routes";
import { materializeMarketingIntentAsNewsletterCampaign } from "@/features/marketing/editorial-intents/materialize-marketing-intent-as-newsletter-campaign.service";

export type MaterializeNewsletterCampaignActionResult =
  | Readonly<{ ok: true; alreadyMaterialized: boolean; campaignDetailPath: string }>
  | Readonly<{ ok: false; error: string }>;

export async function materializeNewsletterCampaignAction(
  intentId: string
): Promise<MaterializeNewsletterCampaignActionResult> {
  await requireAuthenticatedAdmin();

  const featureLevelMet = await meetsFeatureLevel("engagement.newsletter", "basic");

  if (!featureLevelMet) {
    return {
      ok: false,
      error: "La newsletter n'est pas activée (niveau basic requis).",
    };
  }

  const result = await materializeMarketingIntentAsNewsletterCampaign({ intentId });

  if (result.status === "not_found") {
    return { ok: false, error: "Intention marketing introuvable." };
  }

  if (result.status === "invalid_status") {
    return {
      ok: false,
      error: "Seule une intention approuvée peut être matérialisée en brouillon newsletter.",
    };
  }

  if (result.status === "channel_not_suggested") {
    return {
      ok: false,
      error: "Cette intention n'est pas compatible avec le canal newsletter.",
    };
  }

  revalidatePath(ADMIN_MARKETING_INTENTS_PATH);

  return {
    ok: true,
    alreadyMaterialized: result.status === "already_materialized",
    campaignDetailPath: getAdminNewsletterCampaignDetailPath(result.newsletterCampaign.id),
  };
}
