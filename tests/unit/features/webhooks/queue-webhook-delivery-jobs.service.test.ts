import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/feature-flags/queries/get-feature-level-state.query", () => ({
  meetsFeatureLevel: vi.fn(),
}));

import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";
import { queueWebhookDeliveryJobs } from "@/features/webhooks/services/queue-webhook-delivery-jobs.service";
import { WEBHOOK_DELIVERY_JOB_TYPE } from "@/features/webhooks/shared/webhook-job.constants";

const mockMeetsFeatureLevel = meetsFeatureLevel as ReturnType<typeof vi.fn>;

const STORE_ID = "store_1";
const EVENT_TYPE = "order.created";
const EVENT_ID = "evt_1";
const OCCURRED_AT = new Date("2026-07-05T10:00:00.000Z");
const EVENT_BODY = { orderId: "order_1" };

type MockEndpoint = { id: string; targetUrl: string; maxAttempts: number };

function buildMockTx(endpoints: MockEndpoint[], options: { existingJobIds?: string[] } = {}) {
  const existingJobIds = new Set(options.existingJobIds ?? []);

  return {
    webhookEndpoint: {
      findMany: vi.fn().mockResolvedValue(endpoints),
    },
    job: {
      findUnique: vi.fn().mockImplementation(({ where }: { where: { idempotencyKey: string } }) => {
        const endpointId = where.idempotencyKey.split(":")[1];
        return Promise.resolve(existingJobIds.has(endpointId) ? { id: `job_${endpointId}` } : null);
      }),
      create: vi.fn().mockResolvedValue({}),
    },
    webhookDelivery: {
      create: vi.fn().mockResolvedValue({ id: "delivery_1" }),
    },
  };
}

