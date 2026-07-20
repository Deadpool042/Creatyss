import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/core/db", () => ({
  db: {
    job: {
      findFirst: vi.fn(),
      updateMany: vi.fn(),
      update: vi.fn(),
    },
    webhookDelivery: {
      findFirst: vi.fn(),
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

vi.mock("@/core/runtime/resolve-store-execution-policy", () => ({
  resolveStoreExecutionPolicy: vi.fn(),
}));

vi.mock("@/features/webhooks/services/deliver-webhook.service", () => ({
  deliverWebhook: vi.fn(),
}));

vi.mock("@/features/webhooks/services/simulate-webhook-delivery.service", () => ({
  simulateWebhookDelivery: vi.fn(),
}));

import { db } from "@/core/db";
import { resolveStoreExecutionPolicy } from "@/core/runtime/resolve-store-execution-policy";
import { deliverWebhook } from "@/features/webhooks/services/deliver-webhook.service";
import { simulateWebhookDelivery } from "@/features/webhooks/services/simulate-webhook-delivery.service";
import {
  executeWebhookDeliveryJob,
  ExecuteWebhookDeliveryJobError,
} from "@/features/webhooks/services/execute-webhook-delivery-job.service";
import { WEBHOOK_DELIVERY_JOB_TYPE } from "@/features/webhooks/shared/webhook-job.constants";

const mockDb = db as unknown as {
  job: {
    findFirst: ReturnType<typeof vi.fn>;
    updateMany: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
  };
  webhookDelivery: {
    findFirst: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
  };
  webhookEndpoint: {
    update: ReturnType<typeof vi.fn>;
  };
  store: {
    findFirst: ReturnType<typeof vi.fn>;
  };
};
const mockDeliverWebhook = deliverWebhook as ReturnType<typeof vi.fn>;
const mockSimulateWebhookDelivery = simulateWebhookDelivery as ReturnType<typeof vi.fn>;
const mockResolveStoreExecutionPolicy = resolveStoreExecutionPolicy as ReturnType<typeof vi.fn>;

const JOB_ID = "job_1";
const STORE_ID = "store_1";
const DELIVERY_ID = "delivery_1";
const ENDPOINT_ID = "we_1";

function baseJob(
  overrides: Partial<{ status: string; scheduledAt: Date | null; subjectId: string | null }> = {}
) {
  return {
    id: JOB_ID,
    status: "PENDING",
    scheduledAt: null,
    subjectId: DELIVERY_ID,
    ...overrides,
  };
}

function activeEndpoint(overrides: Record<string, unknown> = {}) {
  return {
    id: ENDPOINT_ID,
    secretHash: "whs_secret",
    timeoutMs: 5000,
    isEnabled: true,
    status: "ACTIVE",
    archivedAt: null,
    ...overrides,
  };
}

function baseDelivery(overrides: Record<string, unknown> = {}) {
  return {
    id: DELIVERY_ID,
    eventType: "order.created",
    requestUrl: "https://example.test/webhook",
    requestBodyJson: JSON.stringify({ orderId: "order_1" }),
    webhookEndpoint: activeEndpoint(),
    ...overrides,
  };
}

describe("executeWebhookDeliveryJob", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDb.job.updateMany.mockResolvedValue({ count: 1 });
    mockDb.job.update.mockResolvedValue({});
    mockDb.webhookDelivery.update.mockResolvedValue({});
    mockDb.webhookEndpoint.update.mockResolvedValue({});
    mockDb.store.findFirst.mockResolvedValue({ isProduction: true });
    mockResolveStoreExecutionPolicy.mockReturnValue({ mode: "LIVE" });
  });

  it("lève job_not_found si le job n'existe pas", async () => {
    mockDb.job.findFirst.mockResolvedValue(null);

    await expect(
      executeWebhookDeliveryJob({ jobId: JOB_ID, storeId: STORE_ID })
    ).rejects.toMatchObject({
      code: "job_not_found",
    });
    expect(mockDb.job.findFirst).toHaveBeenCalledWith({
      where: {
        id: JOB_ID,
        storeId: STORE_ID,
        typeCode: WEBHOOK_DELIVERY_JOB_TYPE,
        archivedAt: null,
      },
      select: { id: true, status: true, scheduledAt: true, subjectId: true },
    });
  });

  it("lève job_not_pending si le job n'est pas PENDING", async () => {
    mockDb.job.findFirst.mockResolvedValue(baseJob({ status: "RUNNING" }));

    await expect(
      executeWebhookDeliveryJob({ jobId: JOB_ID, storeId: STORE_ID })
    ).rejects.toMatchObject({
      code: "job_not_pending",
    });
  });

  it("lève job_not_due si scheduledAt est dans le futur", async () => {
    mockDb.job.findFirst.mockResolvedValue(baseJob({ scheduledAt: new Date(Date.now() + 60_000) }));

    await expect(
      executeWebhookDeliveryJob({ jobId: JOB_ID, storeId: STORE_ID })
    ).rejects.toMatchObject({
      code: "job_not_due",
    });
  });

  it("lève missing_subject_id si le job n'a pas de subjectId", async () => {
    mockDb.job.findFirst.mockResolvedValue(baseJob({ subjectId: null }));

    await expect(
      executeWebhookDeliveryJob({ jobId: JOB_ID, storeId: STORE_ID })
    ).rejects.toMatchObject({
      code: "missing_subject_id",
    });
  });

  it("lève job_already_claimed si le claim atomique échoue (count !== 1)", async () => {
    mockDb.job.findFirst.mockResolvedValue(baseJob());
    mockDb.job.updateMany.mockResolvedValue({ count: 0 });

    await expect(
      executeWebhookDeliveryJob({ jobId: JOB_ID, storeId: STORE_ID })
    ).rejects.toMatchObject({
      code: "job_already_claimed",
    });
    expect(mockDb.webhookDelivery.findFirst).not.toHaveBeenCalled();
  });

  it("effectue le claim atomique PENDING→RUNNING avec incrément d'attemptCount", async () => {
    mockDb.job.findFirst.mockResolvedValue(baseJob());
    mockDb.webhookDelivery.findFirst.mockResolvedValue(baseDelivery());
    mockDeliverWebhook.mockResolvedValue({
      ok: true,
      statusCode: 200,
      responseBody: "ok",
      errorCode: null,
      errorMessage: null,
    });

    await executeWebhookDeliveryJob({ jobId: JOB_ID, storeId: STORE_ID });

    expect(mockDb.job.updateMany).toHaveBeenCalledWith({
      where: {
        id: JOB_ID,
        storeId: STORE_ID,
        status: "PENDING",
        archivedAt: null,
      },
      data: {
        status: "RUNNING",
        startedAt: expect.any(Date),
        errorCode: null,
        errorMessage: null,
        attemptCount: { increment: 1 },
      },
    });
  });

  it("annule la livraison (CANCELLED) et le job si l'endpoint est désactivé", async () => {
    mockDb.job.findFirst.mockResolvedValue(baseJob());
    mockDb.webhookDelivery.findFirst.mockResolvedValue(
      baseDelivery({ webhookEndpoint: activeEndpoint({ isEnabled: false }) })
    );

    await executeWebhookDeliveryJob({ jobId: JOB_ID, storeId: STORE_ID });

    expect(mockDb.webhookDelivery.update).toHaveBeenCalledWith({
      where: { id: DELIVERY_ID },
      data: {
        status: "CANCELLED",
        finishedAt: expect.any(Date),
        errorCode: "endpoint_inactive",
        errorMessage: expect.any(String),
      },
    });
    expect(mockDb.job.update).toHaveBeenCalledWith({
      where: { id: JOB_ID },
      data: {
        status: "CANCELLED",
        finishedAt: expect.any(Date),
        errorCode: "endpoint_inactive",
        errorMessage: expect.any(String),
      },
    });
    expect(mockDeliverWebhook).not.toHaveBeenCalled();
  });

  it("annule la livraison si l'endpoint est archivé", async () => {
    mockDb.job.findFirst.mockResolvedValue(baseJob());
    mockDb.webhookDelivery.findFirst.mockResolvedValue(
      baseDelivery({ webhookEndpoint: activeEndpoint({ archivedAt: new Date() }) })
    );

    await executeWebhookDeliveryJob({ jobId: JOB_ID, storeId: STORE_ID });

    expect(mockDb.webhookDelivery.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ status: "CANCELLED" }) })
    );
    expect(mockDeliverWebhook).not.toHaveBeenCalled();
  });

  it("annule la livraison si l'endpoint n'est pas ACTIVE", async () => {
    mockDb.job.findFirst.mockResolvedValue(baseJob());
    mockDb.webhookDelivery.findFirst.mockResolvedValue(
      baseDelivery({ webhookEndpoint: activeEndpoint({ status: "PAUSED" }) })
    );

    await executeWebhookDeliveryJob({ jobId: JOB_ID, storeId: STORE_ID });

    expect(mockDb.webhookDelivery.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ status: "CANCELLED" }) })
    );
    expect(mockDeliverWebhook).not.toHaveBeenCalled();
  });

  it("utilise le timeout par défaut de 10s quand endpoint.timeoutMs est null", async () => {
    mockDb.job.findFirst.mockResolvedValue(baseJob());
    mockDb.webhookDelivery.findFirst.mockResolvedValue(
      baseDelivery({ webhookEndpoint: activeEndpoint({ timeoutMs: null }) })
    );
    mockDeliverWebhook.mockResolvedValue({
      ok: true,
      statusCode: 200,
      responseBody: "ok",
      errorCode: null,
      errorMessage: null,
    });

    await executeWebhookDeliveryJob({ jobId: JOB_ID, storeId: STORE_ID });

    expect(mockDeliverWebhook).toHaveBeenCalledWith(expect.objectContaining({ timeoutMs: 10_000 }));
  });

  it("utilise le timeoutMs de l'endpoint s'il est défini", async () => {
    mockDb.job.findFirst.mockResolvedValue(baseJob());
    mockDb.webhookDelivery.findFirst.mockResolvedValue(
      baseDelivery({ webhookEndpoint: activeEndpoint({ timeoutMs: 7000 }) })
    );
    mockDeliverWebhook.mockResolvedValue({
      ok: true,
      statusCode: 200,
      responseBody: "ok",
      errorCode: null,
      errorMessage: null,
    });

    await executeWebhookDeliveryJob({ jobId: JOB_ID, storeId: STORE_ID });

    expect(mockDeliverWebhook).toHaveBeenCalledWith(expect.objectContaining({ timeoutMs: 7000 }));
  });

  it("succès : marque la livraison SUCCEEDED, met à jour lastSucceededAt et termine le job SUCCEEDED", async () => {
    mockDb.job.findFirst.mockResolvedValue(baseJob());
    mockDb.webhookDelivery.findFirst.mockResolvedValue(baseDelivery());
    mockDeliverWebhook.mockResolvedValue({
      ok: true,
      statusCode: 200,
      responseBody: "accepted",
      errorCode: null,
      errorMessage: null,
    });

    await executeWebhookDeliveryJob({ jobId: JOB_ID, storeId: STORE_ID });

    expect(mockDb.webhookDelivery.update).toHaveBeenCalledWith({
      where: { id: DELIVERY_ID },
      data: {
        status: "SUCCEEDED",
        finishedAt: expect.any(Date),
        responseStatusCode: 200,
        responseBodyText: "accepted",
        errorCode: null,
        errorMessage: null,
      },
    });
    expect(mockDb.webhookEndpoint.update).toHaveBeenCalledWith({
      where: { id: ENDPOINT_ID },
      data: {
        lastTriggeredAt: expect.any(Date),
        lastSucceededAt: expect.any(Date),
      },
    });
    expect(mockDb.job.update).toHaveBeenCalledWith({
      where: { id: JOB_ID },
      data: expect.objectContaining({ status: "SUCCEEDED" }),
    });
  });

  it("échec : marque la livraison FAILED, met à jour lastFailedAt et termine le job FAILED", async () => {
    mockDb.job.findFirst.mockResolvedValue(baseJob());
    mockDb.webhookDelivery.findFirst.mockResolvedValue(baseDelivery());
    mockDeliverWebhook.mockResolvedValue({
      ok: false,
      statusCode: 500,
      responseBody: "boom",
      errorCode: "HTTP_ERROR",
      errorMessage: "HTTP 500",
    });

    await expect(
      executeWebhookDeliveryJob({ jobId: JOB_ID, storeId: STORE_ID })
    ).rejects.toMatchObject({
      code: "HTTP_ERROR",
    });

    expect(mockDb.webhookDelivery.update).toHaveBeenCalledWith({
      where: { id: DELIVERY_ID },
      data: {
        status: "FAILED",
        finishedAt: expect.any(Date),
        responseStatusCode: 500,
        responseBodyText: "boom",
        errorCode: "HTTP_ERROR",
        errorMessage: "HTTP 500",
      },
    });
    expect(mockDb.webhookEndpoint.update).toHaveBeenCalledWith({
      where: { id: ENDPOINT_ID },
      data: {
        lastTriggeredAt: expect.any(Date),
        lastFailedAt: expect.any(Date),
      },
    });
    expect(mockDb.job.update).toHaveBeenCalledWith({
      where: { id: JOB_ID },
      data: expect.objectContaining({ status: "FAILED", errorCode: "HTTP_ERROR" }),
    });
  });

  it("lève delivery_not_found si la livraison n'est plus PENDING/FAILED", async () => {
    mockDb.job.findFirst.mockResolvedValue(baseJob());
    mockDb.webhookDelivery.findFirst.mockResolvedValue(null);

    await expect(
      executeWebhookDeliveryJob({ jobId: JOB_ID, storeId: STORE_ID })
    ).rejects.toMatchObject({
      code: "delivery_not_found",
    });
    expect(mockDb.job.update).toHaveBeenCalledWith({
      where: { id: JOB_ID },
      data: expect.objectContaining({ status: "FAILED", errorCode: "delivery_not_found" }),
    });
  });

  it("lève invalid_request_body si requestBodyJson n'est pas un JSON valide", async () => {
    mockDb.job.findFirst.mockResolvedValue(baseJob());
    mockDb.webhookDelivery.findFirst.mockResolvedValue(
      baseDelivery({ requestBodyJson: "not-json" })
    );

    await expect(
      executeWebhookDeliveryJob({ jobId: JOB_ID, storeId: STORE_ID })
    ).rejects.toMatchObject({
      code: "invalid_request_body",
    });
    expect(mockDeliverWebhook).not.toHaveBeenCalled();
  });

  it("propage l'instance ExecuteWebhookDeliveryJobError pour un échec de livraison", async () => {
    mockDb.job.findFirst.mockResolvedValue(baseJob());
    mockDb.webhookDelivery.findFirst.mockResolvedValue(baseDelivery());
    mockDeliverWebhook.mockResolvedValue({
      ok: false,
      statusCode: null,
      responseBody: null,
      errorCode: "TIMEOUT",
      errorMessage: "délai dépassé",
    });

    await expect(
      executeWebhookDeliveryJob({ jobId: JOB_ID, storeId: STORE_ID })
    ).rejects.toBeInstanceOf(ExecuteWebhookDeliveryJobError);
  });

  it("mode LIVE : appelle deliverWebhook et jamais simulateWebhookDelivery", async () => {
    mockDb.job.findFirst.mockResolvedValue(baseJob());
    mockDb.webhookDelivery.findFirst.mockResolvedValue(baseDelivery());
    mockResolveStoreExecutionPolicy.mockReturnValue({ mode: "LIVE" });
    mockDeliverWebhook.mockResolvedValue({
      ok: true,
      statusCode: 200,
      responseBody: "ok",
      errorCode: null,
      errorMessage: null,
    });

    await executeWebhookDeliveryJob({ jobId: JOB_ID, storeId: STORE_ID });

    expect(mockDeliverWebhook).toHaveBeenCalledTimes(1);
    expect(mockSimulateWebhookDelivery).not.toHaveBeenCalled();
  });

  it("mode TEST : appelle simulateWebhookDelivery et jamais deliverWebhook, aucune requête HTTP", async () => {
    mockDb.job.findFirst.mockResolvedValue(baseJob());
    mockDb.webhookDelivery.findFirst.mockResolvedValue(baseDelivery());
    mockResolveStoreExecutionPolicy.mockReturnValue({ mode: "TEST" });
    mockSimulateWebhookDelivery.mockResolvedValue({
      ok: true,
      statusCode: null,
      responseBody: "Livraison simulée (mode TEST)",
      errorCode: null,
      errorMessage: null,
    });

    await executeWebhookDeliveryJob({ jobId: JOB_ID, storeId: STORE_ID });

    expect(mockSimulateWebhookDelivery).toHaveBeenCalledTimes(1);
    expect(mockDeliverWebhook).not.toHaveBeenCalled();
  });

  it("mode TEST : conserve le cycle SUCCEEDED normal (WebhookDelivery + Job), aucun retry déclenché", async () => {
    mockDb.job.findFirst.mockResolvedValue(baseJob());
    mockDb.webhookDelivery.findFirst.mockResolvedValue(baseDelivery());
    mockResolveStoreExecutionPolicy.mockReturnValue({ mode: "TEST" });
    mockSimulateWebhookDelivery.mockResolvedValue({
      ok: true,
      statusCode: null,
      responseBody: "Livraison simulée (mode TEST)",
      errorCode: null,
      errorMessage: null,
    });

    await executeWebhookDeliveryJob({ jobId: JOB_ID, storeId: STORE_ID });

    expect(mockDb.webhookDelivery.update).toHaveBeenCalledWith({
      where: { id: DELIVERY_ID },
      data: {
        status: "SUCCEEDED",
        finishedAt: expect.any(Date),
        responseStatusCode: null,
        responseBodyText: "Livraison simulée (mode TEST)",
        errorCode: null,
        errorMessage: null,
      },
    });
    expect(mockDb.job.update).toHaveBeenCalledWith({
      where: { id: JOB_ID },
      data: expect.objectContaining({ status: "SUCCEEDED" }),
    });
  });

  it("mode TEST : utilise store.isProduction=false pour résoudre la policy hors LIVE", async () => {
    mockDb.job.findFirst.mockResolvedValue(baseJob());
    mockDb.webhookDelivery.findFirst.mockResolvedValue(baseDelivery());
    mockDb.store.findFirst.mockResolvedValue({ isProduction: false });
    mockResolveStoreExecutionPolicy.mockReturnValue({ mode: "TEST" });
    mockSimulateWebhookDelivery.mockResolvedValue({
      ok: true,
      statusCode: null,
      responseBody: "Livraison simulée (mode TEST)",
      errorCode: null,
      errorMessage: null,
    });

    await executeWebhookDeliveryJob({ jobId: JOB_ID, storeId: STORE_ID });

    expect(mockResolveStoreExecutionPolicy).toHaveBeenCalledWith({ isProduction: false });
  });
});
