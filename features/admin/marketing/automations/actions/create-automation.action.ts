"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { db } from "@/core/db";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { createAutomationSchema } from "@/features/admin/marketing/automations/schemas/create-automation.schema";
import { buildArchivedAutomationCode } from "@/features/admin/marketing/automations/shared/admin-automation-code";
import { ADMIN_AUTOMATIONS_PATH } from "@/features/admin/marketing/automations/shared/admin-automations-routes";
import { isWiredAutomationCombination } from "@/features/admin/marketing/automations/shared/admin-automation-options";

function isUniqueConstraintError(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "P2002";
}

export async function createAutomationAction(formData: FormData): Promise<void> {
  const admin = await requireAuthenticatedAdmin();

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
    redirect(`${ADMIN_AUTOMATIONS_PATH}?automation_error=invalid_input`);
  }

  if (!isWiredAutomationCombination(parsed.data.triggerType, parsed.data.actionType)) {
    redirect(`${ADMIN_AUTOMATIONS_PATH}?automation_error=unwired_combination`);
  }

  const storeId = await getCurrentStoreId();

  if (storeId === null) {
    redirect(`${ADMIN_AUTOMATIONS_PATH}?automation_error=missing_store`);
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

      await tx.automation.create({
        data: {
          storeId,
          createdByUserId: admin.id,
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
      redirect(`${ADMIN_AUTOMATIONS_PATH}?automation_error=duplicate_code`);
    }

    console.error(error);
    redirect(`${ADMIN_AUTOMATIONS_PATH}?automation_error=create_failed`);
  }

  revalidatePath(ADMIN_AUTOMATIONS_PATH);
  redirect(`${ADMIN_AUTOMATIONS_PATH}?automation_created=1`);
}
