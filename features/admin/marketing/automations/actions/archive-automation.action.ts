"use server";

import { revalidatePath } from "next/cache";

import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { db } from "@/core/db";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { buildArchivedAutomationCode } from "@/features/admin/marketing/automations/shared/admin-automation-code";
import { AUTOMATION_JOB_TYPE_CODES } from "@/features/automations/shared/automation-job.constants";
import { ADMIN_AUTOMATIONS_PATH } from "@/features/admin/marketing/automations/shared/admin-automations-routes";

export type ArchiveAutomationResult =
  | { ok: true; cancelledJobsCount: number }
  | { ok: false; error: string };

export async function archiveAutomationAction(
  automationId: string
): Promise<ArchiveAutomationResult> {
  await requireAuthenticatedAdmin();

  const storeId = await getCurrentStoreId();

  if (storeId === null) {
    return { ok: false, error: "Aucune boutique trouvée." };
  }

  const automation = await db.automation.findFirst({
    where: {
      id: automationId,
      storeId,
      archivedAt: null,
    },
    select: { id: true, storeId: true, code: true },
  });

  if (!automation) {
    return { ok: false, error: "Automation introuvable." };
  }

  const now = new Date();

  const cancelledJobsCount = await db.$transaction(async (tx) => {
    await tx.automation.update({
      where: { id: automationId },
      data: {
        code: buildArchivedAutomationCode(automation.code, automation.id),
        status: "ARCHIVED",
        archivedAt: now,
      },
    });

    const cancelledJobs = await tx.job.updateMany({
      where: {
        storeId: automation.storeId,
        typeCode: { in: [...AUTOMATION_JOB_TYPE_CODES] },
        status: "PENDING",
        archivedAt: null,
        deduplicationKey: {
          startsWith: `automation:${automationId}:`,
        },
      },
      data: {
        status: "CANCELLED",
        finishedAt: now,
        errorCode: "automation_archived",
        errorMessage: "Automation archivée avant exécution.",
        archivedAt: now,
      },
    });

    await tx.job.updateMany({
      where: {
        storeId: automation.storeId,
        typeCode: { in: [...AUTOMATION_JOB_TYPE_CODES] },
        archivedAt: null,
        status: {
          notIn: ["PENDING", "RUNNING"],
        },
        deduplicationKey: {
          startsWith: `automation:${automationId}:`,
        },
      },
      data: {
        archivedAt: now,
      },
    });

    return cancelledJobs.count;
  });

  revalidatePath(ADMIN_AUTOMATIONS_PATH);

  return { ok: true, cancelledJobsCount };
}
