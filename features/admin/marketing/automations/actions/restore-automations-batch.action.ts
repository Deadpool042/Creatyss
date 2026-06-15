"use server";

import { revalidatePath } from "next/cache";

import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { ADMIN_AUTOMATIONS_PATH } from "@/features/admin/marketing/automations/shared/admin-automations-routes";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { restoreAutomationDefinition } from "@/features/automations/services/restore-automation-definition.service";

export type RestoreAutomationsBatchResult =
  | {
      ok: true;
      restoredCount: number;
      fallbackCount: number;
      failedCount: number;
    }
  | { ok: false; error: string };

export async function restoreAutomationsBatchAction(
  automationIds: string[]
): Promise<RestoreAutomationsBatchResult> {
  await requireAuthenticatedAdmin();

  const storeId = await getCurrentStoreId();

  if (storeId === null) {
    return { ok: false, error: "Aucune boutique trouvée." };
  }

  const uniqueIds = Array.from(new Set(automationIds.filter((id) => id.length > 0)));

  if (uniqueIds.length === 0) {
    return { ok: false, error: "Aucune automation archivée à restaurer." };
  }

  let restoredCount = 0;
  let fallbackCount = 0;
  let failedCount = 0;

  for (const automationId of uniqueIds) {
    try {
      const result = await restoreAutomationDefinition({ automationId, storeId });
      restoredCount += 1;
      if (result.usedFallbackCode) {
        fallbackCount += 1;
      }
    } catch {
      failedCount += 1;
    }
  }

  if (restoredCount === 0) {
    return { ok: false, error: "Aucune automation archivée n'a pu être restaurée." };
  }

  revalidatePath(ADMIN_AUTOMATIONS_PATH);

  return {
    ok: true,
    restoredCount,
    fallbackCount,
    failedCount,
  };
}
