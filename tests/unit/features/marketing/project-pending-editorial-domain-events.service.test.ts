import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/core/db", () => ({
  db: {
    domainEvent: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock(
  "@/features/marketing/editorial-intents/project-editorial-domain-event-to-marketing-intent.service",
  () => ({
    EDITORIAL_MARKETING_INTENT_CONSUMER_CODE: "editorial_marketing_intent",
    projectEditorialDomainEventToMarketingIntent: vi.fn(),
  })
);

import type { DomainEvent } from "@/prisma-generated/client";
import { db } from "@/core/db";
import { projectEditorialDomainEventToMarketingIntent } from "@/features/marketing/editorial-intents/project-editorial-domain-event-to-marketing-intent.service";
import { EDITORIAL_MARKETING_EVENT_TYPES } from "@/features/marketing/editorial-intents/resolve-editorial-marketing-intent-policy";
import { projectPendingEditorialDomainEvents } from "@/features/marketing/editorial-intents/project-pending-editorial-domain-events.service";

const mockDb = db as unknown as {
  domainEvent: {
    findMany: ReturnType<typeof vi.fn>;
  };
};

const mockProjectEditorialDomainEventToMarketingIntent =
  projectEditorialDomainEventToMarketingIntent as ReturnType<typeof vi.fn>;

const NOW = new Date("2026-07-18T08:00:00.000Z");

function buildDomainEvent(overrides: Partial<DomainEvent> = {}): DomainEvent {
  return {
    id: "evt_1",
    storeId: "store_1",
    eventType: "content.blog_post.published",
    eventVersion: 1,
    aggregateType: "BLOG_POST",
    aggregateId: "post_1",
    status: "PENDING",
    idempotencyKey: "blog-post:post_1:published:2026-07-18T08:00:00.000Z",
    payloadJson: JSON.stringify({ postId: "post_1" }),
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
  } as DomainEvent;
}

describe("projectPendingEditorialDomainEvents", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDb.domainEvent.findMany.mockResolvedValue([]);
  });

  it("interroge les DomainEvents en attente avec le filtre, l'ordre et la taille de lot attendus", async () => {
    await projectPendingEditorialDomainEvents();

    expect(mockDb.domainEvent.findMany).toHaveBeenCalledWith({
      where: {
        eventType: { in: [...EDITORIAL_MARKETING_EVENT_TYPES] },
        deliveries: {
          none: {
            consumerCode: "editorial_marketing_intent",
            status: "PUBLISHED",
          },
        },
      },
      orderBy: [{ occurredAt: "asc" }, { createdAt: "asc" }],
      take: 50,
    });
  });

  it("respecte le batchSize fourni en entrée", async () => {
    await projectPendingEditorialDomainEvents({ batchSize: 10 });

    expect(mockDb.domainEvent.findMany).toHaveBeenCalledWith(expect.objectContaining({ take: 10 }));
  });

  it("ne projette rien et renvoie un résumé à zéro quand aucun événement n'est en attente", async () => {
    mockDb.domainEvent.findMany.mockResolvedValue([]);

    const result = await projectPendingEditorialDomainEvents();

    expect(mockProjectEditorialDomainEventToMarketingIntent).not.toHaveBeenCalled();
    expect(result).toEqual({
      scanned: 0,
      created: 0,
      merged: 0,
      deduplicated: 0,
      ignored: 0,
      skipped: 0,
      failed: 0,
    });
  });

  it("projette chaque événement retourné avec l'événement exact", async () => {
    const eventA = buildDomainEvent({ id: "evt_a" });
    const eventB = buildDomainEvent({ id: "evt_b" });
    mockDb.domainEvent.findMany.mockResolvedValue([eventA, eventB]);
    mockProjectEditorialDomainEventToMarketingIntent.mockResolvedValue({
      status: "created",
    });

    await projectPendingEditorialDomainEvents();

    expect(mockProjectEditorialDomainEventToMarketingIntent).toHaveBeenCalledTimes(2);
    expect(mockProjectEditorialDomainEventToMarketingIntent).toHaveBeenNthCalledWith(1, {
      domainEvent: eventA,
    });
    expect(mockProjectEditorialDomainEventToMarketingIntent).toHaveBeenNthCalledWith(2, {
      domainEvent: eventB,
    });
  });

  it("agrège plusieurs événements en cumulant chaque statut dans le résumé", async () => {
    mockDb.domainEvent.findMany.mockResolvedValue([
      buildDomainEvent({ id: "evt_created" }),
      buildDomainEvent({ id: "evt_merged" }),
      buildDomainEvent({ id: "evt_deduplicated" }),
      buildDomainEvent({ id: "evt_ignored" }),
      buildDomainEvent({ id: "evt_pending_delivery" }),
    ]);
    mockProjectEditorialDomainEventToMarketingIntent
      .mockResolvedValueOnce({ status: "created" })
      .mockResolvedValueOnce({ status: "merged" })
      .mockResolvedValueOnce({ status: "deduplicated" })
      .mockResolvedValueOnce({ status: "ignored" })
      .mockResolvedValueOnce({ status: "pending_delivery" });

    const result = await projectPendingEditorialDomainEvents();

    expect(result).toEqual({
      scanned: 5,
      created: 1,
      merged: 1,
      deduplicated: 1,
      ignored: 1,
      skipped: 1,
      failed: 0,
    });
  });

  it("compte dans skipped tout statut de projection non explicitement mappé (already_processed, pending_delivery, skipped_terminal_delivery)", async () => {
    mockDb.domainEvent.findMany.mockResolvedValue([
      buildDomainEvent({ id: "evt_already" }),
      buildDomainEvent({ id: "evt_pending" }),
      buildDomainEvent({ id: "evt_terminal" }),
    ]);
    mockProjectEditorialDomainEventToMarketingIntent
      .mockResolvedValueOnce({ status: "already_processed" })
      .mockResolvedValueOnce({ status: "pending_delivery" })
      .mockResolvedValueOnce({ status: "skipped_terminal_delivery" });

    const result = await projectPendingEditorialDomainEvents();

    expect(result).toMatchObject({ scanned: 3, skipped: 3, failed: 0 });
  });

  it("incrémente failed et poursuit le traitement des événements suivants quand une projection échoue", async () => {
    mockDb.domainEvent.findMany.mockResolvedValue([
      buildDomainEvent({ id: "evt_fail" }),
      buildDomainEvent({ id: "evt_ok" }),
    ]);
    mockProjectEditorialDomainEventToMarketingIntent
      .mockRejectedValueOnce(new Error("projection crash"))
      .mockResolvedValueOnce({ status: "created" });

    const result = await projectPendingEditorialDomainEvents();

    expect(mockProjectEditorialDomainEventToMarketingIntent).toHaveBeenCalledTimes(2);
    expect(result).toEqual({
      scanned: 2,
      created: 1,
      merged: 0,
      deduplicated: 0,
      ignored: 0,
      skipped: 0,
      failed: 1,
    });
  });

  it("ne propage pas l'erreur d'une projection en échec", async () => {
    mockDb.domainEvent.findMany.mockResolvedValue([buildDomainEvent({ id: "evt_fail" })]);
    mockProjectEditorialDomainEventToMarketingIntent.mockRejectedValue(
      new Error("projection crash")
    );

    await expect(projectPendingEditorialDomainEvents()).resolves.toMatchObject({
      scanned: 1,
      failed: 1,
    });
  });
});
