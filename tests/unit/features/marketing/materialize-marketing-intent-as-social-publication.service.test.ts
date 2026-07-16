import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/core/db", () => ({
  db: {
    marketingIntent: {
      findUnique: vi.fn(),
    },
    socialPublication: {
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
  type SocialPublication,
  SocialPublicationStatus,
} from "@/prisma-generated/client";
import { db } from "@/core/db";
import {
  buildMaterializedSocialPublicationCode,
  materializeMarketingIntentAsSocialPublication,
} from "@/features/marketing/editorial-intents/materialize-marketing-intent-as-social-publication.service";

const mockDb = db as unknown as {
  marketingIntent: {
    findUnique: ReturnType<typeof vi.fn>;
  };
  socialPublication: {
    findFirst: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
  };
};

const NOW = new Date("2026-07-16T08:00:00.000Z");

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

function buildPublication(overrides: Partial<SocialPublication> = {}): SocialPublication {
  return {
    id: "publication_1",
    storeId: "store_1",
    code: "mi-intent_1",
    subjectType: "BLOG_POST",
    subjectId: "post_1",
    channelCode: "generic",
    status: SocialPublicationStatus.DRAFT,
    title: "Article 1",
    body: "Article 1\n/blog/article-1",
    scheduledAt: null,
    publishedAt: null,
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

describe("materializeMarketingIntentAsSocialPublication", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("crée une SocialPublication DRAFT avec un code déterministe pour un intent APPROVED compatible social", async () => {
    const intent = buildIntent();
    const publication = buildPublication();

    mockDb.marketingIntent.findUnique.mockResolvedValue(intent);
    mockDb.socialPublication.findFirst.mockResolvedValue(null);
    mockDb.socialPublication.create.mockResolvedValue(publication);

    const result = await materializeMarketingIntentAsSocialPublication({ intentId: intent.id });

    expect(result).toEqual({ status: "created", socialPublication: publication });
    expect(mockDb.socialPublication.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        storeId: "store_1",
        code: buildMaterializedSocialPublicationCode(intent.id),
        channelCode: "generic",
        status: "DRAFT",
      }),
    });
  });

  it("retourne la publication existante sans recréer sur un rejeu (déjà matérialisé)", async () => {
    const intent = buildIntent();
    const existingPublication = buildPublication();

    mockDb.marketingIntent.findUnique.mockResolvedValue(intent);
    mockDb.socialPublication.findFirst.mockResolvedValue(existingPublication);

    const result = await materializeMarketingIntentAsSocialPublication({ intentId: intent.id });

    expect(result).toEqual({
      status: "already_materialized",
      socialPublication: existingPublication,
    });
    expect(mockDb.socialPublication.create).not.toHaveBeenCalled();
  });

  it("refuse un intent qui n'est pas APPROVED", async () => {
    const intent = buildIntent({ status: MarketingIntentStatus.PROPOSED });

    mockDb.marketingIntent.findUnique.mockResolvedValue(intent);

    const result = await materializeMarketingIntentAsSocialPublication({ intentId: intent.id });

    expect(result).toEqual({
      status: "invalid_status",
      socialPublication: null,
      currentStatus: "PROPOSED",
    });
    expect(mockDb.socialPublication.findFirst).not.toHaveBeenCalled();
    expect(mockDb.socialPublication.create).not.toHaveBeenCalled();
  });

  it("refuse un intent APPROVED sans le canal SOCIAL suggéré", async () => {
    const intent = buildIntent({ suggestedChannels: ["NEWSLETTER"] });

    mockDb.marketingIntent.findUnique.mockResolvedValue(intent);

    const result = await materializeMarketingIntentAsSocialPublication({ intentId: intent.id });

    expect(result).toEqual({ status: "channel_not_suggested", socialPublication: null });
    expect(mockDb.socialPublication.create).not.toHaveBeenCalled();
  });

  it("résout un conflit P2002 concurrent en retournant la publication créée par l'autre exécution", async () => {
    const intent = buildIntent();
    const concurrentPublication = buildPublication();
    const p2002Error = { code: "P2002" };

    mockDb.marketingIntent.findUnique.mockResolvedValue(intent);
    mockDb.socialPublication.findFirst
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(concurrentPublication);
    mockDb.socialPublication.create.mockRejectedValue(p2002Error);

    const result = await materializeMarketingIntentAsSocialPublication({ intentId: intent.id });

    expect(result).toEqual({
      status: "already_materialized",
      socialPublication: concurrentPublication,
    });
    expect(mockDb.socialPublication.findFirst).toHaveBeenCalledTimes(2);
  });

  it("construit un lien /blog/<slug> pour un intent BLOG_POST", async () => {
    const intent = buildIntent();

    mockDb.marketingIntent.findUnique.mockResolvedValue(intent);
    mockDb.socialPublication.findFirst.mockResolvedValue(null);
    mockDb.socialPublication.create.mockResolvedValue(buildPublication());

    await materializeMarketingIntentAsSocialPublication({ intentId: intent.id });

    expect(mockDb.socialPublication.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ body: "Article 1\n/blog/article-1" }),
    });
  });

  it("construit un lien / pour un intent HOMEPAGE", async () => {
    const intent = buildIntent({
      subjectType: MarketingIntentSubjectType.HOMEPAGE,
      subjectId: "homepage",
      contextJson: { title: "Accueil" },
    });

    mockDb.marketingIntent.findUnique.mockResolvedValue(intent);
    mockDb.socialPublication.findFirst.mockResolvedValue(null);
    mockDb.socialPublication.create.mockResolvedValue(buildPublication());

    await materializeMarketingIntentAsSocialPublication({ intentId: intent.id });

    expect(mockDb.socialPublication.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ body: "Accueil\n/" }),
    });
  });
});