describe("queueWebhookDeliveryJobs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMeetsFeatureLevel.mockResolvedValue(true);
  });

  it("retourne 0 sans interroger les endpoints si la feature webhooks est inactive", async () => {
    mockMeetsFeatureLevel.mockResolvedValue(false);
    const tx = buildMockTx([]);

    const result = await queueWebhookDeliveryJobs(tx as never, {
      storeId: STORE_ID,
      eventType: EVENT_TYPE,
      eventId: EVENT_ID,
      occurredAt: OCCURRED_AT,
      eventBody: EVENT_BODY,
    });

    expect(result).toBe(0);
    expect(tx.webhookEndpoint.findMany).not.toHaveBeenCalled();
  });

  it("vérifie le feature flag avec le bon niveau et storeId", async () => {
    const tx = buildMockTx([]);

    await queueWebhookDeliveryJobs(tx as never, {
      storeId: "store_xyz",
      eventType: EVENT_TYPE,
      eventId: EVENT_ID,
      occurredAt: OCCURRED_AT,
      eventBody: EVENT_BODY,
    });

    expect(mockMeetsFeatureLevel).toHaveBeenCalledWith("platform.webhooks", "retry", {
      storeId: "store_xyz",
    });
  });

  it("retourne 0 si aucun endpoint actif n'écoute cet eventType", async () => {
    const tx = buildMockTx([]);

    const result = await queueWebhookDeliveryJobs(tx as never, {
      storeId: STORE_ID,
      eventType: EVENT_TYPE,
      eventId: EVENT_ID,
      occurredAt: OCCURRED_AT,
      eventBody: EVENT_BODY,
    });

    expect(result).toBe(0);
    expect(tx.webhookEndpoint.findMany).toHaveBeenCalledWith({
      where: {
        storeId: STORE_ID,
        status: "ACTIVE",
        isEnabled: true,
        eventType: EVENT_TYPE,
        archivedAt: null,
      },
      select: { id: true, targetUrl: true, maxAttempts: true },
    });
    expect(tx.webhookDelivery.create).not.toHaveBeenCalled();
    expect(tx.job.create).not.toHaveBeenCalled();
  });

  it("crée une WebhookDelivery PENDING et un Job par endpoint actif", async () => {
    const endpoint: MockEndpoint = {
      id: "we_1",
      targetUrl: "https://example.test/webhook",
      maxAttempts: 5,
    };
    const tx = buildMockTx([endpoint]);

    const result = await queueWebhookDeliveryJobs(tx as never, {
      storeId: STORE_ID,
      eventType: EVENT_TYPE,
      eventId: EVENT_ID,
      occurredAt: OCCURRED_AT,
      eventBody: EVENT_BODY,
    });

    expect(result).toBe(1);
    expect(tx.webhookDelivery.create).toHaveBeenCalledOnce();

    const deliveryArgs = tx.webhookDelivery.create.mock.calls[0][0];
    expect(deliveryArgs.data.webhookEndpointId).toBe(endpoint.id);
    expect(deliveryArgs.data.status).toBe("PENDING");
    expect(deliveryArgs.data.eventType).toBe(EVENT_TYPE);
    expect(deliveryArgs.data.eventId).toBe(EVENT_ID);
    expect(deliveryArgs.data.requestUrl).toBe(endpoint.targetUrl);
    expect(deliveryArgs.data.requestMethod).toBe("POST");
    expect(deliveryArgs.data.requestBodyJson).toBe(JSON.stringify(EVENT_BODY));
    expect(deliveryArgs.data.scheduledAt).toBe(OCCURRED_AT);
    expect(deliveryArgs.data.idempotencyKey).toBe(
      `webhook:${endpoint.id}:${EVENT_TYPE}:${EVENT_ID}`
    );

    expect(tx.job.create).toHaveBeenCalledOnce();
    const jobArgs = tx.job.create.mock.calls[0][0];
    expect(jobArgs.data.storeId).toBe(STORE_ID);
    expect(jobArgs.data.typeCode).toBe(WEBHOOK_DELIVERY_JOB_TYPE);
    expect(jobArgs.data.status).toBe("PENDING");
    expect(jobArgs.data.subjectId).toBe("delivery_1");
    expect(jobArgs.data.idempotencyKey).toBe(`webhook:${endpoint.id}:${EVENT_TYPE}:${EVENT_ID}`);
    expect(jobArgs.data.deduplicationKey).toBe(`webhook:${endpoint.id}:${EVENT_TYPE}:${EVENT_ID}`);
    expect(jobArgs.data.maxAttempts).toBe(endpoint.maxAttempts);
    expect(jobArgs.data.attemptCount).toBe(0);

    const payload = JSON.parse(jobArgs.data.payloadJson);
    expect(payload.deliveryId).toBe("delivery_1");
    expect(payload.webhookEndpointId).toBe(endpoint.id);
    expect(payload.eventType).toBe(EVENT_TYPE);
    expect(payload.eventId).toBe(EVENT_ID);
  });

  it("déduplique par idempotencyKey : ne recrée pas un job déjà existant pour l'endpoint", async () => {
    const endpoint: MockEndpoint = {
      id: "we_1",
      targetUrl: "https://example.test/webhook",
      maxAttempts: 5,
    };
    const tx = buildMockTx([endpoint], { existingJobIds: ["we_1"] });

    const result = await queueWebhookDeliveryJobs(tx as never, {
      storeId: STORE_ID,
      eventType: EVENT_TYPE,
      eventId: EVENT_ID,
      occurredAt: OCCURRED_AT,
      eventBody: EVENT_BODY,
    });

    expect(result).toBe(0);
    expect(tx.webhookDelivery.create).not.toHaveBeenCalled();
    expect(tx.job.create).not.toHaveBeenCalled();
  });

  it("traite indépendamment plusieurs endpoints : un déjà enqueué, un nouveau", async () => {
    const endpoints: MockEndpoint[] = [
      { id: "we_1", targetUrl: "https://a.test/hook", maxAttempts: 3 },
      { id: "we_2", targetUrl: "https://b.test/hook", maxAttempts: 3 },
    ];
    const tx = buildMockTx(endpoints, { existingJobIds: ["we_1"] });

    const result = await queueWebhookDeliveryJobs(tx as never, {
      storeId: STORE_ID,
      eventType: EVENT_TYPE,
      eventId: EVENT_ID,
      occurredAt: OCCURRED_AT,
      eventBody: EVENT_BODY,
    });

    expect(result).toBe(1);
    expect(tx.webhookDelivery.create).toHaveBeenCalledOnce();
    expect(tx.job.create).toHaveBeenCalledOnce();
    const deliveryArgs = tx.webhookDelivery.create.mock.calls[0][0];
    expect(deliveryArgs.data.webhookEndpointId).toBe("we_2");
  });
});
