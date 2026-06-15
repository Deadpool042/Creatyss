"use server";

import { revalidatePath } from "next/cache";

import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { ADMIN_AUTOMATIONS_PATH } from "@/features/admin/marketing/automations/shared/admin-automations-routes";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { restoreAutomationJob } from "@/features/automations/services/restore-automation-job.service";

export type RestoreAutomationJobsBatchResult =
  | {
      ok: true;
      restoredCount: number;
      rearmedPendingCount: number;
      unarchivedOnlyCount: number;
      failedCount: number;
    }
  | { ok: false; error: string };

export async function restoreAutomationJobsBatchAction(
  jobIds: string[]
): Promise<RestoreAutomationJobsBatchResult> {
  await requireAuthenticatedAdmin();

  const storeId = await getCurrentStoreId();

  if (!storeId) {
    return { ok: false, error: "Aucune boutique trouvée." };
  }

  const uniqueIds = Array.from(new Set(jobIds.filter((id) => id.length > 0)));

  if (uniqueIds.length === 0) {
    return { ok: false, error: "Aucun job archivé à restaurer." };
  }

  let restoredCount = 0;
  let rearmedPendingCount = 0;
  let unarchivedOnlyCount = 0;
  let failedCount = 0;

  for (const jobId of uniqueIds) {
    try {
      const mode = await restoreAutomationJob({ jobId, storeId });
      restoredCount += 1;
      if (mode === "rearmed_pending") {
        rearmedPendingCount += 1;
      } else {
        unarchivedOnlyCount += 1;
      }
    } catch {
      failedCount += 1;
    }
  }

  if (restoredCount === 0) {
    return { ok: false, error: "Aucun job archivé n'a pu être restauré." };
  }

  revalidatePath(ADMIN_AUTOMATIONS_PATH);

  return {
    ok: true,
    restoredCount,
    rearmedPendingCount,
    unarchivedOnlyCount,
    failedCount,
  };
}
