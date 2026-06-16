import { restoreOriginalAutomationCode } from "@/features/admin/marketing/automations/shared/admin-automation-code";
import { JOB_STATUS_FILTERS } from "@/features/admin/marketing/automations/shared/admin-automations-jobs-filters";
import type { AdminAutomationJobStatus } from "@/features/admin/marketing/automations/types/admin-automation-job.types";
import type { AdminArchivedAutomationSummary } from "@/features/admin/marketing/automations/types/admin-automation.types";

export type AdminArchivedAutomationFilter = "code-released" | "direct-restore";

export const ARCHIVED_DEFINITION_FILTERS = [
  { value: null, label: "Toutes" },
  { value: "code-released", label: "Code libéré" },
  { value: "direct-restore", label: "Restauration directe" },
] satisfies ReadonlyArray<{ value: AdminArchivedAutomationFilter | null; label: string }>;

export function parseSelectedArchivedDefinitionFilter(
  input: string | undefined
): AdminArchivedAutomationFilter | null {
  if (input === "code-released" || input === "direct-restore") {
    return input;
  }

  return null;
}

export function matchesArchivedDefinitionFilter(
  automation: AdminArchivedAutomationSummary,
  filter: AdminArchivedAutomationFilter | null
): boolean {
  const originalCode = restoreOriginalAutomationCode(automation.code);
  const codeWasFreed = automation.code !== originalCode;

  switch (filter) {
    case "code-released":
      return codeWasFreed;
    case "direct-restore":
      return !codeWasFreed;
    case null:
    default:
      return true;
  }
}

export function getArchivedAutomationsCountSummary(count: number): string {
  if (count <= 0) {
    return "Aucune automation archivée.";
  }

  if (count === 1) {
    return "1 automation archivée.";
  }

  return `${count} automations archivées.`;
}

export function getArchivedDefinitionsCountSummary(input: {
  visibleCount: number;
  totalCount: number;
  selectedFilterLabel: string | null;
}): string {
  if (input.totalCount === 0) {
    return "Aucune automation archivée.";
  }

  const visibleLabel =
    input.visibleCount > 1
      ? `${input.visibleCount} automations archivées visibles`
      : `${input.visibleCount} automation archivée visible`;
  const totalLabel =
    input.totalCount > 1
      ? `${input.totalCount} automations archivées`
      : `${input.totalCount} automation archivée`;

  if (input.selectedFilterLabel) {
    return `${visibleLabel} sur ${totalLabel} pour le filtre ${input.selectedFilterLabel.toLowerCase()}.`;
  }

  if (input.visibleCount < input.totalCount) {
    return `${visibleLabel} sur ${totalLabel}.`;
  }

  return `${totalLabel}.`;
}

export function getArchivedDefinitionsEmptyStateMessage(
  filter: AdminArchivedAutomationFilter | null
): string {
  switch (filter) {
    case "code-released":
      return "Aucune automation archivée avec code libéré pour recréation.";
    case "direct-restore":
      return "Aucune automation archivée avec restauration directe dans la vue courante.";
    case null:
    default:
      return "Aucune automation archivée.";
  }
}

export function getArchivedDefinitionsFilterCount(
  automations: ReadonlyArray<AdminArchivedAutomationSummary>,
  filter: AdminArchivedAutomationFilter | null
): number {
  return automations.filter((automation) =>
    matchesArchivedDefinitionFilter(automation, filter)
  ).length;
}

export function getArchivedDefinitionsFilterLabel(input: {
  baseLabel: string;
  filter: AdminArchivedAutomationFilter | null;
  automations: ReadonlyArray<AdminArchivedAutomationSummary>;
}): string {
  return `${input.baseLabel} (${getArchivedDefinitionsFilterCount(
    input.automations,
    input.filter
  )})`;
}

