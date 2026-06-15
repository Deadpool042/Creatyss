"use server";

import { revalidatePath } from "next/cache";

import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { ADMIN_AUTOMATIONS_PATH } from "@/features/admin/marketing/automations/shared/admin-automations-routes";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { cancelAutomationJob } from "@/features/automations/services/cancel-automation-job.service";

export type CancelAutomationJobsBatchResult =
  | {
      ok: true;
      requested: number;
      succeeded: number;
      failed: number;
      errors: string[];
    }
  | { ok: false; error: string };

const MAX_BATCH_SIZE = 25;

export async function cancelAutomationJobsBatchAction(
  jobIds: ReadonlyArray<string>
): Promise<CancelAutomationJobsBatchResult> {
  await requireAuthenticatedAdmin();

  const storeId = await getCurrentStoreId();

  if (!storeId) {
    return { ok: false, error: "Aucune boutique trouvée." };
  }

  const normalizedJobIds = Array.from(
    new Set(jobIds.map((jobId) => jobId.trim()).filter((jobId) => jobId.length > 0))
  ).slice(0, MAX_BATCH_SIZE);

  if (normalizedJobIds.length === 0) {
    return { ok: false, error: "Aucun job en attente à annuler." };
  }

  let succeeded = 0;
  const errors: string[] = [];

  for (const jobId of normalizedJobIds) {
    try {
      await cancelAutomationJob({ jobId, storeId });
      succeeded += 1;
    } catch (error) {
      if (error instanceof Error) {
        errors.push(error.message);
      } else {
        errors.push("Échec de l'annulation d'un job.");
      }
    }
  }

  revalidatePath(ADMIN_AUTOMATIONS_PATH);

  return {
    ok: true,
    requested: normalizedJobIds.length,
    succeeded,
    failed: normalizedJobIds.length - succeeded,
    errors: errors.slice(0, 5),
  };
}
