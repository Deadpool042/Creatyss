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
import { toggleAdminPageStatusAction } from "@/features/admin/pages/actions/toggle-admin-page-status.action";

const mockDb = db as unknown as {
  page: {
    findUnique: ReturnType<typeof vi.fn>;
  };
  $transaction: ReturnType<typeof vi.fn>;
};

const mockRecordDomainEvent = recordDomainEvent as ReturnType<typeof vi.fn>;

function createFormData(): FormData {
  return new FormData();
}

describe("toggleAdminPageStatusAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("émet content.legal_page.published sur DRAFT -> ACTIVE", async () => {
    const publishedAt = new Date("2026-07-08T14:00:00.000Z");

    mockDb.page.findUnique.mockResolvedValue({
      id: "page_1",
      storeId: "store_1",
      code: "terms-of-sale",
      title: "CGV",
      slug: "conditions-generales-de-vente",
      status: PageStatus.DRAFT,
      publishedAt: null,
      isSystemPage: true,
      body: "Contenu légal",
    });
    mockTx.page.update.mockResolvedValue({
      id: "page_1",
      storeId: "store_1",
      code: "terms-of-sale",
      title: "CGV",
      slug: "conditions-generales-de-vente",
      status: PageStatus.ACTIVE,
      publishedAt,
      isSystemPage: true,
    });

    const result = await toggleAdminPageStatusAction("page_1", { status: "idle" }, createFormData());

    expect(result).toEqual({
      status: "success",
      message: "Page publiée.",
    });
    expect(mockRecordDomainEvent).toHaveBeenCalledTimes(1);
    expect(mockRecordDomainEvent).toHaveBeenCalledWith({
      executor: mockTx,
      storeId: "store_1",
      eventType: "content.legal_page.published",
      aggregateType: "PAGE",
      aggregateId: "page_1",
      idempotencyKey: "page:page_1:published:2026-07-08T14:00:00.000Z",
      payload: {
        pageId: "page_1",
        slug: "conditions-generales-de-vente",
        title: "CGV",
        pageKind: "legal",
        previousStatus: PageStatus.DRAFT,
        nextStatus: PageStatus.ACTIVE,
        publishedAt: "2026-07-08T14:00:00.000Z",
      },
    });
  });

  it("émet content.legal_page.unpublished sur ACTIVE -> DRAFT", async () => {
    const publishedAt = new Date("2026-07-08T14:00:00.000Z");

    mockDb.page.findUnique.mockResolvedValue({
      id: "page_1",
      storeId: "store_1",
      code: "terms-of-sale",
      title: "CGV",
      slug: "conditions-generales-de-vente",
      status: PageStatus.ACTIVE,
      publishedAt,
      isSystemPage: true,
      body: "Contenu légal",
    });
    mockTx.page.update.mockResolvedValue({
      id: "page_1",
      storeId: "store_1",
      code: "terms-of-sale",
      title: "CGV",
      slug: "conditions-generales-de-vente",
      status: PageStatus.DRAFT,
      publishedAt: null,
      isSystemPage: true,
    });

    const result = await toggleAdminPageStatusAction("page_1", { status: "idle" }, createFormData());

    expect(result).toEqual({
      status: "success",
      message: "Page dépubliée.",
    });
    expect(mockRecordDomainEvent).toHaveBeenCalledTimes(1);
    expect(mockRecordDomainEvent).toHaveBeenCalledWith({
      executor: mockTx,
      storeId: "store_1",
      eventType: "content.legal_page.unpublished",
      aggregateType: "PAGE",
      aggregateId: "page_1",
      idempotencyKey: "page:page_1:unpublished:2026-07-08T14:00:00.000Z",
      payload: {
        pageId: "page_1",
        slug: "conditions-generales-de-vente",
        title: "CGV",
        pageKind: "legal",
        previousStatus: PageStatus.ACTIVE,
        nextStatus: PageStatus.DRAFT,
        publishedAt: "2026-07-08T14:00:00.000Z",
      },
    });
  });
});