export function getArchivedJobsCountSummary(input: {
  visibleCount: number;
  totalCount: number;
  selectedStatusLabel: string | null;
  selectedAutomationCode: string | null;
}): string {
  if (input.totalCount === 0) {
    return "Aucun job archivé.";
  }

  const visibleLabel =
    input.visibleCount > 1
      ? `${input.visibleCount} jobs archivés visibles`
      : `${input.visibleCount} job archivé visible`;
  const totalLabel =
    input.totalCount > 1 ? `${input.totalCount} jobs archivés` : `${input.totalCount} job archivé`;

  if (input.selectedStatusLabel) {
    const automationSuffix = input.selectedAutomationCode
      ? ` de ${input.selectedAutomationCode}`
      : "";
    return `${visibleLabel} sur ${totalLabel}${automationSuffix} pour le filtre ${input.selectedStatusLabel.toLowerCase()}.`;
  }

  if (input.selectedAutomationCode) {
    return `${visibleLabel} sur ${totalLabel} pour l'automation ${input.selectedAutomationCode}.`;
  }

  if (input.visibleCount < input.totalCount) {
    return `${visibleLabel} sur ${totalLabel}.`;
  }

  return `${totalLabel}.`;
}

export function getArchivedJobsEmptyStateMessage(
  selectedStatus: AdminAutomationJobStatus | null,
  selectedAutomationCode: string | null
): string {
  if (selectedAutomationCode && selectedStatus) {
    const statusLabel =
      JOB_STATUS_FILTERS.find((filter) => filter.value === selectedStatus)?.label ??
      selectedStatus;

    return `Aucun job archivé ${statusLabel.toLowerCase()} pour l'automation ${selectedAutomationCode}.`;
  }

  if (selectedAutomationCode) {
    return `Aucun job archivé pour l'automation ${selectedAutomationCode}.`;
  }

  if (selectedStatus === null) {
    return "Aucun job archivé.";
  }

  const statusLabel =
    JOB_STATUS_FILTERS.find((filter) => filter.value === selectedStatus)?.label ??
    selectedStatus;

  return `Aucun job archivé ${statusLabel.toLowerCase()} dans la vue courante.`;
}

export function getArchivedAutomationStatusCount(
  automation: AdminArchivedAutomationSummary,
  status: AdminAutomationJobStatus | null
): number {
  if (status === null) {
    return automation.jobActivity.total;
  }

  if (status === "PENDING") return automation.jobActivity.pending;
  if (status === "RUNNING") return automation.jobActivity.running;
  if (status === "FAILED") return automation.jobActivity.failed;
  if (status === "SUCCEEDED") return automation.jobActivity.succeeded;
  return automation.jobActivity.cancelled;
}

/**
 * Résumé textuel de l'activité jobs archivés (utilisé dans la ligne de
 * détail de chaque automation archivée).
 *
 * Distinct intentionnellement de `formatArchivedActivityBadges`
 * (admin-archived-automations-list.tsx) : les deux lisent le même
 * `jobActivity`, mais celui-ci produit une phrase agrégée tandis que
 * l'autre produit des badges cliquables (liens de filtrage par statut).
 * Pas de fusion pour éviter une abstraction commune sans gain net.
 */
export function getArchivedAutomationJobActivitySummary(
  automation: AdminArchivedAutomationSummary
): string {
  const { jobActivity } = automation;

  if (jobActivity.total === 0) {
    return "Aucun job archivé lié.";
  }

  const parts = [
    jobActivity.total > 1 ? `${jobActivity.total} jobs archivés liés` : "1 job archivé lié",
  ];

  if (jobActivity.pending > 0) {
    parts.push(jobActivity.pending > 1 ? `${jobActivity.pending} en attente` : "1 en attente");
  }

  if (jobActivity.running > 0) {
    parts.push(jobActivity.running > 1 ? `${jobActivity.running} en cours` : "1 en cours");
  }

  if (jobActivity.failed > 0) {
    parts.push(jobActivity.failed > 1 ? `${jobActivity.failed} échoués` : "1 échoué");
  }

  if (jobActivity.succeeded > 0) {
    parts.push(jobActivity.succeeded > 1 ? `${jobActivity.succeeded} réussis` : "1 réussi");
  }

  if (jobActivity.cancelled > 0) {
    parts.push(jobActivity.cancelled > 1 ? `${jobActivity.cancelled} annulés` : "1 annulé");
  }

  return parts.join(" · ");
}

export function getArchivedJobsFilterLabel(input: {
  baseLabel: string;
  status: AdminAutomationJobStatus | null;
  focusedAutomation: AdminArchivedAutomationSummary | null;
}): string {
  if (input.focusedAutomation === null) {
    return input.baseLabel;
  }

  return `${input.baseLabel} (${getArchivedAutomationStatusCount(
    input.focusedAutomation,
    input.status
  )})`;
}
