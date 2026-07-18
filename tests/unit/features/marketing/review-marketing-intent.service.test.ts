import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/core/db", () => ({
  db: {
    marketingIntent: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

import {
  MarketingIntentChannel,
  MarketingIntentStatus,
  MarketingIntentSubjectType,
  MarketingIntentType,
  type MarketingIntent,
} from "@/prisma-generated/client";
import { db } from "@/core/db";
import {
  reviewMarketingIntent,
  type MarketingIntentReviewDecision,
} from "@/features/marketing/editorial-intents/review-marketing-intent.service";

const mockDb = db as unknown as {
  marketingIntent: {
    findUnique: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
  };
};

const NOW = new Date("2026-07-18T09:00:00.000Z");

function buildMarketingIntent(overrides: Partial<MarketingIntent> = {}): MarketingIntent {
  return {
    id: "intent_1",
    storeId: "store_1",
    status: MarketingIntentStatus.PROPOSED,
    intentType: MarketingIntentType.PROMOTE_EDITORIAL_CONTENT,
    subjectType: MarketingIntentSubjectType.BLOG_POST,
    subjectId: "post_1",
    suggestedChannels: [MarketingIntentChannel.NEWSLETTER, MarketingIntentChannel.SOCIAL],
    deduplicationKey: "marketing-intent:store_1:PROMOTE_EDITORIAL_CONTENT:BLOG_POST:post_1",
    sourceDomainEventId: "evt_1",
    lastSourceDomainEventId: "evt_1",
    contextJson: {
      sourceEventType: "content.blog_post.published",
      lastEventType: "content.blog_post.published",
      publicationCycleKey: "2026-07-18T09:00:00.000Z",
    },
    reviewedAt: null,
    reviewedByUserId: null,
    createdAt: NOW,
    updatedAt: NOW,
    ...overrides,
  };
}

describe("reviewMarketingIntent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retourne not_found et n'appelle pas update si l'intention n'existe pas", async () => {
    mockDb.marketingIntent.findUnique.mockResolvedValue(null);

    const result = await reviewMarketingIntent({
      intentId: "intent_missing",
      decision: "APPROVED",
      reviewedByUserId: "admin_1",
    });

    expect(result).toEqual({ status: "not_found", marketingIntent: null });
    expect(mockDb.marketingIntent.update).not.toHaveBeenCalled();
  });

  describe.each<MarketingIntentReviewDecision>(["APPROVED", "REJECTED", "ARCHIVED"])(
    "depuis PROPOSED, décision %s",
    (decision) => {
      it("est autorisée, met à jour statut/reviewedAt/reviewedByUserId et retourne l'intention", async () => {
        const currentIntent = buildMarketingIntent({ status: MarketingIntentStatus.PROPOSED });
        const updatedIntent = buildMarketingIntent({
          status: MarketingIntentStatus[decision],
          reviewedAt: NOW,
          reviewedByUserId: "admin_1",
        });
        mockDb.marketingIntent.findUnique.mockResolvedValue(currentIntent);
        mockDb.marketingIntent.update.mockResolvedValue(updatedIntent);

        const result = await reviewMarketingIntent({
          intentId: "intent_1",
          decision,
          reviewedByUserId: "admin_1",
        });

        expect(result).toEqual({ status: "reviewed", marketingIntent: updatedIntent });
        expect(mockDb.marketingIntent.update).toHaveBeenCalledTimes(1);
        expect(mockDb.marketingIntent.update).toHaveBeenCalledWith({
          where: { id: "intent_1" },
          data: {
            status: decision,
            reviewedAt: expect.any(Date),
            reviewedByUserId: "admin_1",
          },
        });
      });
    }
  );

  it("autorise ARCHIVED depuis APPROVED", async () => {
    const currentIntent = buildMarketingIntent({ status: MarketingIntentStatus.APPROVED });
    const updatedIntent = buildMarketingIntent({
      status: MarketingIntentStatus.ARCHIVED,
      reviewedAt: NOW,
      reviewedByUserId: "admin_1",
    });
    mockDb.marketingIntent.findUnique.mockResolvedValue(currentIntent);
    mockDb.marketingIntent.update.mockResolvedValue(updatedIntent);

    const result = await reviewMarketingIntent({
      intentId: "intent_1",
      decision: "ARCHIVED",
      reviewedByUserId: "admin_1",
    });

    expect(result).toEqual({ status: "reviewed", marketingIntent: updatedIntent });
    expect(mockDb.marketingIntent.update).toHaveBeenCalledWith({
      where: { id: "intent_1" },
      data: { status: "ARCHIVED", reviewedAt: expect.any(Date), reviewedByUserId: "admin_1" },
    });
  });

  it("autorise ARCHIVED depuis REJECTED", async () => {
    const currentIntent = buildMarketingIntent({ status: MarketingIntentStatus.REJECTED });
    const updatedIntent = buildMarketingIntent({
      status: MarketingIntentStatus.ARCHIVED,
      reviewedAt: NOW,
      reviewedByUserId: "admin_1",
    });
    mockDb.marketingIntent.findUnique.mockResolvedValue(currentIntent);
    mockDb.marketingIntent.update.mockResolvedValue(updatedIntent);

    const result = await reviewMarketingIntent({
      intentId: "intent_1",
      decision: "ARCHIVED",
      reviewedByUserId: "admin_1",
    });

    expect(result).toEqual({ status: "reviewed", marketingIntent: updatedIntent });
    expect(mockDb.marketingIntent.update).toHaveBeenCalledWith({
      where: { id: "intent_1" },
      data: { status: "ARCHIVED", reviewedAt: expect.any(Date), reviewedByUserId: "admin_1" },
    });
  });

  describe.each<{
    currentStatus: MarketingIntentStatus;
    decision: MarketingIntentReviewDecision;
  }>([
    { currentStatus: MarketingIntentStatus.APPROVED, decision: "APPROVED" },
    { currentStatus: MarketingIntentStatus.APPROVED, decision: "REJECTED" },
    { currentStatus: MarketingIntentStatus.REJECTED, decision: "APPROVED" },
    { currentStatus: MarketingIntentStatus.REJECTED, decision: "REJECTED" },
    { currentStatus: MarketingIntentStatus.ARCHIVED, decision: "APPROVED" },
    { currentStatus: MarketingIntentStatus.ARCHIVED, decision: "REJECTED" },
    { currentStatus: MarketingIntentStatus.ARCHIVED, decision: "ARCHIVED" },
  ])("transition interdite : $currentStatus -> $decision", ({ currentStatus, decision }) => {
    it("retourne invalid_transition avec le statut courant et n'écrit rien en base", async () => {
      const currentIntent = buildMarketingIntent({ status: currentStatus });
      mockDb.marketingIntent.findUnique.mockResolvedValue(currentIntent);

      const result = await reviewMarketingIntent({
        intentId: "intent_1",
        decision,
        reviewedByUserId: "admin_1",
      });

      expect(result).toEqual({
        status: "invalid_transition",
        marketingIntent: null,
        currentStatus,
      });
      expect(mockDb.marketingIntent.update).not.toHaveBeenCalled();
    });
  });
});
