import "server-only";

import { db } from "@/core/db";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { AUTOMATION_JOB_TYPE_CODES } from "@/features/automations/shared/automation-job.constants";
import type {
  AdminArchivedAutomationJobSummary,
  AdminAutomationJobStatus,
} from "@/features/admin/marketing/automations/types/admin-automation-job.types";

type AutomationJobPayload = {
  automationId?: unknown;
  automationCode?: unknown;
  triggerType?: unknown;
  actionType?: unknown;
};

function parseAutomationJobPayload(
  payloadJson: string | null
): Pick<
  AdminArchivedAutomationJobSummary,
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

function mapEmailStatus(status: string): AdminArchivedAutomationJobSummary["emailStatus"] {
  if (status === "SENT") return "sent";
  if (status === "FAILED" || status === "CANCELLED") return "failed";
  return "pending";
}

export async function listAdminArchivedAutomationJobs(
  limit = 25,
  automationId?: string | null,
  status?: AdminAutomationJobStatus | null
): Promise<{
  jobs: AdminArchivedAutomationJobSummary[];
  totalCount: number;
}> {
  const storeId = await getCurrentStoreId();

  if (storeId === null) {
    return { jobs: [], totalCount: 0 };
  }

  const where = {
    storeId,
    typeCode: { in: [...AUTOMATION_JOB_TYPE_CODES] },
    archivedAt: { not: null },
    ...(automationId
      ? {
          deduplicationKey: {
            startsWith: `automation:${automationId}:`,
          },
        }
      : {}),
    ...(status ? { status } : {}),
  };

  const [jobs, totalCount] = await Promise.all([
    db.job.findMany({
      where,
      orderBy: [{ archivedAt: "desc" }],
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
        archivedAt: true,
        errorCode: true,
        errorMessage: true,
      },
    }),
    db.job.count({ where }),
  ]);

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

  const emailTraceByJobId = new Map<
    string,
    Pick<
      AdminArchivedAutomationJobSummary,
      | "emailMessageId"
      | "emailRecipient"
      | "emailStatus"
      | "emailProvider"
      | "emailProviderMessageId"
      | "emailSentAt"
      | "emailLastError"
    >
  >();

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
    totalCount,
    jobs: jobs.flatMap((job) => {
      if (job.archivedAt === null) {
        return [];
      }

      const payload = parseAutomationJobPayload(job.payloadJson);
      const emailTrace = emailTraceByJobId.get(job.id);

      return [
        {
          id: job.id,
          ...payload,
          subjectType: job.subjectType,
          subjectId: job.subjectId,
          status: job.status as AdminArchivedAutomationJobSummary["status"],
          scheduledAt: job.scheduledAt?.toISOString() ?? null,
          createdAt: job.createdAt.toISOString(),
          startedAt: job.startedAt?.toISOString() ?? null,
          finishedAt: job.finishedAt?.toISOString() ?? null,
          archivedAt: job.archivedAt.toISOString(),
          errorCode: job.errorCode,
          errorMessage: job.errorMessage,
          emailMessageId: emailTrace?.emailMessageId ?? null,
          emailRecipient: emailTrace?.emailRecipient ?? null,
          emailStatus: emailTrace?.emailStatus ?? null,
          emailProvider: emailTrace?.emailProvider ?? null,
          emailProviderMessageId: emailTrace?.emailProviderMessageId ?? null,
          emailSentAt: emailTrace?.emailSentAt ?? null,
          emailLastError: emailTrace?.emailLastError ?? null,
        },
      ];
    }),
  };
}
