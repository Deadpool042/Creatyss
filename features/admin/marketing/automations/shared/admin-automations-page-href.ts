import { ADMIN_AUTOMATIONS_PATH } from "@/features/admin/marketing/automations/shared/admin-automations-routes";
import type { AdminArchivedAutomationFilter } from "@/features/admin/marketing/automations/shared/admin-automations-archives-filters";
import type { AdminAutomationJobStatus } from "@/features/admin/marketing/automations/types/admin-automation-job.types";
import type { AdminAutomationDefinitionFilter } from "@/features/admin/marketing/automations/types/admin-automation.types";

export type AdminAutomationsPageHashSection =
  | "automation-jobs"
  | "archives"
  | "archived-automations"
  | "archived-jobs";

export function buildAutomationsPageHref(input: {
  automationId?: string | null;
  status?: AdminAutomationJobStatus | null;
  definition?: AdminAutomationDefinitionFilter | null;
  archivedAutomationId?: string | null;
  archivedStatus?: AdminAutomationJobStatus | null;
  archivedDefinition?: AdminArchivedAutomationFilter | null;
  hash?: AdminAutomationsPageHashSection;
}): string {
  const params = new URLSearchParams();

  if (input.automationId) {
    params.set("automation", input.automationId);
  }

  if (input.status) {
    params.set("status", input.status);
  }

  if (input.definition) {
    params.set("definition", input.definition);
  }

  if (input.archivedAutomationId) {
    params.set("archivedAutomation", input.archivedAutomationId);
  }

  if (input.archivedStatus) {
    params.set("archivedStatus", input.archivedStatus);
  }

  if (input.archivedDefinition) {
    params.set("archivedDefinition", input.archivedDefinition);
  }

  const query = params.toString();
  const hash = input.hash ? `#${input.hash}` : "";
  return query.length > 0
    ? `${ADMIN_AUTOMATIONS_PATH}?${query}${hash}`
    : `${ADMIN_AUTOMATIONS_PATH}${hash}`;
}
