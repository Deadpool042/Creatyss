import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/core/db", () => ({
  db: {
    marketingIntent: {
      findUnique: vi.fn(),
    },
    newsletterCampaign: {
      findFirst: vi.fn(),
      create: vi.fn(),
    },
  },
}));

import {
  MarketingIntentStatus,
  MarketingIntentSubjectType,
  MarketingIntentType,
  type MarketingIntent,
  type NewsletterCampaign,
  NewsletterCampaignStatus,
} from "@/prisma-generated/client";
import { db } from "@/core/db";
import {
  buildMaterializedNewsletterCampaignCode,
  materializeMarketingIntentAsNewsletterCampaign,
} from "@/features/marketing/editorial-intents/materialize-marketing-intent-as-newsletter-campaign.service";

const mockDb = db as unknown as {
  marketingIntent: {
    findUnique: ReturnType<typeof vi.fn>;
  };
  newsletterCampaign: {
    findFirst: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
  };
};

const NOW = new Date("2026-07-15T08:00:00.000Z");

function buildIntent(overrides: Partial<MarketingIntent> = {}): MarketingIntent {
  return {
    id: "intent_1",
    storeId: "store_1",
    status: MarketingIntentStatus.APPROVED,
    intentType: MarketingIntentType.PROMOTE_EDITORIAL_CONTENT,
    subjectType: MarketingIntentSubjectType.BLOG_POST,
    subjectId: "post_1",
    suggestedChannels: ["NEWSLETTER", "SOCIAL"],
    deduplicationKey: "marketing-intent:store_1:PROMOTE_EDITORIAL_CONTENT:BLOG_POST:post_1:cycle:x",
    sourceDomainEventId: "evt_1",
    lastSourceDomainEventId: "evt_1",
    contextJson: { title: "Article 1", slug: "article-1" },
    reviewedAt: NOW,
    reviewedByUserId: "user_1",
    createdAt: NOW,
    updatedAt: NOW,
    ...overrides,
  };
}

function buildCampaign(overrides: Partial<NewsletterCampaign> = {}): NewsletterCampaign {
  return {
    id: "campaign_1",
    storeId: "store_1",
    code: "mi-intent_1",
    name: "Article 1",
    subjectLine: "Article 1",
    previewText: null,
    bodyText: "Article 1\n/blog/article-1",
    bodyHtml: '<p>Article 1</p><p><a href="/blog/article-1">Lire l\'article</a></p>',
    status: NewsletterCampaignStatus.DRAFT,
    scheduledAt: null,
    sendingStartedAt: null,
    sentAt: null,
    failedAt: null,
    cancelledAt: null,
    archivedAt: null,
    provider: null,
    providerReference: null,
    errorCode: null,
    errorMessage: null,
    createdByUserId: null,
    createdAt: NOW,
    updatedAt: NOW,
    ...overrides,
  };
}

describe("materializeMarketingIntentAsNewsletterCampaign", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("crée une NewsletterCampaign DRAFT avec un code déterministe pour un intent APPROVED compatible newsletter", async () => {
    const intent = buildIntent();
    const campaign = buildCampaign();

    mockDb.marketingIntent.findUnique.mockResolvedValue(intent);
    mockDb.newsletterCampaign.findFirst.mockResolvedValue(null);
    mockDb.newsletterCampaign.create.mockResolvedValue(campaign);

    const result = await materializeMarketingIntentAsNewsletterCampaign({ intentId: intent.id });

    expect(result).toEqual({ status: "created", newsletterCampaign: campaign });
    expect(mockDb.newsletterCampaign.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        storeId: "store_1",
        code: buildMaterializedNewsletterCampaignCode(intent.id),
        status: "DRAFT",
      }),
    });
  });

  it("retourne la campagne existante sans recréer sur un rejeu (déjà matérialisé)", async () => {
    const intent = buildIntent();
    const existingCampaign = buildCampaign();

    mockDb.marketingIntent.findUnique.mockResolvedValue(intent);
    mockDb.newsletterCampaign.findFirst.mockResolvedValue(existingCampaign);

    const result = await materializeMarketingIntentAsNewsletterCampaign({ intentId: intent.id });

    expect(result).toEqual({
      status: "already_materialized",
      newsletterCampaign: existingCampaign,
    });
    expect(mockDb.newsletterCampaign.create).not.toHaveBeenCalled();
  });

  describe.each<MarketingIntentStatus>([
    MarketingIntentStatus.PROPOSED,
    MarketingIntentStatus.REJECTED,
    MarketingIntentStatus.ARCHIVED,
  ])("refuse un intent au statut %s", (status) => {
    it("retourne invalid_status sans interroger ni écrire NewsletterCampaign", async () => {
      const intent = buildIntent({ status });

      mockDb.marketingIntent.findUnique.mockResolvedValue(intent);

      const result = await materializeMarketingIntentAsNewsletterCampaign({ intentId: intent.id });

      expect(result).toEqual({
        status: "invalid_status",
        newsletterCampaign: null,
        currentStatus: status,
      });
      expect(mockDb.newsletterCampaign.findFirst).not.toHaveBeenCalled();
      expect(mockDb.newsletterCampaign.create).not.toHaveBeenCalled();
    });
  });

  it("refuse un intent APPROVED sans le canal NEWSLETTER suggéré", async () => {
    const intent = buildIntent({ suggestedChannels: ["SOCIAL"] });

    mockDb.marketingIntent.findUnique.mockResolvedValue(intent);

    const result = await materializeMarketingIntentAsNewsletterCampaign({ intentId: intent.id });

    expect(result).toEqual({ status: "channel_not_suggested", newsletterCampaign: null });
    expect(mockDb.newsletterCampaign.create).not.toHaveBeenCalled();
  });

  it("résout un conflit P2002 concurrent en retournant la campagne créée par l'autre exécution", async () => {
    const intent = buildIntent();
    const concurrentCampaign = buildCampaign();
    const p2002Error = { code: "P2002" };

    mockDb.marketingIntent.findUnique.mockResolvedValue(intent);
    mockDb.newsletterCampaign.findFirst
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(concurrentCampaign);
    mockDb.newsletterCampaign.create.mockRejectedValue(p2002Error);

    const result = await materializeMarketingIntentAsNewsletterCampaign({ intentId: intent.id });

    expect(result).toEqual({
      status: "already_materialized",
      newsletterCampaign: concurrentCampaign,
    });
    expect(mockDb.newsletterCampaign.findFirst).toHaveBeenCalledTimes(2);
  });
});
