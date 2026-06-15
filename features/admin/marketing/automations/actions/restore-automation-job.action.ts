"use server";

import { revalidatePath } from "next/cache";

import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { ADMIN_AUTOMATIONS_PATH } from "@/features/admin/marketing/automations/shared/admin-automations-routes";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import {
  restoreAutomationJob,
  type RestoreAutomationJobMode,
} from "@/features/automations/services/restore-automation-job.service";

export type RestoreAutomationJobResult =
  | { ok: true; mode: RestoreAutomationJobMode }
  | { ok: false; error: string };

export async function restoreAutomationJobAction(
  jobId: string
): Promise<RestoreAutomationJobResult> {
  await requireAuthenticatedAdmin();

  const storeId = await getCurrentStoreId();

  if (!storeId) {
    return { ok: false, error: "Aucune boutique trouvée." };
  }

  try {
    const mode = await restoreAutomationJob({ jobId, storeId });
    revalidatePath(ADMIN_AUTOMATIONS_PATH);
    return { ok: true, mode };
  } catch (error) {
    if (error instanceof Error) {
      return { ok: false, error: error.message };
    }

    return { ok: false, error: "Échec de la restauration du job." };
  }
}
