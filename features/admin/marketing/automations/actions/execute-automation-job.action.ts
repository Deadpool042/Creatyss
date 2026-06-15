"use server";

import { revalidatePath } from "next/cache";

import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { executeAutomationJob } from "@/features/automations/services/execute-automation-job.service";
import { ADMIN_AUTOMATIONS_PATH } from "@/features/admin/marketing/automations/shared/admin-automations-routes";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";

export type ExecuteAutomationJobResult =
  | { ok: true }
  | { ok: false; error: string };

export async function executeAutomationJobAction(
  jobId: string
): Promise<ExecuteAutomationJobResult> {
  await requireAuthenticatedAdmin();

  const storeId = await getCurrentStoreId();

  if (!storeId) {
    return { ok: false, error: "Aucune boutique trouvée." };
  }

  try {
    await executeAutomationJob({ jobId, storeId });
    revalidatePath(ADMIN_AUTOMATIONS_PATH);
    return { ok: true };
  } catch (error) {
    if (error instanceof Error) {
      return { ok: false, error: error.message };
    }

    return { ok: false, error: "Échec de l'exécution du job." };
  }
}
