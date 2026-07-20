import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/core/db", () => ({
  db: {
    webhookDelivery: {
      findUnique: vi.fn(),
      updateMany: vi.fn(),
      update: vi.fn(),
    },
    webhookEndpoint: {
      update: vi.fn(),
    },
    store: {
      findFirst: vi.fn(),
    },
  },
}));

vi.mock("@/core/auth/admin/guard", () => ({
  requireAuthenticatedAdmin: vi.fn(),
}));

vi.mock("@/core/runtime/resolve-store-execution-policy", () => ({
  resolveStoreExecutionPolicy: vi.fn(),
}));

vi.mock("@/features/admin/store/queries/get-current-store-id.query", () => ({
  getCurrentStoreId: vi.fn(),
}));

vi.mock("@/features/feature-flags/queries/get-feature-level-state.query", () => ({
  meetsFeatureLevel: vi.fn(),
}));

vi.mock("@/features/webhooks/services/deliver-webhook.service", () => ({
  deliverWebhook: vi.fn(),
}));

vi.mock("@/features/webhooks/services/simulate-webhook-delivery.service", () => ({
  simulateWebhookDelivery: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import { db } from "@/core/db";
import { resolveStoreExecutionPolicy } from "@/core/runtime/resolve-store-execution-policy";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";
import { deliverWebhook } from "@/features/webhooks/services/deliver-webhook.service";
import { simulateWebhookDelivery } from "@/features/webhooks/services/simulate-webhook-delivery.service";
import { retryWebhookDeliveryAction } from "@/features/admin/settings/webhooks/actions/retry-webhook-delivery.action";

const mockDb = db as unknown as {
  webhookDelivery: {
    findUnique: ReturnType<typeof vi.fn>;
    updateMany: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
  };
  webhookEndpoint: {
    update: ReturnType<typeof vi.fn>;
  };
  store: {
    findFirst: ReturnType<typeof vi.fn>;
  };
};

const mockGetCurrentStoreId = getCurrentStoreId as ReturnType<typeof vi.fn>;
const mockMeetsFeatureLevel = meetsFeatureLevel as ReturnType<typeof vi.fn>;
const mockDeliverWebhook = deliverWebhook as ReturnType<typeof vi.fn>;
const mockSimulateWebhookDelivery = simulateWebhookDelivery as ReturnType<typeof vi.fn>;
const mockResolveStoreExecutionPolicy = resolveStoreExecutionPolicy as ReturnType<typeof vi.fn>;

const DELIVERY = {
  id: "delivery_1",
  status: "FAILED",
  eventType: "order.created",
  requestBodyJson: "{}",
  webhookEndpoint: {
    id: "endpoint_1",
    storeId: "store_1",
    targetUrl: "https://example.com/webhook",
    secretHash: "secret",
    timeoutMs: 5000,
    archivedAt: null,
  },
};

describe("retryWebhookDeliveryAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMeetsFeatureLevel.mockResolvedValue(true);
    mockGetCurrentStoreId.mockResolvedValue("store_1");
    mockDb.webhookDelivery.findUnique.mockResolvedValue(DELIVERY);
    mockDb.webhookDelivery.update.mockResolvedValue({});
    mockDb.webhookEndpoint.update.mockResolvedValue({});
    mockDb.store.findFirst.mockResolvedValue({ isProduction: true });
    mockResolveStoreExecutionPolicy.mockReturnValue({ mode: "LIVE" });
    mockDeliverWebhook.mockResolvedValue({
      ok: true,
      statusCode: 200,
      responseBody: "ok",
      errorCode: null,
      errorMessage: null,
    });
  });

  // A. Statut non relançable
  it("refuse la relance si le statut n'est pas relançable, sans POST ni finalisation", async () => {
    mockDb.webhookDelivery.findUnique.mockResolvedValue({ ...DELIVERY, status: "SUCCEEDED" });

    await expect(retryWebhookDeliveryAction("delivery_1")).resolves.toEqual({
      ok: false,
      error: "Cette delivery (statut SUCCEEDED) ne peut pas être relancée.",
    });

    expect(mockDb.webhookDelivery.updateMany).not.toHaveBeenCalled();
    expect(mockDeliverWebhook).not.toHaveBeenCalled();
    expect(mockDb.webhookDelivery.update).not.toHaveBeenCalled();
  });

  // B. Verrou atomique non acquis
  it("refuse la relance si le verrou atomique n'est pas acquis (count 0)", async () => {
    mockDb.webhookDelivery.updateMany.mockResolvedValue({ count: 0 });

    await expect(retryWebhookDeliveryAction("delivery_1")).resolves.toEqual({
      ok: false,
      error: "Cette delivery est déjà en cours de relance.",
    });

    expect(mockDeliverWebhook).not.toHaveBeenCalled();
    expect(mockDb.webhookDelivery.update).not.toHaveBeenCalled();
  });

  // C. Succès nominal
  it("relance avec succès : réserve, exécute, finalise la même delivery en SUCCEEDED", async () => {
    mockDb.webhookDelivery.updateMany.mockResolvedValue({ count: 1 });

    await expect(retryWebhookDeliveryAction("delivery_1")).resolves.toEqual({ ok: true });

    expect(mockDb.webhookDelivery.updateMany).toHaveBeenCalledWith({
      where: { id: "delivery_1", status: { in: ["FAILED", "EXPIRED", "CANCELLED"] } },
      data: {
        status: "RUNNING",
        startedAt: expect.any(Date),
        finishedAt: null,
        attemptCount: { increment: 1 },
        responseStatusCode: null,
        responseBodyText: null,
        errorCode: null,
        errorMessage: null,
      },
    });
    expect(mockDeliverWebhook).toHaveBeenCalledTimes(1);
    expect(mockDb.webhookDelivery.update).toHaveBeenCalledTimes(1);
    expect(mockDb.webhookDelivery.update).toHaveBeenCalledWith({
      where: { id: "delivery_1" },
      data: {
        status: "SUCCEEDED",
        finishedAt: expect.any(Date),
        responseStatusCode: 200,
        responseBodyText: "ok",
        errorCode: null,
        errorMessage: null,
      },
    });
    expect(mockDb.webhookEndpoint.update).toHaveBeenCalledWith({
      where: { id: "endpoint_1" },
      data: { lastTriggeredAt: expect.any(Date), lastSucceededAt: expect.any(Date) },
    });
  });

  // D. Réponse HTTP en échec
  it("finalise la même delivery en FAILED lorsque deliverWebhook retourne ok: false", async () => {
    mockDb.webhookDelivery.updateMany.mockResolvedValue({ count: 1 });
    mockDeliverWebhook.mockResolvedValue({
      ok: false,
      statusCode: 500,
      responseBody: "server error",
      errorCode: "HTTP_ERROR",
      errorMessage: "HTTP 500",
    });

    await expect(retryWebhookDeliveryAction("delivery_1")).resolves.toEqual({ ok: true });

    expect(mockDb.webhookDelivery.update).toHaveBeenCalledWith({
      where: { id: "delivery_1" },
      data: {
        status: "FAILED",
        finishedAt: expect.any(Date),
        responseStatusCode: 500,
        responseBodyText: "server error",
        errorCode: "HTTP_ERROR",
        errorMessage: "HTTP 500",
      },
    });
    expect(mockDb.webhookEndpoint.update).toHaveBeenCalledWith({
      where: { id: "endpoint_1" },
      data: { lastTriggeredAt: expect.any(Date), lastFailedAt: expect.any(Date) },
    });
  });

  // E. Deux appels strictement concurrents
  it("deux appels concurrents sur la même delivery : un seul atteint deliverWebhook et finalise", async () => {
    mockDb.webhookDelivery.updateMany
      .mockResolvedValueOnce({ count: 1 })
      .mockResolvedValueOnce({ count: 0 });

    const [first, second] = await Promise.all([
      retryWebhookDeliveryAction("delivery_1"),
      retryWebhookDeliveryAction("delivery_1"),
    ]);

    const results = [first, second];
    expect(results.filter((r) => r.ok)).toHaveLength(1);
    expect(results.filter((r) => !r.ok)).toEqual([
      { ok: false, error: "Cette delivery est déjà en cours de relance." },
    ]);
    expect(mockDeliverWebhook).toHaveBeenCalledTimes(1);
    expect(mockDb.webhookDelivery.update).toHaveBeenCalledTimes(1);
  });

  // F. Exception de deliverWebhook
  it("finalise en FAILED (pas de RUNNING résiduel) si deliverWebhook lève une exception", async () => {
    mockDb.webhookDelivery.updateMany.mockResolvedValue({ count: 1 });
    mockDeliverWebhook.mockRejectedValue(new Error("network down"));

    await expect(retryWebhookDeliveryAction("delivery_1")).resolves.toEqual({
      ok: false,
      error: "La relance du webhook a échoué.",
    });

    expect(mockDb.webhookDelivery.update).toHaveBeenCalledTimes(1);
    expect(mockDb.webhookDelivery.update).toHaveBeenCalledWith({
      where: { id: "delivery_1" },
      data: {
        status: "FAILED",
        finishedAt: expect.any(Date),
        errorCode: "retry_execution_failed",
        errorMessage: "network down",
      },
    });
    expect(mockDb.webhookEndpoint.update).not.toHaveBeenCalled();
  });

  // F-bis. Exception sur la lecture du store (résolution de policy) —
  // régression du commit 4e67b485 : la delivery ne doit jamais rester
  // bloquée en RUNNING si db.store.findFirst lève, même si elle n'a pas
  // de Job associé pour la recovery automatique.
  it("finalise en FAILED (pas de RUNNING résiduel) si db.store.findFirst lève une exception", async () => {
    mockDb.webhookDelivery.updateMany.mockResolvedValue({ count: 1 });
    mockDb.store.findFirst.mockRejectedValue(new Error("db unavailable"));

    await expect(retryWebhookDeliveryAction("delivery_1")).resolves.toEqual({
      ok: false,
      error: "La relance du webhook a échoué.",
    });

    expect(mockDb.webhookDelivery.update).toHaveBeenCalledTimes(1);
    expect(mockDb.webhookDelivery.update).toHaveBeenCalledWith({
      where: { id: "delivery_1" },
      data: {
        status: "FAILED",
        finishedAt: expect.any(Date),
        errorCode: "retry_execution_failed",
        errorMessage: "db unavailable",
      },
    });
    expect(mockDeliverWebhook).not.toHaveBeenCalled();
    expect(mockSimulateWebhookDelivery).not.toHaveBeenCalled();
    expect(mockDb.webhookEndpoint.update).not.toHaveBeenCalled();
  });

  it("borne le message d'exception à 500 caractères", async () => {
    mockDb.webhookDelivery.updateMany.mockResolvedValue({ count: 1 });
    mockDeliverWebhook.mockRejectedValue(new Error("x".repeat(1000)));

    await retryWebhookDeliveryAction("delivery_1");

    const call = mockDb.webhookDelivery.update.mock.calls[0][0];
    expect(call.data.errorMessage).toHaveLength(500);
  });

  // G. Échec de l'update final après un POST réussi — limite documentée,
  // pas une garantie inventée. Le POST HTTP et l'écriture PostgreSQL ne
  // peuvent pas être atomisés : si le POST a réussi et que cet update
  // échoue, l'action se comporte comme n'importe quel appel Prisma qui
  // échoue — elle propage l'erreur. Aucune trace durable du succès n'est
  // garantie dans ce cas, et un futur retry manuel repartira de l'état
  // réellement persisté en base (ici toujours RUNNING, donc non
  // retentable via le garde atomique tant qu'il n'est pas corrigé
  // manuellement) — ce risque résiduel n'est pas masqué ni compensé ici.
  it("documente le comportement lorsque le POST réussit mais que l'update final échoue", async () => {
    mockDb.webhookDelivery.updateMany.mockResolvedValue({ count: 1 });
    mockDeliverWebhook.mockResolvedValue({
      ok: true,
      statusCode: 200,
      responseBody: "ok",
      errorCode: null,
      errorMessage: null,
    });
    mockDb.webhookDelivery.update.mockRejectedValue(new Error("db unavailable"));

    await expect(retryWebhookDeliveryAction("delivery_1")).rejects.toThrow("db unavailable");

    // Le POST a bien eu lieu — aucune tentative de compensation locale.
    expect(mockDeliverWebhook).toHaveBeenCalledTimes(1);
    // L'action n'a pas mis à jour les timestamps de l'endpoint après l'échec de l'update.
    expect(mockDb.webhookEndpoint.update).not.toHaveBeenCalled();
  });

  // H. Mode LIVE
  it("mode LIVE : appelle deliverWebhook et jamais simulateWebhookDelivery", async () => {
    mockDb.webhookDelivery.updateMany.mockResolvedValue({ count: 1 });
    mockResolveStoreExecutionPolicy.mockReturnValue({ mode: "LIVE" });

    await expect(retryWebhookDeliveryAction("delivery_1")).resolves.toEqual({ ok: true });

    expect(mockDeliverWebhook).toHaveBeenCalledTimes(1);
    expect(mockSimulateWebhookDelivery).not.toHaveBeenCalled();
  });

  // I. Mode TEST
  it("mode TEST : appelle simulateWebhookDelivery et jamais deliverWebhook, aucune requête HTTP", async () => {
    mockDb.webhookDelivery.updateMany.mockResolvedValue({ count: 1 });
    mockResolveStoreExecutionPolicy.mockReturnValue({ mode: "TEST" });
    mockSimulateWebhookDelivery.mockResolvedValue({
      ok: true,
      statusCode: null,
      responseBody: "Livraison simulée (mode TEST)",
      errorCode: null,
      errorMessage: null,
    });

    await expect(retryWebhookDeliveryAction("delivery_1")).resolves.toEqual({ ok: true });

    expect(mockSimulateWebhookDelivery).toHaveBeenCalledTimes(1);
    expect(mockDeliverWebhook).not.toHaveBeenCalled();
  });

  // J. Mode TEST — conservation du cycle métier (réservation + finalisation SUCCEEDED)
  it("mode TEST : réserve la delivery (RUNNING) puis la finalise en SUCCEEDED, comme un succès réel", async () => {
    mockDb.webhookDelivery.updateMany.mockResolvedValue({ count: 1 });
    mockResolveStoreExecutionPolicy.mockReturnValue({ mode: "TEST" });
    mockSimulateWebhookDelivery.mockResolvedValue({
      ok: true,
      statusCode: null,
      responseBody: "Livraison simulée (mode TEST)",
      errorCode: null,
      errorMessage: null,
    });

    await retryWebhookDeliveryAction("delivery_1");

    expect(mockDb.webhookDelivery.updateMany).toHaveBeenCalledTimes(1);
    expect(mockDb.webhookDelivery.update).toHaveBeenCalledWith({
      where: { id: "delivery_1" },
      data: {
        status: "SUCCEEDED",
        finishedAt: expect.any(Date),
        responseStatusCode: null,
        responseBodyText: "Livraison simulée (mode TEST)",
        errorCode: null,
        errorMessage: null,
      },
    });
    expect(mockDb.webhookEndpoint.update).toHaveBeenCalledWith({
      where: { id: "endpoint_1" },
      data: { lastTriggeredAt: expect.any(Date), lastSucceededAt: expect.any(Date) },
    });
  });
});
