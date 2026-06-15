"use server";

import { revalidatePath } from "next/cache";

import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { ADMIN_AUTOMATIONS_PATH } from "@/features/admin/marketing/automations/shared/admin-automations-routes";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { rescheduleAutomationJob } from "@/features/automations/services/reschedule-automation-job.service";

export type RescheduleAutomationJobResult =
  | { ok: true }
  | { ok: false; error: string };

export async function rescheduleAutomationJobAction(
  jobId: string,
  scheduledAtIso: string | null
): Promise<RescheduleAutomationJobResult> {
  await requireAuthenticatedAdmin();

  const storeId = await getCurrentStoreId();

  if (!storeId) {
    return { ok: false, error: "Aucune boutique trouvée." };
  }

  const scheduledAt =
    scheduledAtIso && scheduledAtIso.length > 0 ? new Date(scheduledAtIso) : null;

  if (scheduledAtIso && (!scheduledAt || Number.isNaN(scheduledAt.getTime()))) {
    return { ok: false, error: "Date de planification invalide." };
  }

  try {
    await rescheduleAutomationJob({ jobId, storeId, scheduledAt });
    revalidatePath(ADMIN_AUTOMATIONS_PATH);
    return { ok: true };
  } catch (error) {
    if (error instanceof Error) {
      return { ok: false, error: error.message };
    }

    return { ok: false, error: "Échec de la modification du job." };
  }
}
