"use server";

import { revalidatePath } from "next/cache";

import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { ADMIN_AUTOMATIONS_PATH } from "@/features/admin/marketing/automations/shared/admin-automations-routes";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { cancelAutomationJob } from "@/features/automations/services/cancel-automation-job.service";

export type CancelAutomationJobResult =
  | { ok: true }
  | { ok: false; error: string };

export async function cancelAutomationJobAction(
  jobId: string
): Promise<CancelAutomationJobResult> {
  await requireAuthenticatedAdmin();

  const storeId = await getCurrentStoreId();

  if (!storeId) {
    return { ok: false, error: "Aucune boutique trouvée." };
  }

  try {
    await cancelAutomationJob({ jobId, storeId });
    revalidatePath(ADMIN_AUTOMATIONS_PATH);
    return { ok: true };
  } catch (error) {
    if (error instanceof Error) {
      return { ok: false, error: error.message };
    }

    return { ok: false, error: "Échec de l'annulation du job." };
  }
}
