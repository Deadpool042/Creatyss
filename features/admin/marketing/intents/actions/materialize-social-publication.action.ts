"use server";

import { revalidatePath } from "next/cache";

import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";
import { ADMIN_MARKETING_INTENTS_PATH } from "@/features/admin/marketing/shared/admin-marketing-routes";
import { materializeMarketingIntentAsSocialPublication } from "@/features/marketing/editorial-intents/materialize-marketing-intent-as-social-publication.service";

export type MaterializeSocialPublicationActionResult =
  | Readonly<{ ok: true; alreadyMaterialized: boolean }>
  | Readonly<{ ok: false; error: string }>;

export async function materializeSocialPublicationAction(
  intentId: string
): Promise<MaterializeSocialPublicationActionResult> {
  await requireAuthenticatedAdmin();

  const featureLevelMet = await meetsFeatureLevel("engagement.social", "basic");

  if (!featureLevelMet) {
    return {
      ok: false,
      error: "La diffusion sociale n'est pas activée (niveau basic requis).",
    };
  }

  const result = await materializeMarketingIntentAsSocialPublication({ intentId });

  if (result.status === "not_found") {
    return { ok: false, error: "Intention marketing introuvable." };
  }

  if (result.status === "invalid_status") {
    return {
      ok: false,
      error: "Seule une intention approuvée peut être matérialisée en brouillon social.",
    };
  }

  if (result.status === "channel_not_suggested") {
    return {
      ok: false,
      error: "Cette intention n'est pas compatible avec le canal social.",
    };
  }

  revalidatePath(ADMIN_MARKETING_INTENTS_PATH);

  return {
    ok: true,
    alreadyMaterialized: result.status === "already_materialized",
  };
}
