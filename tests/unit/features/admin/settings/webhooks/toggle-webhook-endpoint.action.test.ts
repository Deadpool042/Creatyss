import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/core/db", () => ({
  db: {
    webhookEndpoint: {
      findFirst: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock("@/core/auth/admin/guard", () => ({
  requireAuthenticatedAdmin: vi.fn(),
}));

vi.mock("@/features/admin/store/queries/get-current-store-id.query", () => ({
  getCurrentStoreId: vi.fn(),
}));

vi.mock("@/features/feature-flags/queries/get-feature-level-state.query", () => ({
  meetsFeatureLevel: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import { revalidatePath } from "next/cache";

import { db } from "@/core/db";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";
import { toggleWebhookEndpointAction } from "@/features/admin/settings/webhooks/actions/toggle-webhook-endpoint.action";

const mockDb = db as {
  webhookEndpoint: {
    findFirst: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
  };
};

const mockGetCurrentStoreId = getCurrentStoreId as ReturnType<typeof vi.fn>;
const mockMeetsFeatureLevel = meetsFeatureLevel as ReturnType<typeof vi.fn>;
const mockRevalidatePath = revalidatePath as ReturnType<typeof vi.fn>;

describe("toggleWebhookEndpointAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMeetsFeatureLevel.mockResolvedValue(true);
    mockGetCurrentStoreId.mockResolvedValue("store_1");
    mockDb.webhookEndpoint.findFirst.mockResolvedValue({
      id: "endpoint_1",
      status: "ACTIVE",
    });
    mockDb.webhookEndpoint.update.mockResolvedValue({
      id: "endpoint_1",
      status: "INACTIVE",
    });
  });

  it("refuse si le niveau webhooks n'est pas atteint", async () => {
    mockMeetsFeatureLevel.mockResolvedValue(false);

    await expect(toggleWebhookEndpointAction("endpoint_1")).resolves.toEqual({
      ok: false,
      error: "Niveau webhooks insuffisant pour modifier un endpoint.",
    });

    expect(mockDb.webhookEndpoint.findFirst).not.toHaveBeenCalled();
    expect(mockDb.webhookEndpoint.update).not.toHaveBeenCalled();
  });

  it("refuse si aucune boutique courante n'est trouvée", async () => {
    mockGetCurrentStoreId.mockResolvedValue(null);

    await expect(toggleWebhookEndpointAction("endpoint_1")).resolves.toEqual({
      ok: false,
      error: "Boutique introuvable.",
    });

    expect(mockDb.webhookEndpoint.findFirst).not.toHaveBeenCalled();
    expect(mockDb.webhookEndpoint.update).not.toHaveBeenCalled();
  });

  it("refuse si l'endpoint est introuvable", async () => {
    mockDb.webhookEndpoint.findFirst.mockResolvedValue(null);

    await expect(toggleWebhookEndpointAction("endpoint_1")).resolves.toEqual({
      ok: false,
      error: "Endpoint introuvable.",
    });

    expect(mockDb.webhookEndpoint.update).not.toHaveBeenCalled();
  });

  it("refuse si le statut est ARCHIVED", async () => {
    mockDb.webhookEndpoint.findFirst.mockResolvedValue({
      id: "endpoint_1",
      status: "ARCHIVED",
    });

    await expect(toggleWebhookEndpointAction("endpoint_1")).resolves.toEqual({
      ok: false,
      error: "L'endpoint ne peut pas être activé/désactivé dans son état actuel (ARCHIVED).",
    });

    expect(mockDb.webhookEndpoint.update).not.toHaveBeenCalled();
  });

  it("refuse si le statut est FAILED", async () => {
    mockDb.webhookEndpoint.findFirst.mockResolvedValue({
      id: "endpoint_1",
      status: "FAILED",
    });

    await expect(toggleWebhookEndpointAction("endpoint_1")).resolves.toEqual({
      ok: false,
      error: "L'endpoint ne peut pas être activé/désactivé dans son état actuel (FAILED).",
    });

    expect(mockDb.webhookEndpoint.update).not.toHaveBeenCalled();
  });

  it("bascule ACTIVE vers INACTIVE, synchronise isEnabled et invalide la page", async () => {
    mockDb.webhookEndpoint.findFirst.mockResolvedValue({
      id: "endpoint_1",
      status: "ACTIVE",
    });

    await expect(toggleWebhookEndpointAction("endpoint_1")).resolves.toEqual({ ok: true });

    expect(mockDb.webhookEndpoint.findFirst).toHaveBeenCalledWith({
      where: {
        id: "endpoint_1",
        OR: [{ storeId: "store_1" }, { storeId: null }],
        archivedAt: null,
      },
      select: { id: true, status: true },
    });
    expect(mockDb.webhookEndpoint.update).toHaveBeenCalledWith({
      where: { id: "endpoint_1" },
      data: { status: "INACTIVE", isEnabled: false },
    });
    expect(mockRevalidatePath).toHaveBeenCalledWith("/admin/settings/webhooks");
  });

  it("bascule DRAFT vers ACTIVE et synchronise isEnabled", async () => {
    mockDb.webhookEndpoint.findFirst.mockResolvedValue({
      id: "endpoint_1",
      status: "DRAFT",
    });

    await expect(toggleWebhookEndpointAction("endpoint_1")).resolves.toEqual({ ok: true });

    expect(mockDb.webhookEndpoint.update).toHaveBeenCalledWith({
      where: { id: "endpoint_1" },
      data: { status: "ACTIVE", isEnabled: true },
    });
    expect(mockDb.webhookEndpoint.update).toHaveBeenCalledTimes(1);
    expect(mockRevalidatePath).toHaveBeenCalledWith("/admin/settings/webhooks");
    expect(mockRevalidatePath).toHaveBeenCalledTimes(1);
  });

  it("bascule INACTIVE vers ACTIVE et synchronise isEnabled", async () => {
    mockDb.webhookEndpoint.findFirst.mockResolvedValue({
      id: "endpoint_1",
      status: "INACTIVE",
    });

    await expect(toggleWebhookEndpointAction("endpoint_1")).resolves.toEqual({ ok: true });

    expect(mockDb.webhookEndpoint.update).toHaveBeenCalledWith({
      where: { id: "endpoint_1" },
      data: { status: "ACTIVE", isEnabled: true },
    });
    expect(mockRevalidatePath).toHaveBeenCalledWith("/admin/settings/webhooks");
  });

  it("n'appelle revalidatePath que lorsque la mise à jour a réussi", async () => {
    mockDb.webhookEndpoint.findFirst.mockResolvedValue(null);

    await toggleWebhookEndpointAction("endpoint_1");

    expect(mockRevalidatePath).not.toHaveBeenCalled();
  });
});
