"use server";

import { revalidatePath } from "next/cache";

import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { ADMIN_MARKETING_INTENTS_PATH } from "@/features/admin/marketing/shared/admin-marketing-routes";
import {
  reviewMarketingIntent,
  type MarketingIntentReviewDecision,
} from "@/features/marketing/editorial-intents/review-marketing-intent.service";

export type ReviewMarketingIntentActionResult = { ok: true } | { ok: false; error: string };

export async function reviewMarketingIntentAction(
  intentId: string,
  decision: MarketingIntentReviewDecision
): Promise<ReviewMarketingIntentActionResult> {
  const admin = await requireAuthenticatedAdmin();

  const result = await reviewMarketingIntent({
    intentId,
    decision,
    reviewedByUserId: admin.id,
  });

  if (result.status === "not_found") {
    return { ok: false, error: "Intention marketing introuvable." };
  }

  if (result.status === "invalid_transition") {
    return { ok: false, error: "Cette décision n'est plus applicable à cette intention." };
  }

  revalidatePath(ADMIN_MARKETING_INTENTS_PATH);

  return { ok: true };
}
