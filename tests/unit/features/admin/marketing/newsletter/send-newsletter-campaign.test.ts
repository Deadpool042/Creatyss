import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/core/db", () => ({
  db: {
    newsletterCampaign: {
      findUnique: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
    },
    newsletterSubscriber: {
      findMany: vi.fn(),
    },
    newsletterCampaignRecipient: {
      createMany: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
    },
    store: {
      findFirst: vi.fn(),
    },
  },
}));

vi.mock("@/core/config/env/server", () => ({
  serverEnv: { appUrl: "https://boutique.test", appRuntimeEnv: "local" },
}));

vi.mock("@/core/auth/admin/guard", () => ({
  requireAuthenticatedAdmin: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/features/admin/store/queries/get-current-store-id.query", () => ({
  getCurrentStoreId: vi.fn(),
}));

vi.mock("@/features/email/providers/resolve-email-provider", () => ({
  resolveEmailProvider: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import { db } from "@/core/db";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { resolveEmailProvider } from "@/features/email/providers/resolve-email-provider";
import { sendNewsletterCampaignAction } from "@/features/admin/marketing/newsletter/actions/send-newsletter-campaign.action";
import {
  buildNewsletterEmailHtml,
  buildNewsletterEmailText,
} from "@/features/admin/marketing/newsletter/lib/build-newsletter-email-content";

const mockDb = db as unknown as {
  newsletterCampaign: {
    findUnique: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    updateMany: ReturnType<typeof vi.fn>;
  };
  newsletterSubscriber: { findMany: ReturnType<typeof vi.fn> };
  newsletterCampaignRecipient: {
    createMany: ReturnType<typeof vi.fn>;
    findMany: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
  };
  store: { findFirst: ReturnType<typeof vi.fn> };
};

const mockGetCurrentStoreId = getCurrentStoreId as ReturnType<typeof vi.fn>;
const mockResolveEmailProvider = resolveEmailProvider as ReturnType<typeof vi.fn>;

const STORE_ID = "store_1";
const CAMPAIGN_ID = "campaign_1";

const draftCampaign = {
  id: CAMPAIGN_ID,
  storeId: STORE_ID,
  status: "DRAFT",
  subjectLine: "Nouveautés de l'atelier",
  bodyHtml: "<p>Bonjour</p>",
  bodyText: "Bonjour",
};

function mockSendSuccess() {
  const sendTransactionalEmail = vi.fn().mockResolvedValue(undefined);
  mockResolveEmailProvider.mockReturnValue({
    kind: "mailpit",
    provider: { sendTransactionalEmail },
  });
  return sendTransactionalEmail;
}

describe("buildNewsletterEmailContent", () => {
  it("injecte le lien de désinscription dans le HTML", () => {
    const html = buildNewsletterEmailHtml("<p>Contenu</p>", "https://x.test/unsub");
    expect(html).toContain("<p>Contenu</p>");
    expect(html).toContain('href="https://x.test/unsub"');
    expect(html.toLowerCase()).toContain("désabonner");
  });

  it("injecte le lien de désinscription dans le texte", () => {
    const text = buildNewsletterEmailText("Contenu", "https://x.test/unsub");
    expect(text).toContain("Contenu");
    expect(text).toContain("https://x.test/unsub");
  });
});

describe("sendNewsletterCampaignAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetCurrentStoreId.mockResolvedValue(STORE_ID);
    mockDb.store.findFirst.mockResolvedValue({ isProduction: false });
  });

  it("refuse une campagne appartenant à un autre store", async () => {
    mockDb.newsletterCampaign.findUnique.mockResolvedValue({
      ...draftCampaign,
      storeId: "autre_store",
    });

    const result = await sendNewsletterCampaignAction(CAMPAIGN_ID);

    expect(result).toEqual({ ok: false, error: "Campagne introuvable." });
    expect(mockDb.newsletterCampaign.updateMany).not.toHaveBeenCalled();
  });

  it("refuse une campagne déjà envoyée", async () => {
    mockDb.newsletterCampaign.findUnique.mockResolvedValue({
      ...draftCampaign,
      status: "SENT",
    });

    const result = await sendNewsletterCampaignAction(CAMPAIGN_ID);

    expect(result.ok).toBe(false);
    expect(mockDb.newsletterSubscriber.findMany).not.toHaveBeenCalled();
  });

  it("refuse si le verrou atomique est déjà pris (envoi concurrent)", async () => {
    mockDb.newsletterCampaign.findUnique.mockResolvedValue(draftCampaign);
    mockDb.newsletterCampaign.updateMany.mockResolvedValue({ count: 0 });

    const result = await sendNewsletterCampaignAction(CAMPAIGN_ID);

    expect(result).toEqual({ ok: false, error: "La campagne est déjà en cours d'envoi." });
    expect(mockDb.newsletterSubscriber.findMany).not.toHaveBeenCalled();
  });

  it("ne cible que les abonnés SUBSCRIBED du store", async () => {
    mockDb.newsletterCampaign.findUnique.mockResolvedValue(draftCampaign);
    mockDb.newsletterCampaign.updateMany.mockResolvedValue({ count: 1 });
    mockDb.newsletterSubscriber.findMany.mockResolvedValue([]);
    mockDb.newsletterCampaign.update.mockResolvedValue({});

    await sendNewsletterCampaignAction(CAMPAIGN_ID);

    expect(mockDb.newsletterSubscriber.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { storeId: STORE_ID, status: "SUBSCRIBED" },
      })
    );
  });

  it("envoie l'email avec lien de désinscription et trace sentAt par recipient", async () => {
    mockDb.newsletterCampaign.findUnique.mockResolvedValue(draftCampaign);
    mockDb.newsletterCampaign.updateMany.mockResolvedValue({ count: 1 });
    mockDb.newsletterSubscriber.findMany.mockResolvedValue([{ id: "sub_1", email: "a@test.fr" }]);
    mockDb.newsletterCampaignRecipient.createMany.mockResolvedValue({ count: 1 });
    mockDb.newsletterCampaignRecipient.findMany.mockResolvedValue([
      { id: "rec_1", email: "a@test.fr", newsletterSubscriberId: "sub_1" },
    ]);
    mockDb.newsletterCampaignRecipient.update.mockResolvedValue({});
    mockDb.newsletterCampaign.update.mockResolvedValue({});
    const sendTransactionalEmail = mockSendSuccess();

    const result = await sendNewsletterCampaignAction(CAMPAIGN_ID);

    expect(result).toEqual({ ok: true, sentCount: 1, failedCount: 0 });
    expect(sendTransactionalEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "a@test.fr",
        html: expect.stringContaining("/api/newsletter/unsubscribe?token="),
        text: expect.stringContaining("/api/newsletter/unsubscribe?token="),
      })
    );
    expect(mockDb.newsletterCampaignRecipient.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "rec_1" },
        data: { sentAt: expect.any(Date) },
      })
    );
    expect(mockDb.newsletterCampaign.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: "SENT" }),
      })
    );
  });

  it("ne renvoie pas aux recipients déjà envoyés (idempotence)", async () => {
    mockDb.newsletterCampaign.findUnique.mockResolvedValue(draftCampaign);
    mockDb.newsletterCampaign.updateMany.mockResolvedValue({ count: 1 });
    mockDb.newsletterSubscriber.findMany.mockResolvedValue([{ id: "sub_1", email: "a@test.fr" }]);
    mockDb.newsletterCampaignRecipient.createMany.mockResolvedValue({ count: 0 });
    mockDb.newsletterCampaignRecipient.findMany.mockResolvedValue([]);
    mockDb.newsletterCampaign.update.mockResolvedValue({});
    const sendTransactionalEmail = mockSendSuccess();

    const result = await sendNewsletterCampaignAction(CAMPAIGN_ID);

    expect(mockDb.newsletterCampaignRecipient.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ sentAt: null }),
      })
    );
    expect(sendTransactionalEmail).not.toHaveBeenCalled();
    expect(result).toEqual({ ok: true, sentCount: 0, failedCount: 0 });
  });

  it("passe la campagne en FAILED si tous les envois échouent", async () => {
    mockDb.newsletterCampaign.findUnique.mockResolvedValue(draftCampaign);
    mockDb.newsletterCampaign.updateMany.mockResolvedValue({ count: 1 });
    mockDb.newsletterSubscriber.findMany.mockResolvedValue([{ id: "sub_1", email: "a@test.fr" }]);
    mockDb.newsletterCampaignRecipient.createMany.mockResolvedValue({ count: 1 });
    mockDb.newsletterCampaignRecipient.findMany.mockResolvedValue([
      { id: "rec_1", email: "a@test.fr", newsletterSubscriberId: "sub_1" },
    ]);
    mockDb.newsletterCampaignRecipient.update.mockResolvedValue({});
    mockDb.newsletterCampaign.update.mockResolvedValue({});
    mockResolveEmailProvider.mockReturnValue({
      kind: "mailpit",
      provider: {
        sendTransactionalEmail: vi.fn().mockRejectedValue(new Error("provider down")),
      },
    });

    const result = await sendNewsletterCampaignAction(CAMPAIGN_ID);

    expect(result).toEqual({ ok: true, sentCount: 0, failedCount: 1 });
    expect(mockDb.newsletterCampaignRecipient.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          failedAt: expect.any(Date),
          errorMessage: "provider down",
        }),
      })
    );
    expect(mockDb.newsletterCampaign.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: "FAILED" }),
      })
    );
  });
});
