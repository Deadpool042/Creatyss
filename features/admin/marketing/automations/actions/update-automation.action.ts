"use server";

import { revalidatePath } from "next/cache";

import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { db } from "@/core/db";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { createAutomationSchema } from "@/features/admin/marketing/automations/schemas/create-automation.schema";
import { buildArchivedAutomationCode } from "@/features/admin/marketing/automations/shared/admin-automation-code";
import { ADMIN_AUTOMATIONS_PATH } from "@/features/admin/marketing/automations/shared/admin-automations-routes";

function isUniqueConstraintError(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "P2002";
}

export type UpdateAutomationResult =
  | { ok: true }
  | { ok: false; error: string };

export async function updateAutomationAction(
  automationId: string,
  formData: FormData
): Promise<UpdateAutomationResult> {
  await requireAuthenticatedAdmin();

  const descriptionRaw = String(formData.get("description") ?? "").trim();
  const templateCodeRaw = String(formData.get("templateCode") ?? "").trim();
  const delayRaw = String(formData.get("delayMinutes") ?? "").trim();

  const parsed = createAutomationSchema.safeParse({
    code: String(formData.get("code") ?? ""),
    name: String(formData.get("name") ?? ""),
    description: descriptionRaw.length > 0 ? descriptionRaw : null,
    triggerType: String(formData.get("triggerType") ?? ""),
    actionType: String(formData.get("actionType") ?? ""),
    delayMinutes: delayRaw.length > 0 ? Number(delayRaw) : 0,
    templateCode: templateCodeRaw.length > 0 ? templateCodeRaw : null,
  });

  if (!parsed.success) {
    return { ok: false, error: "Formulaire invalide — vérifiez les champs." };
  }

  const storeId = await getCurrentStoreId();

  if (storeId === null) {
    return { ok: false, error: "Aucune boutique trouvée." };
  }

  const automation = await db.automation.findFirst({
    where: {
      id: automationId,
      storeId,
      archivedAt: null,
    },
    select: { id: true },
  });

  if (!automation) {
    return { ok: false, error: "Automation introuvable." };
  }

  const data = parsed.data;
  const normalizedCode = data.code.toUpperCase();

  try {
    await db.$transaction(async (tx) => {
      const archivedConflict = await tx.automation.findFirst({
        where: {
          storeId,
          code: normalizedCode,
          archivedAt: { not: null },
          id: { not: automationId },
        },
        select: {
          id: true,
          code: true,
        },
      });

      if (archivedConflict) {
        await tx.automation.update({
          where: { id: archivedConflict.id },
          data: {
            code: buildArchivedAutomationCode(archivedConflict.code, archivedConflict.id),
          },
        });
      }

      await tx.automation.update({
        where: { id: automationId },
        data: {
          code: normalizedCode,
          name: data.name,
          description: data.description,
          triggerType: data.triggerType,
          actionType: data.actionType,
          delayMinutes: data.delayMinutes,
          templateCode: data.templateCode,
        },
      });
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { ok: false, error: "Ce code d'automation existe déjà." };
    }

    console.error(error);
    return { ok: false, error: "La mise à jour de l'automation a échoué." };
  }

  revalidatePath(ADMIN_AUTOMATIONS_PATH);

  return { ok: true };
}
