"use server";

import { revalidatePath } from "next/cache";

import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { db } from "@/core/db";
import { AUTOMATION_JOB_TYPE_CODES } from "@/features/automations/shared/automation-job.constants";
import { ADMIN_AUTOMATIONS_PATH } from "@/features/admin/marketing/automations/shared/admin-automations-routes";

export type ToggleAutomationStatusResult =
  | { ok: true; newStatus: string; cancelledJobsCount: number }
  | { ok: false; error: string };

/**
 * ACTIVE -> INACTIVE, tout autre statut non archivé -> ACTIVE.
 *
 * La désactivation gouverne aussi les jobs `PENDING` déjà planifiés pour cette
 * définition, afin d'éviter une exécution tardive d'une automation suspendue.
 */
export async function toggleAutomationStatusAction(
  automationId: string
): Promise<ToggleAutomationStatusResult> {
  await requireAuthenticatedAdmin();

  const automation = await db.automation.findUnique({
    where: { id: automationId },
    select: { id: true, storeId: true, status: true, archivedAt: true },
  });

  if (!automation || automation.archivedAt) {
    return { ok: false, error: "Automation introuvable." };
  }

  const nextStatus = automation.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
  const now = new Date();

  const cancelledJobsCount = await db.$transaction(async (tx) => {
    await tx.automation.update({
      where: { id: automationId },
      data: { status: nextStatus },
    });

    if (nextStatus !== "INACTIVE") {
      return 0;
    }

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
        errorCode: "automation_deactivated",
        errorMessage: "Automation désactivée avant exécution.",
      },
    });

    return cancelledJobs.count;
  });

  revalidatePath(ADMIN_AUTOMATIONS_PATH);

  return { ok: true, newStatus: nextStatus, cancelledJobsCount };
}
