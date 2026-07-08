import { beforeEach, describe, expect, it, vi } from "vitest";
import { HomepageStatus } from "@/prisma-generated/client";

const { mockWithTransaction, mockRecordDomainEvent } = vi.hoisted(() => ({
  mockWithTransaction: vi.fn(),
  mockRecordDomainEvent: vi.fn(),
}));

vi.mock("@/core/db", () => ({
  withTransaction: mockWithTransaction,
}));

vi.mock("@/features/domain-events", () => ({
  recordDomainEvent: mockRecordDomainEvent,
}));

import { publishAdminHomepage } from "@/features/admin/homepage/services/publish-admin-homepage.service";

const PUBLISHED_AT = new Date("2026-07-08T13:00:00.000Z");

type PublishTx = {
  store: {
    findFirst: ReturnType<typeof vi.fn>;
  };
  homepage: {
    findFirst: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
  };
};

function runWithTx(tx: PublishTx) {
  mockWithTransaction.mockImplementation(async (callback: (input: PublishTx) => Promise<unknown>) => {
    return callback(tx);
  });
}

describe("publishAdminHomepage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("enregistre content.homepage.published avec une clé idempotente stable", async () => {
    const tx: PublishTx = {
      store: {
        findFirst: vi.fn().mockResolvedValue({
          id: "store_1",
        }),
      },
      homepage: {
        findFirst: vi.fn().mockResolvedValue({
          id: "homepage_1",
          storeId: "store_1",
          title: "Accueil",
          status: HomepageStatus.DRAFT,
          publishedAt: null,
        }),
        update: vi.fn().mockResolvedValue({
          id: "homepage_1",
          title: "Accueil",
          status: HomepageStatus.ACTIVE,
          publishedAt: PUBLISHED_AT,
        }),
      },
    };

    runWithTx(tx);

    const result = await publishAdminHomepage({
      id: "homepage_1",
    });

    expect(result).toEqual({
      id: "homepage_1",
    });
    expect(mockRecordDomainEvent).toHaveBeenCalledWith({
      executor: tx,
      storeId: "store_1",
      eventType: "content.homepage.published",
      aggregateType: "HOMEPAGE",
      aggregateId: "homepage_1",
      idempotencyKey: "homepage:homepage_1:published:2026-07-08T13:00:00.000Z",
      payload: {
        homepageId: "homepage_1",
        title: "Accueil",
        previousStatus: HomepageStatus.DRAFT,
        nextStatus: HomepageStatus.ACTIVE,
        publishedAt: "2026-07-08T13:00:00.000Z",
      },
    });
  });
});
