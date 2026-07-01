import "server-only";

import { db } from "@/core/db";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { AUTOMATION_JOB_TYPE_CODES } from "@/features/automations/shared/automation-job.constants";
import type {
  AdminAutomationJobStatus,
  AdminAutomationJobsStats,
  AdminAutomationJobSummary,
} from "@/features/admin/marketing/automations/types/admin-automation-job.types";

type AutomationJobPayload = {
  automationId?: unknown;
  automationCode?: unknown;
  triggerType?: unknown;
  actionType?: unknown;
};

type AutomationEmailTrace = Pick<
  AdminAutomationJobSummary,
  | "emailMessageId"
  | "emailRecipient"
  | "emailStatus"
  | "emailProvider"
  | "emailProviderMessageId"
  | "emailSentAt"
  | "emailLastError"
>;

function parseAutomationJobPayload(
  payloadJson: string | null
): Pick<
  AdminAutomationJobSummary,
  "automationId" | "automationCode" | "triggerType" | "actionType"
> {
  if (!payloadJson) {
    return {
      automationId: null,
      automationCode: null,
      triggerType: null,
      actionType: null,
    };
  }

  try {
    const payload = JSON.parse(payloadJson) as AutomationJobPayload;
    return {
      automationId: typeof payload.automationId === "string" ? payload.automationId : null,
      automationCode: typeof payload.automationCode === "string" ? payload.automationCode : null,
      triggerType: typeof payload.triggerType === "string" ? payload.triggerType : null,
      actionType: typeof payload.actionType === "string" ? payload.actionType : null,
    };
  } catch {
    return {
      automationId: null,
      automationCode: null,
      triggerType: null,
      actionType: null,
    };
  }
}

function mapEmailStatus(status: string): AutomationEmailTrace["emailStatus"] {
  if (status === "SENT") return "sent";
  if (status === "FAILED" || status === "CANCELLED") return "failed";
  return "pending";
}

export async function listAdminAutomationJobs(limit = 25): Promise<{
  jobs: AdminAutomationJobSummary[];
  stats: AdminAutomationJobsStats;
}> {
  return listAdminAutomationJobsWithFilter(limit);
}

export async function listAdminAutomationJobsWithFilter(
  limit = 25,
  automationId?: string | null,
  status?: AdminAutomationJobStatus | null
): Promise<{
  jobs: AdminAutomationJobSummary[];
  stats: AdminAutomationJobsStats;
}> {
  const storeId = await getCurrentStoreId();

  if (storeId === null) {
    return {
      jobs: [],
      stats: { pending: 0, running: 0, failed: 0, succeeded: 0, cancelled: 0, total: 0 },
    };
  }

  const where = {
    storeId,
    typeCode: { in: [...AUTOMATION_JOB_TYPE_CODES] },
    archivedAt: null,
    ...(automationId
      ? {
          deduplicationKey: {
            startsWith: `automation:${automationId}:`,
          },
        }
      : {}),
    ...(status ? { status } : {}),
  };

  const [jobs, grouped] = await Promise.all([
    db.job.findMany({
      where,
      orderBy: [{ createdAt: "desc" }],
      take: limit,
      select: {
        id: true,
        status: true,
        payloadJson: true,
        subjectType: true,
        subjectId: true,
        scheduledAt: true,
        createdAt: true,
        startedAt: true,
        finishedAt: true,
        errorMessage: true,
      },
    }),
    db.job.groupBy({
      by: ["status"],
      where,
      _count: { status: true },
    }),
  ]);

  const stats: AdminAutomationJobsStats = {
    pending: 0,
    running: 0,
    failed: 0,
    succeeded: 0,
    cancelled: 0,
    total: 0,
  };

  for (const row of grouped) {
    const count = row._count.status;
    stats.total += count;
    if (row.status === "PENDING") stats.pending = count;
    else if (row.status === "RUNNING") stats.running = count;
    else if (row.status === "FAILED") stats.failed = count;
    else if (row.status === "SUCCEEDED") stats.succeeded = count;
    else if (row.status === "CANCELLED") stats.cancelled = count;
  }

  const jobIds = jobs.map((job) => job.id);
  const emailMessages =
    jobIds.length > 0
      ? await db.emailMessage.findMany({
          where: {
            storeId,
            subjectType: "automation_job",
            subjectId: { in: jobIds },
          },
          include: { recipients: true },
          orderBy: [{ createdAt: "desc" }],
        })
      : [];

  const emailTraceByJobId = new Map<string, AutomationEmailTrace>();

  for (const message of emailMessages) {
    if (!message.subjectId || emailTraceByJobId.has(message.subjectId)) {
      continue;
    }

    const toRecipient = message.recipients.find((recipient) => recipient.type === "TO");

    emailTraceByJobId.set(message.subjectId, {
      emailMessageId: message.id,
      emailRecipient: toRecipient?.email ?? null,
      emailStatus: mapEmailStatus(message.status),
      emailProvider: message.provider ?? null,
      emailProviderMessageId: message.providerReference ?? null,
      emailSentAt: message.sentAt?.toISOString() ?? null,
      emailLastError: message.errorMessage ?? null,
    });
  }

  return {
    stats,
    jobs: jobs.map((job) => {
      const payload = parseAutomationJobPayload(job.payloadJson);
      const emailTrace = emailTraceByJobId.get(job.id);
      return {
        id: job.id,
        ...payload,
        subjectType: job.subjectType,
        subjectId: job.subjectId,
        status: job.status as AdminAutomationJobSummary["status"],
        scheduledAt: job.scheduledAt?.toISOString() ?? null,
        createdAt: job.createdAt.toISOString(),
        startedAt: job.startedAt?.toISOString() ?? null,
        finishedAt: job.finishedAt?.toISOString() ?? null,
        errorMessage: job.errorMessage,
        emailMessageId: emailTrace?.emailMessageId ?? null,
        emailRecipient: emailTrace?.emailRecipient ?? null,
        emailStatus: emailTrace?.emailStatus ?? null,
        emailProvider: emailTrace?.emailProvider ?? null,
        emailProviderMessageId: emailTrace?.emailProviderMessageId ?? null,
        emailSentAt: emailTrace?.emailSentAt ?? null,
        emailLastError: emailTrace?.emailLastError ?? null,
      };
    }),
  };
}
