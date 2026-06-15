"use server";

import { revalidatePath } from "next/cache";

import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { ADMIN_AUTOMATIONS_PATH } from "@/features/admin/marketing/automations/shared/admin-automations-routes";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { retryAutomationJob } from "@/features/automations/services/retry-automation-job.service";

export type RetryAutomationJobResult =
  | { ok: true }
  | { ok: false; error: string };

export async function retryAutomationJobAction(
  jobId: string
): Promise<RetryAutomationJobResult> {
  await requireAuthenticatedAdmin();

  const storeId = await getCurrentStoreId();

  if (!storeId) {
    return { ok: false, error: "Aucune boutique trouvée." };
  }

  try {
    await retryAutomationJob({ jobId, storeId });
    revalidatePath(ADMIN_AUTOMATIONS_PATH);
    return { ok: true };
  } catch (error) {
    if (error instanceof Error) {
      return { ok: false, error: error.message };
    }

    return { ok: false, error: "Échec de la relance du job." };
  }
}
