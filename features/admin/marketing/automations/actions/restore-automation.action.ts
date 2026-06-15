"use server";

import { revalidatePath } from "next/cache";

import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { ADMIN_AUTOMATIONS_PATH } from "@/features/admin/marketing/automations/shared/admin-automations-routes";
import { restoreAutomationDefinition } from "@/features/automations/services/restore-automation-definition.service";

export type RestoreAutomationResult =
  | { ok: true; restoredCode: string; usedFallbackCode: boolean }
  | { ok: false; error: string };

export async function restoreAutomationAction(
  automationId: string
): Promise<RestoreAutomationResult> {
  await requireAuthenticatedAdmin();

  const storeId = await getCurrentStoreId();

  if (storeId === null) {
    return { ok: false, error: "Aucune boutique trouvée." };
  }

  try {
    const result = await restoreAutomationDefinition({ automationId, storeId });
    revalidatePath(ADMIN_AUTOMATIONS_PATH);
    return { ok: true, ...result };
  } catch (error) {
    if (error instanceof Error) {
      return { ok: false, error: error.message };
    }

    return { ok: false, error: "Échec de la restauration de l'automation." };
  }
}
