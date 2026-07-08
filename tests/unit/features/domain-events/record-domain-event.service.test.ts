import { beforeEach, describe, expect, it, vi } from "vitest";
import type { DomainEvent } from "@/prisma-generated/client";

vi.mock("@/core/db", () => ({
  db: {
    domainEvent: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

import { db } from "@/core/db";
import { recordDomainEvent } from "@/features/domain-events";

const mockDb = db as unknown as {
  domainEvent: {
    findUnique: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
  };
};

const NOW = new Date("2026-07-08T09:00:00.000Z");

function buildDomainEvent(overrides: Partial<DomainEvent> = {}): DomainEvent {
  return {
    id: "evt_1",
    storeId: "store_1",
    eventType: "content.blog_post.published",
    eventVersion: 1,
    aggregateType: "BLOG_POST",
    aggregateId: "post_1",
    status: "PENDING",
    idempotencyKey: "content:blog-post:post_1:published",
    payloadJson: JSON.stringify({ postId: "post_1", title: "Article" }),
    metadataJson: JSON.stringify({ actorUserId: "admin_1" }),
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

describe("recordDomainEvent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDb.domainEvent.findUnique.mockResolvedValue(null);
  });

  it("crée un événement durable avec payload et metadata sérialisés", async () => {
    const createdEvent = buildDomainEvent();
    mockDb.domainEvent.create.mockResolvedValue(createdEvent);

    const result = await recordDomainEvent({
      storeId: "store_1",
      eventType: "content.blog_post.published",
      aggregateType: "BLOG_POST",
      aggregateId: "post_1",
      idempotencyKey: "content:blog-post:post_1:published",
      payload: {
        postId: "post_1",
        title: "Article",
      },
      metadata: {
        actorUserId: "admin_1",
      },
      occurredAt: NOW,
    });

    expect(result).toEqual({
      event: createdEvent,
      created: true,
    });
    expect(mockDb.domainEvent.findUnique).toHaveBeenCalledWith({
      where: {
        idempotencyKey: "content:blog-post:post_1:published",
      },
    });
    expect(mockDb.domainEvent.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        storeId: "store_1",
        eventType: "content.blog_post.published",
        eventVersion: 1,
        aggregateType: "BLOG_POST",
        aggregateId: "post_1",
        status: "PENDING",
        idempotencyKey: "content:blog-post:post_1:published",
        payloadJson: JSON.stringify({
          postId: "post_1",
          title: "Article",
        }),
        metadataJson: JSON.stringify({
          actorUserId: "admin_1",
        }),
        occurredAt: NOW,
      }),
    });
  });

  it("retourne l'événement existant si la clé d'idempotence existe déjà", async () => {
    const existingEvent = buildDomainEvent();
    mockDb.domainEvent.findUnique.mockResolvedValue(existingEvent);

    const result = await recordDomainEvent({
      storeId: "store_1",
      eventType: "content.blog_post.published",
      aggregateType: "BLOG_POST",
      aggregateId: "post_1",
      idempotencyKey: "content:blog-post:post_1:published",
      payload: {
        postId: "post_1",
      },
    });

    expect(result).toEqual({
      event: existingEvent,
      created: false,
    });
    expect(mockDb.domainEvent.create).not.toHaveBeenCalled();
  });

  it("retourne l'événement existant après conflit d'unicité sur idempotencyKey", async () => {
    const existingEvent = buildDomainEvent();
    mockDb.domainEvent.create.mockRejectedValueOnce({ code: "P2002" });
    mockDb.domainEvent.findUnique
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(existingEvent);

    const result = await recordDomainEvent({
      storeId: "store_1",
      eventType: "content.blog_post.published",
      aggregateType: "BLOG_POST",
      aggregateId: "post_1",
      idempotencyKey: "content:blog-post:post_1:published",
      payload: {
        postId: "post_1",
      },
    });

    expect(result).toEqual({
      event: existingEvent,
      created: false,
    });
    expect(mockDb.domainEvent.create).toHaveBeenCalledTimes(1);
    expect(mockDb.domainEvent.findUnique).toHaveBeenCalledTimes(2);
  });

  it("supporte un executor transactionnel explicite", async () => {
    const createdEvent = buildDomainEvent({ id: "evt_tx" });
    const tx = {
      domainEvent: {
        findUnique: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue(createdEvent),
      },
    };

    const result = await recordDomainEvent({
      executor: tx as never,
      storeId: "store_1",
      eventType: "content.blog_post.published",
      aggregateType: "BLOG_POST",
      aggregateId: "post_1",
      idempotencyKey: "content:blog-post:post_1:published",
      payload: {
        postId: "post_1",
      },
    });

    expect(result).toEqual({
      event: createdEvent,
      created: true,
    });
    expect(tx.domainEvent.findUnique).toHaveBeenCalledOnce();
    expect(tx.domainEvent.create).toHaveBeenCalledOnce();
    expect(mockDb.domainEvent.create).not.toHaveBeenCalled();
  });
});
