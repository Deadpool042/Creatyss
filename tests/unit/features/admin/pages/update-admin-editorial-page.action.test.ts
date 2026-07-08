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
      findFirst: vi.fn(),
    },
    $transaction: vi.fn(async (callback: (tx: typeof mockTx) => Promise<unknown>) => {
      return callback(mockTx);
    }),
  },
}));

vi.mock("@/core/auth/admin/require-admin-capability", () => ({
  requireAdminCapability: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/features/admin/store/queries/get-current-store-id.query", () => ({
  getCurrentStoreId: vi.fn(),
}));

vi.mock("@/features/domain-events", () => ({
  recordDomainEvent: vi.fn(),
}));

import { db } from "@/core/db";
import { recordDomainEvent } from "@/features/domain-events";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { updateAdminEditorialPageAction } from "@/features/admin/pages/actions/update-admin-editorial-page.action";

const mockDb = db as unknown as {
  page: {
    findUnique: ReturnType<typeof vi.fn>;
    findFirst: ReturnType<typeof vi.fn>;
  };
};
const mockGetCurrentStoreId = getCurrentStoreId as ReturnType<typeof vi.fn>;
const mockRecordDomainEvent = recordDomainEvent as ReturnType<typeof vi.fn>;

function buildFormData(input: Readonly<{
  title: string;
  slug: string;
  excerpt: string;
  body: string;
}>): FormData {
  const formData = new FormData();
  formData.set("title", input.title);
  formData.set("slug", input.slug);
  formData.set("excerpt", input.excerpt);
  formData.set("body", input.body);
  return formData;
}

describe("updateAdminEditorialPageAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetCurrentStoreId.mockResolvedValue("store_1");
    mockDb.page.findFirst.mockResolvedValue(null);
  });

  it("émet content.editorial_page.updated pour une page ACTIVE modifiée visiblement", async () => {
    mockDb.page.findUnique.mockResolvedValue({
      id: "page_2",
      storeId: "store_1",
      title: "À propos",
      slug: "a-propos",
      status: PageStatus.ACTIVE,
      publishedAt: new Date("2026-07-08T14:30:00.000Z"),
      isSystemPage: false,
      shortDescription: "Résumé",
      body: "Ancien contenu",
      updatedAt: new Date("2026-07-08T14:30:00.000Z"),
    });
    mockTx.page.update.mockResolvedValue({
      id: "page_2",
      storeId: "store_1",
      title: "À propos de la marque",
      slug: "a-propos-creatyss",
      status: PageStatus.ACTIVE,
      publishedAt: new Date("2026-07-08T14:30:00.000Z"),
      isSystemPage: false,
      shortDescription: "Résumé enrichi",
      body: "Nouveau contenu",
      updatedAt: new Date("2026-07-08T15:30:00.000Z"),
    });

    const result = await updateAdminEditorialPageAction(
      "page_2",
      { status: "idle" },
      buildFormData({
        title: "À propos de la marque",
        slug: "a-propos-creatyss",
        excerpt: "Résumé enrichi",
        body: "Nouveau contenu",
      }),
    );

    expect(result).toEqual({
      status: "success",
      message: "Page enregistrée.",
    });
    expect(mockRecordDomainEvent).toHaveBeenCalledWith({
      executor: mockTx,
      storeId: "store_1",
      eventType: "content.editorial_page.updated",
      aggregateType: "PAGE",
      aggregateId: "page_2",
      idempotencyKey: "page:page_2:updated:2026-07-08T15:30:00.000Z",
      payload: {
        pageId: "page_2",
        slug: "a-propos-creatyss",
        title: "À propos de la marque",
        pageKind: "editorial",
        changedFields: ["title", "slug", "shortDescription", "body"],
        status: PageStatus.ACTIVE,
        updatedAt: "2026-07-08T15:30:00.000Z",
      },
    });
  });

  it("n'émet rien pour une page éditoriale brouillon", async () => {
    mockDb.page.findUnique.mockResolvedValue({
      id: "page_2",
      storeId: "store_1",
      title: "À propos",
      slug: "a-propos",
      status: PageStatus.DRAFT,
      publishedAt: null,
      isSystemPage: false,
      shortDescription: "Résumé",
      body: "Ancien contenu",
      updatedAt: new Date("2026-07-08T14:30:00.000Z"),
    });
    mockTx.page.update.mockResolvedValue({
      id: "page_2",
      storeId: "store_1",
      title: "À propos de la marque",
      slug: "a-propos-creatyss",
      status: PageStatus.DRAFT,
      publishedAt: null,
      isSystemPage: false,
      shortDescription: "Résumé enrichi",
      body: "Nouveau contenu",
      updatedAt: new Date("2026-07-08T15:30:00.000Z"),
    });

    await updateAdminEditorialPageAction(
      "page_2",
      { status: "idle" },
      buildFormData({
        title: "À propos de la marque",
        slug: "a-propos-creatyss",
        excerpt: "Résumé enrichi",
        body: "Nouveau contenu",
      }),
    );

    expect(mockRecordDomainEvent).not.toHaveBeenCalled();
  });

  it("n'émet rien si aucun champ visible ne change", async () => {
    mockDb.page.findUnique.mockResolvedValue({
      id: "page_2",
      storeId: "store_1",
      title: "À propos",
      slug: "a-propos",
      status: PageStatus.ACTIVE,
      publishedAt: new Date("2026-07-08T14:30:00.000Z"),
      isSystemPage: false,
      shortDescription: "Résumé",
      body: "Ancien contenu",
      updatedAt: new Date("2026-07-08T14:30:00.000Z"),
    });
    mockTx.page.update.mockResolvedValue({
      id: "page_2",
      storeId: "store_1",
      title: "À propos",
      slug: "a-propos",
      status: PageStatus.ACTIVE,
      publishedAt: new Date("2026-07-08T14:30:00.000Z"),
      isSystemPage: false,
      shortDescription: "Résumé",
      body: "Ancien contenu",
      updatedAt: new Date("2026-07-08T15:30:00.000Z"),
    });

    await updateAdminEditorialPageAction(
      "page_2",
      { status: "idle" },
      buildFormData({
        title: "À propos",
        slug: "a-propos",
        excerpt: "Résumé",
        body: "Ancien contenu",
      }),
    );

    expect(mockRecordDomainEvent).not.toHaveBeenCalled();
  });
});
