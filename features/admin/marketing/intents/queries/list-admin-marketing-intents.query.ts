import "server-only";

import type { MarketingIntent } from "@/prisma-generated/client";
import { db } from "@/core/db";

export type AdminMarketingIntentSummary = Pick<
  MarketingIntent,
  | "id"
  | "status"
  | "intentType"
  | "subjectType"
  | "subjectId"
  | "suggestedChannels"
  | "contextJson"
  | "createdAt"
  | "updatedAt"
>;

export async function listAdminMarketingIntents(): Promise<readonly AdminMarketingIntentSummary[]> {
  return db.marketingIntent.findMany({
    where: { status: { in: ["PROPOSED", "APPROVED"] } },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      status: true,
      intentType: true,
      subjectType: true,
      subjectId: true,
      suggestedChannels: true,
      contextJson: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}
