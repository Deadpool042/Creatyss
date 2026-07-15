"use server";

import "server-only";

import type { MarketingIntent, MarketingIntentStatus } from "@/prisma-generated/client";
import { db } from "@/core/db";

export type MarketingIntentReviewDecision = "APPROVED" | "REJECTED" | "ARCHIVED";

export type ReviewMarketingIntentInput = Readonly<{
  intentId: string;
  decision: MarketingIntentReviewDecision;
  reviewedByUserId: string;
}>;

export type ReviewMarketingIntentResult =
  | Readonly<{
      status: "reviewed";
      marketingIntent: MarketingIntent;
    }>
  | Readonly<{
      status: "not_found";
      marketingIntent: null;
    }>
  | Readonly<{
      status: "invalid_transition";
      marketingIntent: null;
      currentStatus: MarketingIntentStatus;
    }>;

function canApplyReviewDecision(
  currentStatus: MarketingIntentStatus,
  decision: MarketingIntentReviewDecision
): boolean {
  switch (currentStatus) {
    case "PROPOSED":
      return true;
    case "APPROVED":
    case "REJECTED":
      return decision === "ARCHIVED";
    case "ARCHIVED":
      return false;
  }
}

export async function reviewMarketingIntent(
  input: ReviewMarketingIntentInput
): Promise<ReviewMarketingIntentResult> {
  const intent = await db.marketingIntent.findUnique({
    where: { id: input.intentId },
  });

  if (intent === null) {
    return { status: "not_found", marketingIntent: null };
  }

  if (!canApplyReviewDecision(intent.status, input.decision)) {
    return {
      status: "invalid_transition",
      marketingIntent: null,
      currentStatus: intent.status,
    };
  }

  const marketingIntent = await db.marketingIntent.update({
    where: { id: intent.id },
    data: {
      status: input.decision,
      reviewedAt: new Date(),
      reviewedByUserId: input.reviewedByUserId,
    },
  });

  return { status: "reviewed", marketingIntent };
}
