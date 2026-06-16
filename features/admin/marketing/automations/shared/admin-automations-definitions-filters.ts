import type {
  AdminAutomationDefinitionFilter,
  AdminAutomationSummary,
} from "@/features/admin/marketing/automations/types/admin-automation.types";

export const DEFINITION_FILTERS = [
  { value: null, label: "Toutes" },
  { value: "with-jobs", label: "Avec jobs" },
  { value: "pending", label: "Avec attente" },
  { value: "running", label: "Avec en cours" },
  { value: "failed", label: "Avec échecs" },
  { value: "without-jobs", label: "Sans job" },
] satisfies ReadonlyArray<{ value: AdminAutomationDefinitionFilter | null; label: string }>;

export function parseSelectedDefinitionFilter(
  input: string | undefined
): AdminAutomationDefinitionFilter | null {
  if (
    input === "with-jobs" ||
    input === "pending" ||
    input === "running" ||
    input === "failed" ||
    input === "without-jobs"
  ) {
    return input;
  }

  return null;
}

export function matchesDefinitionFilter(
  automation: AdminAutomationSummary,
  filter: AdminAutomationDefinitionFilter | null
): boolean {
  switch (filter) {
    case "with-jobs":
      return automation.jobActivity.total > 0;
    case "pending":
      return automation.jobActivity.pending > 0;
    case "running":
      return automation.jobActivity.running > 0;
    case "failed":
      return automation.jobActivity.failed > 0;
    case "without-jobs":
      return automation.jobActivity.total === 0;
    case null:
    default:
      return true;
  }
}

export function getDefinitionFilterEmptyMessage(
  filter: AdminAutomationDefinitionFilter | null
): string {
  switch (filter) {
    case "with-jobs":
      return "Aucune automation avec jobs locaux pour ce filtre.";
    case "pending":
      return "Aucune automation avec job en attente pour ce filtre.";
    case "running":
      return "Aucune automation avec job en cours pour ce filtre.";
    case "failed":
      return "Aucune automation avec job échoué pour ce filtre.";
    case "without-jobs":
      return "Aucune automation sans job local pour ce filtre.";
    case null:
    default:
      return "Aucune automation définie pour le moment.";
  }
}

export function getDefinitionsCountSummary(input: {
  totalCount: number;
  visibleCount: number;
  selectedDefinitionLabel: string | null;
}): string {
  const visibleLabel =
    input.visibleCount > 1
      ? `${input.visibleCount} définitions visibles`
      : `${input.visibleCount} définition visible`;
  const totalLabel =
    input.totalCount > 1 ? `${input.totalCount} définitions` : `${input.totalCount} définition`;

  if (input.selectedDefinitionLabel) {
    return `${visibleLabel} sur ${totalLabel} pour le filtre ${input.selectedDefinitionLabel.toLowerCase()}.`;
  }

  return `${visibleLabel}.`;
}
