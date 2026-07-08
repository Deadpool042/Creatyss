import { beforeEach, describe, expect, it, vi } from "vitest";
import { PageStatus } from "@/prisma-generated/client";

const mockTx = {
  page: {
    update: vi.fn(),
  },
};

vi.mock("@/core/db", () => ({
  db: {
    page: {
      findUnique: vi.fn(),
    },
    $transaction: vi.fn(async (callback: (tx: typeof mockTx) => Promise<void>) => {
      await callback(mockTx);
    }),
  },
}));

vi.mock("@/core/auth/admin/require-admin-capability", () => ({
  requireAdminCapability: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/features/domain-events", () => ({
  recordDomainEvent: vi.fn(),
}));

import { db } from "@/core/db";
import { recordDomainEvent } from "@/features/domain-events";
import { toggleAdminEditorialPageStatusAction } from "@/features/admin/pages/actions/toggle-admin-editorial-page-status.action";

const mockDb = db as unknown as {
  page: {
    findUnique: ReturnType<typeof vi.fn>;
  };
};

const mockRecordDomainEvent = recordDomainEvent as ReturnType<typeof vi.fn>;

function createFormData(): FormData {
  return new FormData();
}

describe("toggleAdminEditorialPageStatusAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("émet content.editorial_page.published sur DRAFT -> ACTIVE", async () => {
    const publishedAt = new Date("2026-07-08T14:30:00.000Z");

    mockDb.page.findUnique.mockResolvedValue({
      id: "page_2",
      storeId: "store_1",
      title: "À propos",
      slug: "a-propos",
      status: PageStatus.DRAFT,
      publishedAt: null,
      isSystemPage: false,
      body: "Contenu éditorial",
    });
    mockTx.page.update.mockResolvedValue({
      id: "page_2",
      storeId: "store_1",
      title: "À propos",
      slug: "a-propos",
      status: PageStatus.ACTIVE,
      publishedAt,
      isSystemPage: false,
    });

    const result = await toggleAdminEditorialPageStatusAction(
      "page_2",
      { status: "idle" },
      createFormData(),
    );

    expect(result).toEqual({
      status: "success",
      message: "Page publiée.",
    });
    expect(mockRecordDomainEvent).toHaveBeenCalledTimes(1);
    expect(mockRecordDomainEvent).toHaveBeenCalledWith({
      executor: mockTx,
      storeId: "store_1",
      eventType: "content.editorial_page.published",
      aggregateType: "PAGE",
      aggregateId: "page_2",
      idempotencyKey: "page:page_2:published:2026-07-08T14:30:00.000Z",
      payload: {
        pageId: "page_2",
        slug: "a-propos",
        title: "À propos",
        pageKind: "editorial",
        previousStatus: PageStatus.DRAFT,
        nextStatus: PageStatus.ACTIVE,
        publishedAt: "2026-07-08T14:30:00.000Z",
      },
    });
  });

  it("émet content.editorial_page.unpublished sur ACTIVE -> DRAFT", async () => {
    const publishedAt = new Date("2026-07-08T14:30:00.000Z");

    mockDb.page.findUnique.mockResolvedValue({
      id: "page_2",
      storeId: "store_1",
      title: "À propos",
      slug: "a-propos",
      status: PageStatus.ACTIVE,
      publishedAt,
      isSystemPage: false,
      body: "Contenu éditorial",
    });
    mockTx.page.update.mockResolvedValue({
      id: "page_2",
      storeId: "store_1",
      title: "À propos",
      slug: "a-propos",
      status: PageStatus.DRAFT,
      publishedAt: null,
      isSystemPage: false,
    });

    const result = await toggleAdminEditorialPageStatusAction(
      "page_2",
      { status: "idle" },
      createFormData(),
    );

    expect(result).toEqual({
      status: "success",
      message: "Page dépubliée.",
    });
    expect(mockRecordDomainEvent).toHaveBeenCalledTimes(1);
    expect(mockRecordDomainEvent).toHaveBeenCalledWith({
      executor: mockTx,
      storeId: "store_1",
      eventType: "content.editorial_page.unpublished",
      aggregateType: "PAGE",
      aggregateId: "page_2",
      idempotencyKey: "page:page_2:unpublished:2026-07-08T14:30:00.000Z",
      payload: {
        pageId: "page_2",
        slug: "a-propos",
        title: "À propos",
        pageKind: "editorial",
        previousStatus: PageStatus.ACTIVE,
        nextStatus: PageStatus.DRAFT,
        publishedAt: "2026-07-08T14:30:00.000Z",
      },
    });
  });
});
