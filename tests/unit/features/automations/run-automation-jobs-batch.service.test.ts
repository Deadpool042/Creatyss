import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/core/db", () => ({
  db: {
    job: {
      updateMany: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

vi.mock("@/features/automations/services/execute-automation-job.service", () => ({
  executeAutomationJob: vi.fn(),
}));

import { db } from "@/core/db";
import { executeAutomationJob } from "@/features/automations/services/execute-automation-job.service";
import { runAutomationJobsBatch } from "@/features/automations/services/run-automation-jobs-batch.service";
import {
  AUTOMATION_JOB_TYPE_CODES,
  AUTOMATION_NEWSLETTER_SUBSCRIBED_JOB_TYPE,
  AUTOMATION_ORDER_PLACED_JOB_TYPE,
} from "@/features/automations/shared/automation-job.constants";

const mockDb = db as unknown as {
  job: {
    updateMany: ReturnType<typeof vi.fn>;
    findMany: ReturnType<typeof vi.fn>;
  };
};

const mockExecuteAutomationJob = executeAutomationJob as ReturnType<typeof vi.fn>;

describe("runAutomationJobsBatch", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDb.job.updateMany.mockResolvedValue({ count: 0 });
    mockDb.job.findMany.mockResolvedValue([]);
    mockExecuteAutomationJob.mockResolvedValue(undefined);
  });

  it("filtre la recovery, l'auto-retry et la sélection des jobs dus sur tous les typeCode d'automation", async () => {
    await runAutomationJobsBatch();

    expect(mockDb.job.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ typeCode: { in: [...AUTOMATION_JOB_TYPE_CODES] } }),
      })
    );

    expect(mockDb.job.findMany).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        where: expect.objectContaining({ typeCode: { in: [...AUTOMATION_JOB_TYPE_CODES] } }),
      })
    );

    expect(mockDb.job.findMany).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        where: expect.objectContaining({ typeCode: { in: [...AUTOMATION_JOB_TYPE_CODES] } }),
      })
    );
  });

  it("sélectionne et exécute des jobs dus de plusieurs typeCode dans le même batch", async () => {
    mockDb.job.findMany
      .mockResolvedValueOnce([]) // failedJobs (auto-retry pass)
      .mockResolvedValueOnce([
        {
          id: "job_newsletter",
          storeId: "store_1",
          typeCode: AUTOMATION_NEWSLETTER_SUBSCRIBED_JOB_TYPE,
        },
        { id: "job_order", storeId: "store_1", typeCode: AUTOMATION_ORDER_PLACED_JOB_TYPE },
      ]);

    const stats = await runAutomationJobsBatch();

    expect(mockExecuteAutomationJob).toHaveBeenCalledTimes(2);
    expect(mockExecuteAutomationJob).toHaveBeenCalledWith({
      jobId: "job_newsletter",
      storeId: "store_1",
    });
    expect(mockExecuteAutomationJob).toHaveBeenCalledWith({
      jobId: "job_order",
      storeId: "store_1",
    });
    expect(stats).toEqual({ recovered: 0, requeued: 0, selected: 2, succeeded: 2, failed: 0 });
  });

  it("requeue en PENDING les jobs FAILED de tout type dont attemptCount < maxAttempts", async () => {
    mockDb.job.findMany
      .mockResolvedValueOnce([
        { id: "failed_newsletter", attemptCount: 0, maxAttempts: 2 },
        { id: "failed_order", attemptCount: 1, maxAttempts: 1 },
      ])
      .mockResolvedValueOnce([]);
    mockDb.job.updateMany.mockResolvedValue({ count: 1 });

    const stats = await runAutomationJobsBatch();

    expect(mockDb.job.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ id: { in: ["failed_newsletter"] } }),
      })
    );
    expect(stats.requeued).toBe(1);
  });

  it("compte un job en échec si l'exécution jette une erreur, sans interrompre le batch", async () => {
    mockDb.job.findMany.mockResolvedValueOnce([]).mockResolvedValueOnce([
      { id: "job_ok", storeId: "store_1" },
      { id: "job_ko", storeId: "store_1" },
    ]);
    mockExecuteAutomationJob
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(new Error("boom"));

    const stats = await runAutomationJobsBatch();

    expect(stats.succeeded).toBe(1);
    expect(stats.failed).toBe(1);
  });
});
