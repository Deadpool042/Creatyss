import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/feature-flags/queries/get-feature-level-state.query", () => ({
  meetsFeatureLevel: vi.fn(),
}));

import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";
import { queueOrderPlacedAutomationJobs } from "@/features/automations/services/queue-order-placed-automation-jobs.service";
import {
  AUTOMATION_ORDER_PLACED_JOB_TYPE,
  AUTOMATION_ORDER_PLACED_PAYLOAD_SCHEMA,
  AUTOMATION_ORDER_SUBJECT_TYPE,
} from "@/features/automations/shared/automation-job.constants";

const mockMeetsFeatureLevel = meetsFeatureLevel as ReturnType<typeof vi.fn>;

function buildMockTx(
  automations: {
    id: string;
    code: string;
    actionType: string;
    delayMinutes: number;
    templateCode: string | null;
  }[]
) {
  return {
    automation: {
      findMany: vi.fn().mockResolvedValue(automations),
    },
    job: {
      createMany: vi.fn().mockResolvedValue({ count: automations.length }),
    },
  };
}

const STORE_ID = "store_1";
const ORDER_ID = "order_1";
const OCCURRED_AT = new Date("2026-06-27T10:00:00.000Z");

describe("queueOrderPlacedAutomationJobs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMeetsFeatureLevel.mockResolvedValue(true);
  });

  it("retourne 0 si la feature automations est inactive", async () => {
    mockMeetsFeatureLevel.mockResolvedValue(false);
    const tx = buildMockTx([]);

    const result = await queueOrderPlacedAutomationJobs(tx as never, {
      storeId: STORE_ID,
      orderId: ORDER_ID,
      occurredAt: OCCURRED_AT,
    });

    expect(result).toBe(0);
    expect(tx.automation.findMany).not.toHaveBeenCalled();
    expect(tx.job.createMany).not.toHaveBeenCalled();
  });

  it("retourne 0 si aucune automation ORDER_PLACED n'est active", async () => {
    const tx = buildMockTx([]);

    const result = await queueOrderPlacedAutomationJobs(tx as never, {
      storeId: STORE_ID,
      orderId: ORDER_ID,
      occurredAt: OCCURRED_AT,
    });

    expect(result).toBe(0);
    expect(tx.automation.findMany).toHaveBeenCalledWith({
      where: {
        storeId: STORE_ID,
        status: "ACTIVE",
        triggerType: "ORDER_PLACED",
        archivedAt: null,
      },
      select: {
        id: true,
        code: true,
        actionType: true,
        delayMinutes: true,
        templateCode: true,
      },
    });
    expect(tx.job.createMany).not.toHaveBeenCalled();
  });

  it("crée un job par automation active et retourne le compte", async () => {
    const automation = {
      id: "auto_1",
      code: "welcome-order",
      actionType: "EMAIL_MESSAGE",
      delayMinutes: 0,
      templateCode: "order-welcome",
    };
    const tx = buildMockTx([automation]);

    const result = await queueOrderPlacedAutomationJobs(tx as never, {
      storeId: STORE_ID,
      orderId: ORDER_ID,
      occurredAt: OCCURRED_AT,
    });

    expect(result).toBe(1);
    expect(tx.job.createMany).toHaveBeenCalledOnce();

    const callArgs = tx.job.createMany.mock.calls[0][0];
    const job = callArgs.data[0];

    expect(job.storeId).toBe(STORE_ID);
    expect(job.typeCode).toBe(AUTOMATION_ORDER_PLACED_JOB_TYPE);
    expect(job.status).toBe("PENDING");
    expect(job.subjectType).toBe(AUTOMATION_ORDER_SUBJECT_TYPE);
    expect(job.subjectId).toBe(ORDER_ID);

    const payload = JSON.parse(job.payloadJson);
    expect(payload.schema).toBe(AUTOMATION_ORDER_PLACED_PAYLOAD_SCHEMA);
    expect(payload.automationId).toBe(automation.id);
    expect(payload.triggerType).toBe("ORDER_PLACED");
    expect(payload.orderId).toBe(ORDER_ID);
  });

  it("respecte le delayMinutes pour scheduledAt", async () => {
    const automation = {
      id: "auto_2",
      code: "delayed-order",
      actionType: "EMAIL_MESSAGE",
      delayMinutes: 60,
      templateCode: null,
    };
    const tx = buildMockTx([automation]);

    await queueOrderPlacedAutomationJobs(tx as never, {
      storeId: STORE_ID,
      orderId: ORDER_ID,
      occurredAt: OCCURRED_AT,
    });

    const callArgs = tx.job.createMany.mock.calls[0][0];
    const job = callArgs.data[0];

    const expectedScheduledAt = new Date(OCCURRED_AT.getTime() + 60 * 60_000);
    expect(job.scheduledAt).toEqual(expectedScheduledAt);
  });

  it("utilise une clé d'idempotence unique par automation + commande", async () => {
    const automations = [
      {
        id: "auto_1",
        code: "a1",
        actionType: "EMAIL_MESSAGE",
        delayMinutes: 0,
        templateCode: null,
      },
      {
        id: "auto_2",
        code: "a2",
        actionType: "EMAIL_MESSAGE",
        delayMinutes: 0,
        templateCode: null,
      },
    ];
    const tx = buildMockTx(automations);

    await queueOrderPlacedAutomationJobs(tx as never, {
      storeId: STORE_ID,
      orderId: ORDER_ID,
      occurredAt: OCCURRED_AT,
    });

    const callArgs = tx.job.createMany.mock.calls[0][0];
    const keys = callArgs.data.map((j: { idempotencyKey: string }) => j.idempotencyKey);
    expect(new Set(keys).size).toBe(2);
  });

  it("vérifie le feature flag avec le bon storeId", async () => {
    const tx = buildMockTx([]);

    await queueOrderPlacedAutomationJobs(tx as never, {
      storeId: "store_xyz",
      orderId: ORDER_ID,
      occurredAt: OCCURRED_AT,
    });

    expect(mockMeetsFeatureLevel).toHaveBeenCalledWith("engagement.automations", "basic", {
      storeId: "store_xyz",
    });
  });
});
