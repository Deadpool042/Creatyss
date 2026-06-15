import "server-only";

import { db } from "@/core/db";
import {
  buildRestoredAutomationCode,
  restoreOriginalAutomationCode,
} from "@/features/admin/marketing/automations/shared/admin-automation-code";

type RestoreAutomationDefinitionInput = {
  automationId: string;
  storeId: string;
};

export type RestoreAutomationDefinitionResult = {
  restoredCode: string;
  usedFallbackCode: boolean;
};

export class RestoreAutomationDefinitionError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "RestoreAutomationDefinitionError";
    this.code = code;
  }
}

export async function restoreAutomationDefinition(
  input: RestoreAutomationDefinitionInput
): Promise<RestoreAutomationDefinitionResult> {
  const automation = await db.automation.findFirst({
    where: {
      id: input.automationId,
      storeId: input.storeId,
      archivedAt: { not: null },
    },
    select: {
      id: true,
      code: true,
    },
  });

  if (!automation) {
    throw new RestoreAutomationDefinitionError(
      "automation_not_found",
      "Automation archivée introuvable."
    );
  }

  const originalCode = restoreOriginalAutomationCode(automation.code);

  const activeConflict = await db.automation.findFirst({
    where: {
      storeId: input.storeId,
      id: { not: automation.id },
      code: originalCode,
      archivedAt: null,
    },
    select: { id: true },
  });

  const restoredCode =
    activeConflict === null
      ? originalCode
      : buildRestoredAutomationCode(automation.code, automation.id);

  await db.automation.update({
    where: { id: automation.id },
    data: {
      code: restoredCode,
      status: "INACTIVE",
      archivedAt: null,
    },
  });

  return {
    restoredCode,
    usedFallbackCode: activeConflict !== null,
  };
}
