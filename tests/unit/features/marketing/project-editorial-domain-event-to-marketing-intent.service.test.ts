import { beforeEach, describe, expect, it, vi } from "vitest";

const mockTx = {
  marketingIntent: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    count: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
  domainEventDelivery: {
    update: vi.fn(),
  },
};

vi.mock("@/core/db", () => ({
  db: {
    domainEventDelivery: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    marketingIntent: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    $transaction: vi.fn(
      async (
        callback: (tx: typeof mockTx) => Promise<unknown>,
      ): Promise<unknown> => callback(mockTx),
    ),
  },
}));

import {
  DomainEventStatus,
  MarketingIntentChannel,
  MarketingIntentStatus,
  MarketingIntentSubjectType,
  MarketingIntentType,
  type DomainEvent,
  type DomainEventDelivery,
  type MarketingIntent,
} from "@/prisma-generated/client";
import { db } from "@/core/db";
import {
  EDITORIAL_MARKETING_INTENT_CONSUMER_CODE,
  projectEditorialDomainEventToMarketingIntent,
} from "@/features/marketing/editorial-intents/project-editorial-domain-event-to-marketing-intent.service";

const mockDb = db as unknown as {
  domainEventDelivery: {
    findUnique: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
  };
  marketingIntent: {
    findUnique: ReturnType<typeof vi.fn>;
    findMany: ReturnType<typeof vi.fn>;
    count: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
  };
  $transaction: ReturnType<typeof vi.fn>;
};

const NOW = new Date("2026-07-09T08:00:00.000Z");

function buildDomainEvent(overrides: Partial<DomainEvent> = {}): DomainEvent {
  return {
    id: "evt_1",
    storeId: "store_1",
    eventType: "content.blog_post.published",
    eventVersion: 1,
    aggregateType: "BLOG_POST",
    aggregateId: "post_1",
    status: DomainEventStatus.PENDING,
    idempotencyKey: "blog-post:post_1:published:2026-07-09T08:00:00.000Z",
    payloadJson: JSON.stringify({
      postId: "post_1",
      slug: "article-1",
      title: "Article 1",
      publishedAt: "2026-07-09T08:00:00.000Z",
    }),
    metadataJson: null,
    occurredAt: NOW,
    publishedAt: null,
    failedAt: null,
    archivedAt: null,
    errorCode: null,
    errorMessage: null,
    createdAt: NOW,
    updatedAt: NOW,
    ...overrides,
  };
}

function buildDelivery(
  overrides: Partial<DomainEventDelivery> = {},
): DomainEventDelivery {
  return {
    id: "delivery_1",
    domainEventId: "evt_1",
    consumerCode: EDITORIAL_MARKETING_INTENT_CONSUMER_CODE,
    status: DomainEventStatus.PUBLISHED,
    attemptCount: 1,
    deliveredAt: NOW,
    failedAt: null,
    errorCode: null,
    errorMessage: null,
    createdAt: NOW,
    updatedAt: NOW,
    ...overrides,
  };
}

function buildMarketingIntent(
  overrides: Partial<MarketingIntent> = {},
): MarketingIntent {
  return {
    id: "intent_1",
    storeId: "store_1",
    status: MarketingIntentStatus.PROPOSED,
    intentType: MarketingIntentType.PROMOTE_EDITORIAL_CONTENT,
    subjectType: MarketingIntentSubjectType.BLOG_POST,
    subjectId: "post_1",
    suggestedChannels: [
      MarketingIntentChannel.NEWSLETTER,
      MarketingIntentChannel.SOCIAL,
    ],
    deduplicationKey:
      "marketing-intent:store_1:PROMOTE_EDITORIAL_CONTENT:BLOG_POST:post_1:cycle:2026-07-09T08:00:00.000Z",
    sourceDomainEventId: "evt_1",
    lastSourceDomainEventId: "evt_1",
    contextJson: {
      sourceEventType: "content.blog_post.published",
      lastEventType: "content.blog_post.published",
      publicationCycleKey: "2026-07-09T08:00:00.000Z",
    },
    reviewedAt: null,
    reviewedByUserId: null,
    createdAt: NOW,
    updatedAt: NOW,
    ...overrides,
  };
}

