import { beforeEach, describe, expect, it, vi } from "vitest";
import { PageStatus } from "@/prisma-generated/client";

const mockTx = {
  page: {
    findUnique: vi.fn(),
    update: vi.fn(),
  },
};

vi.mock("@/core/db", () => ({
  db: {
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

vi.mock("@/features/domain-events", () => ({
  recordDomainEvent: vi.fn(),
}));

import { recordDomainEvent } from "@/features/domain-events";
import { updateAdminPageBodyAction } from "@/features/admin/pages/actions/update-admin-page-body.action";

const mockRecordDomainEvent = recordDomainEvent as ReturnType<typeof vi.fn>;

function buildFormData(body: string): FormData {
  const formData = new FormData();
  formData.set("body", body);
  return formData;
}

describe("updateAdminPageBodyAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("émet content.legal_page.updated pour une page système ACTIVE modifiée", async () => {
    mockTx.page.findUnique.mockResolvedValueOnce({
      id: "page_1",
      storeId: "store_1",
      code: "privacy-policy",
      title: "Politique de confidentialité",
      slug: "politique-confidentialite",
      status: PageStatus.ACTIVE,
      publishedAt: new Date("2026-07-08T14:00:00.000Z"),
      isSystemPage: true,
      shortDescription: null,
      body: "Ancien contenu",
      updatedAt: new Date("2026-07-08T14:00:00.000Z"),
    });
    mockTx.page.update.mockResolvedValue({
      id: "page_1",
      storeId: "store_1",
      code: "privacy-policy",
      title: "Politique de confidentialité",
      slug: "politique-confidentialite",
      status: PageStatus.ACTIVE,
      publishedAt: new Date("2026-07-08T14:00:00.000Z"),
      isSystemPage: true,
      shortDescription: null,
      body: "Nouveau contenu",
      updatedAt: new Date("2026-07-08T15:00:00.000Z"),
    });

    const result = await updateAdminPageBodyAction(
      "page_1",
      { status: "idle" },
      buildFormData("Nouveau contenu"),
    );

    expect(result).toEqual({
      status: "success",
      message: "Page enregistrée.",
    });
    expect(mockRecordDomainEvent).toHaveBeenCalledWith({
      executor: mockTx,
      storeId: "store_1",
      eventType: "content.legal_page.updated",
      aggregateType: "PAGE",
      aggregateId: "page_1",
      idempotencyKey: "page:page_1:updated:2026-07-08T15:00:00.000Z",
      payload: {
        pageId: "page_1",
        slug: "politique-confidentialite",
        title: "Politique de confidentialité",
        pageKind: "legal",
        changedFields: ["body"],
        status: PageStatus.ACTIVE,
        updatedAt: "2026-07-08T15:00:00.000Z",
      },
    });
  });

  it("n'émet rien pour une page système non publiée", async () => {
    mockTx.page.findUnique.mockResolvedValueOnce({
      id: "page_1",
      storeId: "store_1",
      code: "privacy-policy",
      title: "Politique de confidentialité",
      slug: "politique-confidentialite",
      status: PageStatus.DRAFT,
      publishedAt: null,
      isSystemPage: true,
      shortDescription: null,
      body: "Ancien contenu",
      updatedAt: new Date("2026-07-08T14:00:00.000Z"),
    });
    mockTx.page.update.mockResolvedValue({
      id: "page_1",
      storeId: "store_1",
      code: "privacy-policy",
      title: "Politique de confidentialité",
      slug: "politique-confidentialite",
      status: PageStatus.DRAFT,
      publishedAt: null,
      isSystemPage: true,
      shortDescription: null,
      body: "Nouveau contenu",
      updatedAt: new Date("2026-07-08T15:00:00.000Z"),
    });

    await updateAdminPageBodyAction("page_1", { status: "idle" }, buildFormData("Nouveau contenu"));

    expect(mockRecordDomainEvent).not.toHaveBeenCalled();
  });
});
