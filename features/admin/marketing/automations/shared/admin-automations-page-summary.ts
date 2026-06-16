import { JOB_STATUS_FILTERS } from "@/features/admin/marketing/automations/shared/admin-automations-jobs-filters";
import type { AdminAutomationJobStatus } from "@/features/admin/marketing/automations/types/admin-automation-job.types";

export function getErrorMessage(code: string): string {
  switch (code) {
    case "duplicate_code":
      return "Ce code d'automation existe déjà.";
    case "invalid_input":
      return "Formulaire invalide — vérifiez les champs.";
    case "missing_store":
      return "Aucune boutique trouvée.";
    default:
      return "La création de l'automation a échoué.";
  }
}

export function getActivePageFiltersSummary(input: {
  selectedAutomationCode: string | null;
  selectedJobStatus: AdminAutomationJobStatus | null;
  selectedDefinitionLabel: string | null;
  selectedArchivedAutomationCode: string | null;
  selectedArchivedJobStatusLabel: string | null;
  selectedArchivedDefinitionLabel: string | null;
}): string {
  const parts: string[] = [];

  if (input.selectedDefinitionLabel) {
    parts.push(`définitions ${input.selectedDefinitionLabel.toLowerCase()}`);
  }

  if (input.selectedAutomationCode) {
    parts.push(`automation ${input.selectedAutomationCode}`);
  }

  if (input.selectedJobStatus) {
    const statusLabel =
      JOB_STATUS_FILTERS.find((filter) => filter.value === input.selectedJobStatus)?.label ??
      input.selectedJobStatus;
    parts.push(`statut ${statusLabel.toLowerCase()}`);
  }

  if (input.selectedArchivedAutomationCode) {
    parts.push(`archives ${input.selectedArchivedAutomationCode}`);
  }

  if (input.selectedArchivedJobStatusLabel) {
    parts.push(`archives ${input.selectedArchivedJobStatusLabel.toLowerCase()}`);
  }

  if (input.selectedArchivedDefinitionLabel) {
    parts.push(`corbeille defs ${input.selectedArchivedDefinitionLabel.toLowerCase()}`);
  }

  if (parts.length === 0) {
    return "";
  }

  return `Filtres actifs : ${parts.join(" · ")}.`;
}