describe("projectEditorialDomainEventToMarketingIntent", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockDb.domainEventDelivery.findUnique.mockResolvedValue(null);
    mockDb.domainEventDelivery.create.mockResolvedValue(
      buildDelivery({
        id: "delivery_pending",
        status: DomainEventStatus.PENDING,
        deliveredAt: null,
      }),
    );
    mockDb.domainEventDelivery.update.mockImplementation(
      async ({ data }: { data: Record<string, unknown> }) =>
        buildDelivery({
          id: "delivery_pending",
          status: data.status as DomainEventStatus,
          deliveredAt:
            data.deliveredAt instanceof Date ? data.deliveredAt : NOW,
          failedAt:
            data.failedAt instanceof Date || data.failedAt === null
              ? (data.failedAt as Date | null)
              : null,
          errorCode:
            typeof data.errorCode === "string" || data.errorCode === null
              ? data.errorCode
              : null,
          errorMessage:
            typeof data.errorMessage === "string" || data.errorMessage === null
              ? data.errorMessage
              : null,
        }),
    );
    mockDb.marketingIntent.findUnique.mockResolvedValue(null);
    mockDb.marketingIntent.findMany.mockResolvedValue([]);
    mockDb.marketingIntent.count.mockResolvedValue(0);
    mockDb.marketingIntent.create.mockResolvedValue(buildMarketingIntent());
    mockDb.marketingIntent.update.mockResolvedValue(buildMarketingIntent());

    mockTx.marketingIntent.findUnique.mockImplementation(
      mockDb.marketingIntent.findUnique,
    );
    mockTx.marketingIntent.findMany.mockImplementation(
      mockDb.marketingIntent.findMany,
    );
    mockTx.marketingIntent.count.mockImplementation(mockDb.marketingIntent.count);
    mockTx.marketingIntent.create.mockImplementation(
      mockDb.marketingIntent.create,
    );
    mockTx.marketingIntent.update.mockImplementation(
      mockDb.marketingIntent.update,
    );
    mockTx.domainEventDelivery.update.mockImplementation(
      mockDb.domainEventDelivery.update,
    );
  });

  it("crée un MarketingIntent PROPOSED NEWSLETTER + SOCIAL pour blog_post.published", async () => {
    const marketingIntent = buildMarketingIntent();
    mockDb.marketingIntent.create.mockResolvedValue(marketingIntent);

    const result = await projectEditorialDomainEventToMarketingIntent({
      domainEvent: buildDomainEvent(),
    });

    expect(result.status).toBe("created");
    expect(result.marketingIntent).toEqual(marketingIntent);
    expect(mockDb.marketingIntent.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        status: MarketingIntentStatus.PROPOSED,
        intentType: MarketingIntentType.PROMOTE_EDITORIAL_CONTENT,
        subjectType: MarketingIntentSubjectType.BLOG_POST,
        subjectId: "post_1",
        suggestedChannels: [
          MarketingIntentChannel.NEWSLETTER,
          MarketingIntentChannel.SOCIAL,
        ],
        sourceDomainEventId: "evt_1",
        lastSourceDomainEventId: "evt_1",
      }),
    });
  });

  it("n'écrit aucun MarketingIntent pour legal_page.updated", async () => {
    const result = await projectEditorialDomainEventToMarketingIntent({
      domainEvent: buildDomainEvent({
        eventType: "content.legal_page.updated",
        aggregateType: "PAGE",
        aggregateId: "page_1",
        payloadJson: JSON.stringify({
          pageId: "page_1",
          slug: "mentions-legales",
          title: "Mentions légales",
          changedFields: ["title"],
        }),
      }),
    });

    expect(result).toMatchObject({
      status: "ignored",
      reason: "LEGAL_CONTENT",
    });
    expect(mockDb.marketingIntent.create).not.toHaveBeenCalled();
    expect(mockDb.marketingIntent.update).not.toHaveBeenCalled();
  });

  it("ignore blog_post.unpublished et blog_post.archived sans créer d'intent", async () => {
    const unpublished = await projectEditorialDomainEventToMarketingIntent({
      domainEvent: buildDomainEvent({
        eventType: "content.blog_post.unpublished",
      }),
    });

    const archived = await projectEditorialDomainEventToMarketingIntent({
      domainEvent: buildDomainEvent({
        id: "evt_2",
        eventType: "content.blog_post.archived",
        payloadJson: JSON.stringify({
          postId: "post_1",
          slug: "article-1",
          title: "Article 1",
          publishedAt: "2026-07-09T08:00:00.000Z",
          archivedAt: "2026-07-10T08:00:00.000Z",
        }),
      }),
    });

    expect(unpublished).toMatchObject({
      status: "ignored",
      reason: "EDITORIAL_CONTENT_UNPUBLISHED",
    });
    expect(archived).toMatchObject({
      status: "ignored",
      reason: "EDITORIAL_CONTENT_ARCHIVED",
    });
    expect(mockDb.marketingIntent.create).not.toHaveBeenCalled();
  });

  it("crée une suggestion PROPOSED SOCIAL seulement pour homepage.published", async () => {
    const marketingIntent = buildMarketingIntent({
      subjectType: MarketingIntentSubjectType.HOMEPAGE,
      subjectId: "homepage_1",
      suggestedChannels: [MarketingIntentChannel.SOCIAL],
      contextJson: {
        sourceEventType: "content.homepage.published",
        lastEventType: "content.homepage.published",
        publicationCycleKey: "2026-07-09T08:00:00.000Z",
        optional: true,
      },
      deduplicationKey:
        "marketing-intent:store_1:PROMOTE_EDITORIAL_CONTENT:HOMEPAGE:homepage_1:cycle:2026-07-09T08:00:00.000Z",
    });
    mockDb.marketingIntent.create.mockResolvedValue(marketingIntent);

    const result = await projectEditorialDomainEventToMarketingIntent({
      domainEvent: buildDomainEvent({
        eventType: "content.homepage.published",
        aggregateType: "HOMEPAGE",
        aggregateId: "homepage_1",
        payloadJson: JSON.stringify({
          homepageId: "homepage_1",
          title: "Homepage",
          publishedAt: "2026-07-09T08:00:00.000Z",
        }),
      }),
    });

    expect(result).toMatchObject({
      status: "created",
      optional: true,
    });
    expect(mockDb.marketingIntent.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        subjectType: MarketingIntentSubjectType.HOMEPAGE,
        subjectId: "homepage_1",
        suggestedChannels: [MarketingIntentChannel.SOCIAL],
        contextJson: expect.objectContaining({
          optional: true,
        }),
      }),
    });
  });

  it("merge sur un intent PROPOSED ouvert en mettant à jour lastSourceDomainEventId", async () => {
    const openIntent = buildMarketingIntent({
      id: "intent_open",
      lastSourceDomainEventId: "evt_published",
      contextJson: {
        sourceEventType: "content.blog_post.published",
        lastEventType: "content.blog_post.published",
        publicationCycleKey: "2026-07-09T08:00:00.000Z",
      },
    });
    const mergedIntent = buildMarketingIntent({
      id: "intent_open",
      lastSourceDomainEventId: "evt_2",
      contextJson: {
        sourceEventType: "content.blog_post.published",
        lastEventType: "content.blog_post.updated_visible",
        publicationCycleKey: "2026-07-09T08:00:00.000Z",
        changedFields: ["title"],
      },
    });

    mockDb.marketingIntent.findMany.mockResolvedValue([openIntent]);
    mockDb.marketingIntent.update.mockResolvedValue(mergedIntent);

    const result = await projectEditorialDomainEventToMarketingIntent({
      domainEvent: buildDomainEvent({
        id: "evt_2",
        eventType: "content.blog_post.updated_visible",
        payloadJson: JSON.stringify({
          postId: "post_1",
          slug: "article-1",
          title: "Article retitré",
          changedFields: ["title"],
          publishedAt: "2026-07-09T08:00:00.000Z",
        }),
      }),
    });

    expect(result).toMatchObject({
      status: "merged",
      marketingIntent: mergedIntent,
    });
    expect(mockDb.marketingIntent.update).toHaveBeenCalledWith({
      where: { id: "intent_open" },
      data: expect.objectContaining({
        lastSourceDomainEventId: "evt_2",
      }),
    });
  });

  it("ne modifie pas APPROVED, REJECTED ou ARCHIVED quand aucun PROPOSED n'est ouvert", async () => {
    mockDb.marketingIntent.findMany.mockResolvedValue([]);
    mockDb.marketingIntent.count.mockResolvedValue(0);

    const result = await projectEditorialDomainEventToMarketingIntent({
      domainEvent: buildDomainEvent({
        id: "evt_2",
        eventType: "content.blog_post.updated_visible",
        payloadJson: JSON.stringify({
          postId: "post_1",
          slug: "article-1",
          title: "Article retitré",
          changedFields: ["title"],
          publishedAt: "2026-07-09T08:00:00.000Z",
        }),
      }),
    });

    expect(result).toMatchObject({
      status: "ignored",
      reason: "NO_OPEN_PROPOSED_INTENT",
    });
    expect(mockDb.marketingIntent.update).not.toHaveBeenCalled();
  });

  it("retourne un résultat idempotent si la delivery existe déjà", async () => {
    const existingDelivery = buildDelivery();
    mockDb.domainEventDelivery.findUnique.mockResolvedValue(existingDelivery);

    const result = await projectEditorialDomainEventToMarketingIntent({
      domainEvent: buildDomainEvent(),
    });

    expect(result).toEqual({
      status: "already_processed",
      delivery: existingDelivery,
      marketingIntent: null,
    });
    expect(mockDb.domainEventDelivery.create).not.toHaveBeenCalled();
    expect(mockDb.marketingIntent.create).not.toHaveBeenCalled();
  });

  it("retourne pending_delivery si une delivery PENDING existe déjà", async () => {
    const existingDelivery = buildDelivery({
      status: DomainEventStatus.PENDING,
      deliveredAt: null,
    });
    mockDb.domainEventDelivery.findUnique.mockResolvedValue(existingDelivery);

    const result = await projectEditorialDomainEventToMarketingIntent({
      domainEvent: buildDomainEvent(),
    });

    expect(result).toEqual({
      status: "pending_delivery",
      delivery: existingDelivery,
      marketingIntent: null,
    });
    expect(mockDb.domainEventDelivery.update).not.toHaveBeenCalled();
    expect(mockDb.marketingIntent.create).not.toHaveBeenCalled();
  });

  it("retourne skipped_terminal_delivery si une delivery CANCELLED existe déjà", async () => {
    const existingDelivery = buildDelivery({
      status: DomainEventStatus.CANCELLED,
      deliveredAt: null,
    });
    mockDb.domainEventDelivery.findUnique.mockResolvedValue(existingDelivery);

    const result = await projectEditorialDomainEventToMarketingIntent({
      domainEvent: buildDomainEvent(),
    });

    expect(result).toEqual({
      status: "skipped_terminal_delivery",
      delivery: existingDelivery,
      marketingIntent: null,
    });
    expect(mockDb.domainEventDelivery.update).not.toHaveBeenCalled();
    expect(mockDb.marketingIntent.create).not.toHaveBeenCalled();
  });

  it("retourne skipped_terminal_delivery si une delivery ARCHIVED existe déjà", async () => {
    const existingDelivery = buildDelivery({
      status: DomainEventStatus.ARCHIVED,
      deliveredAt: null,
    });
    mockDb.domainEventDelivery.findUnique.mockResolvedValue(existingDelivery);

    const result = await projectEditorialDomainEventToMarketingIntent({
      domainEvent: buildDomainEvent(),
    });

    expect(result).toEqual({
      status: "skipped_terminal_delivery",
      delivery: existingDelivery,
      marketingIntent: null,
    });
    expect(mockDb.domainEventDelivery.update).not.toHaveBeenCalled();
    expect(mockDb.marketingIntent.create).not.toHaveBeenCalled();
  });

  it("rejoue une delivery FAILED puis la marque PUBLISHED si la projection réussit", async () => {
    const failedDelivery = buildDelivery({
      status: DomainEventStatus.FAILED,
      deliveredAt: null,
      failedAt: NOW,
      errorCode: "OLD_ERROR",
      errorMessage: "old failure",
    });
    const retriedDelivery = buildDelivery({
      status: DomainEventStatus.PENDING,
      deliveredAt: null,
      failedAt: null,
      errorCode: null,
      errorMessage: null,
      attemptCount: 2,
    });
    const publishedDelivery = buildDelivery({
      status: DomainEventStatus.PUBLISHED,
      attemptCount: 2,
    });
    const marketingIntent = buildMarketingIntent();

    mockDb.domainEventDelivery.findUnique.mockResolvedValue(failedDelivery);
    mockDb.domainEventDelivery.update
      .mockResolvedValueOnce(retriedDelivery)
      .mockResolvedValueOnce(publishedDelivery);
    mockDb.marketingIntent.create.mockResolvedValue(marketingIntent);

    const result = await projectEditorialDomainEventToMarketingIntent({
      domainEvent: buildDomainEvent(),
    });

    expect(result).toEqual({
      status: "created",
      delivery: publishedDelivery,
      marketingIntent,
      optional: false,
    });
    expect(mockDb.domainEventDelivery.update).toHaveBeenNthCalledWith(1, {
      where: { id: failedDelivery.id },
      data: {
        status: "PENDING",
        deliveredAt: null,
        failedAt: null,
        errorCode: null,
        errorMessage: null,
        attemptCount: {
          increment: 1,
        },
      },
    });
  });

  it("laisse une delivery FAILED si la projection rejouée échoue encore", async () => {
    const failedDelivery = buildDelivery({
      status: DomainEventStatus.FAILED,
      deliveredAt: null,
      failedAt: NOW,
    });
    const retriedDelivery = buildDelivery({
      status: DomainEventStatus.PENDING,
      deliveredAt: null,
      failedAt: null,
      attemptCount: 2,
    });
    const finalFailedDelivery = buildDelivery({
      status: DomainEventStatus.FAILED,
      deliveredAt: null,
      failedAt: NOW,
      errorCode: "MARKETING_INTENT_PROJECTION_FAILED",
      errorMessage: "projection crash",
      attemptCount: 2,
    });
    const projectionError = new Error("projection crash");

    mockDb.domainEventDelivery.findUnique.mockResolvedValue(failedDelivery);
    mockDb.domainEventDelivery.update
      .mockResolvedValueOnce(retriedDelivery)
      .mockResolvedValueOnce(finalFailedDelivery);
    mockDb.marketingIntent.create.mockRejectedValue(projectionError);

    await expect(
      projectEditorialDomainEventToMarketingIntent({
        domainEvent: buildDomainEvent(),
      }),
    ).rejects.toBe(projectionError);

    expect(mockDb.domainEventDelivery.update).toHaveBeenCalled();
  });

  it("crée une nouvelle delivery PENDING puis la marque PUBLISHED sur projection réussie", async () => {
    const pendingDelivery = buildDelivery({
      id: "delivery_pending",
      status: DomainEventStatus.PENDING,
      deliveredAt: null,
    });
    const publishedDelivery = buildDelivery({
      id: "delivery_pending",
      status: DomainEventStatus.PUBLISHED,
    });
    const marketingIntent = buildMarketingIntent();

    mockDb.domainEventDelivery.create.mockResolvedValue(pendingDelivery);
    mockDb.domainEventDelivery.update.mockResolvedValue(publishedDelivery);
    mockDb.marketingIntent.create.mockResolvedValue(marketingIntent);

    const result = await projectEditorialDomainEventToMarketingIntent({
      domainEvent: buildDomainEvent(),
    });

    expect(result).toMatchObject({
      status: "created",
      delivery: publishedDelivery,
      marketingIntent,
      optional: false,
    });
    expect(mockDb.domainEventDelivery.create).toHaveBeenCalledWith({
      data: {
        domainEventId: "evt_1",
        consumerCode: EDITORIAL_MARKETING_INTENT_CONSUMER_CODE,
        status: "PENDING",
        attemptCount: 1,
      },
    });
    expect(mockDb.domainEventDelivery.update).toHaveBeenCalledWith({
      where: { id: "delivery_pending" },
      data: {
        status: "PUBLISHED",
        deliveredAt: expect.any(Date),
        failedAt: null,
        errorCode: null,
        errorMessage: null,
      },
    });
  });

  it("marque la delivery PUBLISHED lors d'une projection IGNORE sans créer d'intent", async () => {
    const pendingDelivery = buildDelivery({
      id: "delivery_pending",
      status: DomainEventStatus.PENDING,
      deliveredAt: null,
    });
    const publishedDelivery = buildDelivery({
      id: "delivery_pending",
      status: DomainEventStatus.PUBLISHED,
    });
    mockDb.domainEventDelivery.create.mockResolvedValue(pendingDelivery);
    mockDb.domainEventDelivery.update.mockResolvedValue(publishedDelivery);

    const result = await projectEditorialDomainEventToMarketingIntent({
      domainEvent: buildDomainEvent({
        eventType: "content.legal_page.updated",
        aggregateType: "PAGE",
        aggregateId: "page_1",
        payloadJson: JSON.stringify({
          pageId: "page_1",
          slug: "mentions-legales",
          title: "Mentions légales",
          changedFields: ["title"],
        }),
      }),
    });

    expect(result).toEqual({
      status: "ignored",
      delivery: publishedDelivery,
      marketingIntent: null,
      reason: "LEGAL_CONTENT",
    });
    expect(mockDb.marketingIntent.create).not.toHaveBeenCalled();
  });

  it("marque la delivery FAILED avec une erreur exploitable si la projection échoue", async () => {
    const pendingDelivery = buildDelivery({
      id: "delivery_pending",
      status: DomainEventStatus.PENDING,
      deliveredAt: null,
    });
    const failedDelivery = buildDelivery({
      id: "delivery_pending",
      status: DomainEventStatus.FAILED,
      deliveredAt: null,
      failedAt: NOW,
      errorCode: "MARKETING_INTENT_PROJECTION_FAILED",
      errorMessage: "projection crash",
    });
    const projectionError = new Error("projection crash");

    mockDb.domainEventDelivery.create.mockResolvedValue(pendingDelivery);
    mockDb.domainEventDelivery.update.mockResolvedValue(failedDelivery);
    mockDb.marketingIntent.create.mockRejectedValue(projectionError);

    await expect(
      projectEditorialDomainEventToMarketingIntent({
        domainEvent: buildDomainEvent(),
      }),
    ).rejects.toBe(projectionError);

    expect(mockDb.domainEventDelivery.update).toHaveBeenCalled();
  });

  it("inclut storeId dans deduplicationKey", async () => {
    await projectEditorialDomainEventToMarketingIntent({
      domainEvent: buildDomainEvent({
        storeId: "store_special",
      }),
    });

    expect(mockDb.marketingIntent.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        deduplicationKey: expect.stringContaining("store_special"),
      }),
    });
  });

  it("n'injecte pas body complet dans contextJson", async () => {
    const openIntent = buildMarketingIntent({
      id: "intent_open",
      lastSourceDomainEventId: "evt_published",
      contextJson: {
        sourceEventType: "content.blog_post.published",
        lastEventType: "content.blog_post.published",
        publicationCycleKey: "2026-07-09T08:00:00.000Z",
      },
    });
    mockDb.marketingIntent.findMany.mockResolvedValue([openIntent]);

    await projectEditorialDomainEventToMarketingIntent({
      domainEvent: buildDomainEvent({
        id: "evt_3",
        eventType: "content.blog_post.updated_visible",
        payloadJson: JSON.stringify({
          postId: "post_1",
          slug: "article-1",
          title: "Article retitré",
          body: "<p>Corps complet</p>",
          changedFields: ["body"],
          publishedAt: "2026-07-09T08:00:00.000Z",
        }),
      }),
    });

    expect(mockDb.marketingIntent.update).toHaveBeenCalledWith({
      where: { id: "intent_open" },
      data: expect.objectContaining({
        contextJson: expect.not.objectContaining({
          body: expect.anything(),
        }),
      }),
    });
  });

  it("ignore proprement un eventType inconnu", async () => {
    const result = await projectEditorialDomainEventToMarketingIntent({
      domainEvent: buildDomainEvent({
        eventType: "content.unknown.changed",
      }),
    });

    expect(result).toMatchObject({
      status: "ignored",
      reason: "UNSUPPORTED_EVENT_TYPE",
    });
    expect(mockDb.marketingIntent.create).not.toHaveBeenCalled();
  });
});
