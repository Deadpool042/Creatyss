import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/core/db", () => ({
  db: {
    job: {
      updateMany: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

vi.mock("@/features/webhooks/services/execute-webhook-delivery-job.service", () => ({
  executeWebhookDeliveryJob: vi.fn(),
}));

import { db } from "@/core/db";
import { executeWebhookDeliveryJob } from "@/features/webhooks/services/execute-webhook-delivery-job.service";
import { runWebhookDeliveryJobsBatch } from "@/features/webhooks/services/run-webhook-delivery-jobs-batch.service";
import { WEBHOOK_DELIVERY_JOB_TYPE } from "@/features/webhooks/shared/webhook-job.constants";

const mockDb = db as unknown as {
  job: {
    updateMany: ReturnType<typeof vi.fn>;
    findMany: ReturnType<typeof vi.fn>;
  };
};
const mockExecuteWebhookDeliveryJob = executeWebhookDeliveryJob as ReturnType<typeof vi.fn>;

describe("runWebhookDeliveryJobsBatch", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDb.job.updateMany.mockResolvedValue({ count: 0 });
    mockDb.job.findMany.mockResolvedValue([]);
  });

  it("récupère les jobs RUNNING bloqués depuis plus de 15 minutes en FAILED", async () => {
    mockDb.job.updateMany.mockResolvedValueOnce({ count: 3 });

    const stats = await runWebhookDeliveryJobsBatch();

    expect(stats.recovered).toBe(3);
    const call = mockDb.job.updateMany.mock.calls[0][0];
    expect(call.where.typeCode).toBe(WEBHOOK_DELIVERY_JOB_TYPE);
    expect(call.where.status).toBe("RUNNING");
    expect(call.where.startedAt.lt).toBeInstanceOf(Date);
    expect(call.data.status).toBe("FAILED");
    expect(call.data.errorCode).toBe("worker_timeout");
  });

  it("remet en PENDING les jobs FAILED dont attemptCount < maxAttempts (auto-retry)", async () => {
    mockDb.job.findMany.mockResolvedValueOnce([
      { id: "job_retryable", attemptCount: 1, maxAttempts: 3 },
      { id: "job_exhausted", attemptCount: 3, maxAttempts: 3 },
    ]);
    mockDb.job.updateMany.mockImplementation(({ where }: { where: { status?: string } }) => {
      if (where.status === "FAILED" && "id" in where) {
        return Promise.resolve({ count: 1 });
      }
      return Promise.resolve({ count: 0 });
    });

    const stats = await runWebhookDeliveryJobsBatch();

    expect(stats.requeued).toBe(1);
    const retryCall = mockDb.job.updateMany.mock.calls.find(
      (call) => (call[0].where as { id?: { in: string[] } }).id !== undefined
    );
    expect(retryCall).toBeDefined();
    expect(retryCall![0].where.id.in).toEqual(["job_retryable"]);
    expect(retryCall![0].data.status).toBe("PENDING");
  });

  it("ne fait aucun appel de requeue si aucun job FAILED n'est retryable", async () => {
    mockDb.job.findMany.mockResolvedValueOnce([
      { id: "job_exhausted", attemptCount: 3, maxAttempts: 3 },
    ]);

    const stats = await runWebhookDeliveryJobsBatch();

    expect(stats.requeued).toBe(0);
    // Un seul updateMany : celui de la recovery RUNNING → FAILED
    expect(mockDb.job.updateMany).toHaveBeenCalledTimes(1);
  });

  it("sélectionne les jobs PENDING dus, triés par priorité puis scheduledAt", async () => {
    mockDb.job.findMany
      .mockResolvedValueOnce([]) // failedJobs pour l'auto-retry
      .mockResolvedValueOnce([{ id: "job_a", storeId: "store_1" }]); // dueJobs

    await runWebhookDeliveryJobsBatch(10);

    const dueJobsCall = mockDb.job.findMany.mock.calls[1][0];
    expect(dueJobsCall.where.typeCode).toBe(WEBHOOK_DELIVERY_JOB_TYPE);
    expect(dueJobsCall.where.status).toBe("PENDING");
    expect(dueJobsCall.where.scheduledAt.lte).toBeInstanceOf(Date);
    expect(dueJobsCall.orderBy).toEqual([{ priority: "desc" }, { scheduledAt: "asc" }]);
    expect(dueJobsCall.take).toBe(10);
  });

  it("respecte le batchSize par défaut de 50", async () => {
    mockDb.job.findMany.mockResolvedValueOnce([]).mockResolvedValueOnce([]);

    await runWebhookDeliveryJobsBatch();

    const dueJobsCall = mockDb.job.findMany.mock.calls[1][0];
    expect(dueJobsCall.take).toBe(50);
  });

  it("exécute chaque job dû et compte succès/échecs", async () => {
    mockDb.job.findMany.mockResolvedValueOnce([]).mockResolvedValueOnce([
      { id: "job_ok", storeId: "store_1" },
      { id: "job_ko", storeId: "store_1" },
    ]);
    mockExecuteWebhookDeliveryJob
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(new Error("delivery failed"));

    const stats = await runWebhookDeliveryJobsBatch();

    expect(stats.selected).toBe(2);
    expect(stats.succeeded).toBe(1);
    expect(stats.failed).toBe(1);
    expect(mockExecuteWebhookDeliveryJob).toHaveBeenCalledWith({
      jobId: "job_ok",
      storeId: "store_1",
    });
    expect(mockExecuteWebhookDeliveryJob).toHaveBeenCalledWith({
      jobId: "job_ko",
      storeId: "store_1",
    });
  });

  it("compte comme échec un job dû sans storeId sans appeler l'exécution", async () => {
    mockDb.job.findMany
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([{ id: "job_orphan", storeId: null }]);

    const stats = await runWebhookDeliveryJobsBatch();

    expect(stats.failed).toBe(1);
    expect(stats.succeeded).toBe(0);
    expect(mockExecuteWebhookDeliveryJob).not.toHaveBeenCalled();
  });

  it("retourne des statistiques cohérentes de bout en bout", async () => {
    mockDb.job.updateMany.mockImplementation(
      ({ where }: { where: { status?: string; id?: unknown } }) => {
        if (where.status === "RUNNING") {
          return Promise.resolve({ count: 2 });
        }
        if (where.id !== undefined) {
          return Promise.resolve({ count: 1 });
        }
        return Promise.resolve({ count: 0 });
      }
    );
    mockDb.job.findMany
      .mockResolvedValueOnce([{ id: "job_retry", attemptCount: 0, maxAttempts: 3 }])
      .mockResolvedValueOnce([{ id: "job_due", storeId: "store_1" }]);
    mockExecuteWebhookDeliveryJob.mockResolvedValueOnce(undefined);

    const stats = await runWebhookDeliveryJobsBatch();

    expect(stats).toEqual({
      recovered: 2,
      requeued: 1,
      selected: 1,
      succeeded: 1,
      failed: 0,
    });
  });
});
