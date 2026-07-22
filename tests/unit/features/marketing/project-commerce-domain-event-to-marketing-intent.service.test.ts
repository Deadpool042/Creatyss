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
      async (callback: (tx: typeof mockTx) => Promise<unknown>): Promise<unknown> =>
        callback(mockTx)
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
  COMMERCE_MARKETING_INTENT_CONSUMER_CODE,
  projectCommerceDomainEventToMarketingIntent,
} from "@/features/marketing/commerce-intents/project-commerce-domain-event-to-marketing-intent.service";

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

const NOW = new Date("2026-07-22T08:00:00.000Z");

function buildDomainEvent(overrides: Partial<DomainEvent> = {}): DomainEvent {
  return {
    id: "evt_market_1",
    storeId: "store_1",
    eventType: "market.created",
    eventVersion: 1,
    aggregateType: "public_event",
    aggregateId: "public_event_1",
    status: DomainEventStatus.PENDING,
    idempotencyKey: "public-event:public_event_1:created",
    payloadJson: JSON.stringify({
      publicEventId: "public_event_1",
      slug: "marche-de-noel",
      title: "Marché de Noël",
      startsAt: "2026-12-06T09:00:00.000Z",
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

function buildDelivery(overrides: Partial<DomainEventDelivery> = {}): DomainEventDelivery {
  return {
    id: "delivery_1",
    domainEventId: "evt_market_1",
    consumerCode: COMMERCE_MARKETING_INTENT_CONSUMER_CODE,
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

function buildMarketingIntent(overrides: Partial<MarketingIntent> = {}): MarketingIntent {
  return {
    id: "intent_1",
    storeId: "store_1",
    status: MarketingIntentStatus.PROPOSED,
    intentType: MarketingIntentType.PROMOTE_COMMERCE_EVENT,
    subjectType: MarketingIntentSubjectType.PUBLIC_EVENT,
    subjectId: "public_event_1",
    suggestedChannels: [MarketingIntentChannel.NEWSLETTER, MarketingIntentChannel.SOCIAL],
    deduplicationKey:
      "marketing-intent:store_1:PROMOTE_COMMERCE_EVENT:PUBLIC_EVENT:public_event_1:cycle:2026-12-06T09:00:00.000Z",
    sourceDomainEventId: "evt_market_1",
    lastSourceDomainEventId: "evt_market_1",
    contextJson: {
      sourceEventType: "market.created",
      lastEventType: "market.created",
      publicationCycleKey: "2026-12-06T09:00:00.000Z",
    },
    reviewedAt: null,
    reviewedByUserId: null,
    createdAt: NOW,
    updatedAt: NOW,
    ...overrides,
  };
}

describe("projectCommerceDomainEventToMarketingIntent", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockDb.domainEventDelivery.findUnique.mockResolvedValue(null);
    mockDb.domainEventDelivery.create.mockResolvedValue(
      buildDelivery({
        id: "delivery_pending",
        status: DomainEventStatus.PENDING,
        deliveredAt: null,
      })
    );
    mockDb.domainEventDelivery.update.mockImplementation(
      async ({ data }: { data: Record<string, unknown> }) =>
        buildDelivery({
          id: "delivery_pending",
          status: data.status as DomainEventStatus,
          deliveredAt: data.deliveredAt instanceof Date ? data.deliveredAt : NOW,
        })
    );
    mockDb.marketingIntent.findUnique.mockResolvedValue(null);
    mockDb.marketingIntent.findMany.mockResolvedValue([]);
    mockDb.marketingIntent.count.mockResolvedValue(0);
    mockDb.marketingIntent.create.mockResolvedValue(buildMarketingIntent());
    mockDb.marketingIntent.update.mockResolvedValue(buildMarketingIntent());

    mockTx.marketingIntent.findUnique.mockImplementation(mockDb.marketingIntent.findUnique);
    mockTx.marketingIntent.findMany.mockImplementation(mockDb.marketingIntent.findMany);
    mockTx.marketingIntent.count.mockImplementation(mockDb.marketingIntent.count);
    mockTx.marketingIntent.create.mockImplementation(mockDb.marketingIntent.create);
    mockTx.marketingIntent.update.mockImplementation(mockDb.marketingIntent.update);
    mockTx.domainEventDelivery.update.mockImplementation(mockDb.domainEventDelivery.update);
  });

  it("crée un MarketingIntent PROPOSED PUBLIC_EVENT pour market.created", async () => {
    const marketingIntent = buildMarketingIntent();
    mockDb.marketingIntent.create.mockResolvedValue(marketingIntent);

    const result = await projectCommerceDomainEventToMarketingIntent({
      domainEvent: buildDomainEvent(),
    });

    expect(result.status).toBe("created");
    expect(result.marketingIntent).toEqual(marketingIntent);
    expect(mockDb.marketingIntent.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        status: MarketingIntentStatus.PROPOSED,
        intentType: MarketingIntentType.PROMOTE_COMMERCE_EVENT,
        subjectType: MarketingIntentSubjectType.PUBLIC_EVENT,
        subjectId: "public_event_1",
        suggestedChannels: [MarketingIntentChannel.NEWSLETTER, MarketingIntentChannel.SOCIAL],
      }),
    });
  });

  it("ignore market.cancelled sans créer ni fusionner d'intent", async () => {
    const result = await projectCommerceDomainEventToMarketingIntent({
      domainEvent: buildDomainEvent({
        id: "evt_market_cancelled",
        eventType: "market.cancelled",
      }),
    });

    expect(result).toMatchObject({
      status: "ignored",
      reason: "MARKET_CANCELLED",
    });
    expect(mockDb.marketingIntent.create).not.toHaveBeenCalled();
    expect(mockDb.marketingIntent.update).not.toHaveBeenCalled();
  });

  it("rejoue le même DomainEvent sans créer un second MarketingIntent (idempotence via DomainEventDelivery)", async () => {
    const existingDelivery = buildDelivery();
    mockDb.domainEventDelivery.findUnique.mockResolvedValue(existingDelivery);

    const result = await projectCommerceDomainEventToMarketingIntent({
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

  it("déduplique via MarketingIntent.deduplicationKey si un intent existe déjà pour ce cycle", async () => {
    const existingIntent = buildMarketingIntent();
    mockDb.marketingIntent.findUnique.mockResolvedValue(existingIntent);

    const result = await projectCommerceDomainEventToMarketingIntent({
      domainEvent: buildDomainEvent(),
    });

    expect(result).toMatchObject({
      status: "deduplicated",
      marketingIntent: existingIntent,
    });
    expect(mockDb.marketingIntent.create).not.toHaveBeenCalled();
  });

  it("utilise le consumerCode dédié marketing-intents.commerce.v1, distinct de l'éditorial", async () => {
    await projectCommerceDomainEventToMarketingIntent({
      domainEvent: buildDomainEvent(),
    });

    expect(mockDb.domainEventDelivery.create).toHaveBeenCalledWith({
      data: {
        domainEventId: "evt_market_1",
        consumerCode: COMMERCE_MARKETING_INTENT_CONSUMER_CODE,
        status: "PENDING",
        attemptCount: 1,
      },
    });
    expect(COMMERCE_MARKETING_INTENT_CONSUMER_CODE).toBe("marketing-intents.commerce.v1");
  });
});
