import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { Button } from "@/components/ui/button";
import { AdminArchivedAutomationsList } from "@/features/admin/marketing/automations/components/admin-archived-automations-list";
import { AdminArchivedAutomationJobsList } from "@/features/admin/marketing/automations/components/admin-archived-automation-jobs-list";
import { AdminAutomationCreateForm } from "@/features/admin/marketing/automations/components/admin-automation-create-form";
import { AdminAutomationJobsList } from "@/features/admin/marketing/automations/components/admin-automation-jobs-list";
import { AdminAutomationsList } from "@/features/admin/marketing/automations/components/admin-automations-list";
import { listAdminArchivedAutomationJobs } from "@/features/admin/marketing/automations/queries/list-admin-archived-automation-jobs.query";
import { listAdminArchivedAutomations } from "@/features/admin/marketing/automations/queries/list-admin-archived-automations.query";
import { listAdminAutomations } from "@/features/admin/marketing/automations/queries/list-admin-automations.query";
import { listAdminAutomationJobsWithFilter } from "@/features/admin/marketing/automations/queries/list-admin-automation-jobs.query";
import { restoreOriginalAutomationCode } from "@/features/admin/marketing/automations/shared/admin-automation-code";
import type {
  AdminArchivedAutomationSummary,
  AdminAutomationDefinitionFilter,
  AdminAutomationSummary,
} from "@/features/admin/marketing/automations/types/admin-automation.types";
import { isAutomationsFeatureActive } from "@/features/admin/marketing/queries/is-automations-feature-active.query";
import type { AdminAutomationJobStatus } from "@/features/admin/marketing/automations/types/admin-automation-job.types";

export const dynamic = "force-dynamic";

const JOB_STATUS_FILTERS = [
  { value: null, label: "Tous" },
  { value: "PENDING", label: "En attente" },
  { value: "RUNNING", label: "En cours" },
  { value: "FAILED", label: "Échoués" },
  { value: "SUCCEEDED", label: "Réussis" },
  { value: "CANCELLED", label: "Annulés" },
] satisfies ReadonlyArray<{ value: AdminAutomationJobStatus | null; label: string }>;

const ARCHIVED_JOB_STATUS_FILTERS = [
  { value: null, label: "Tous" },
  { value: "PENDING", label: "En attente" },
  { value: "RUNNING", label: "En cours" },
  { value: "FAILED", label: "Échoués" },
  { value: "SUCCEEDED", label: "Réussis" },
  { value: "CANCELLED", label: "Annulés" },
] satisfies ReadonlyArray<{ value: AdminAutomationJobStatus | null; label: string }>;

const DEFINITION_FILTERS = [
  { value: null, label: "Toutes" },
  { value: "with-jobs", label: "Avec jobs" },
  { value: "pending", label: "Avec attente" },
  { value: "running", label: "Avec en cours" },
  { value: "failed", label: "Avec échecs" },
  { value: "without-jobs", label: "Sans job" },
] satisfies ReadonlyArray<{ value: AdminAutomationDefinitionFilter | null; label: string }>;

type AdminArchivedAutomationFilter = "code-released" | "direct-restore";

const ARCHIVED_DEFINITION_FILTERS = [
  { value: null, label: "Toutes" },
  { value: "code-released", label: "Code libéré" },
  { value: "direct-restore", label: "Restauration directe" },
] satisfies ReadonlyArray<{ value: AdminArchivedAutomationFilter | null; label: string }>;

type AdminMarketingAutomationsPageProps = Readonly<{
  searchParams: Promise<{
    automation_created?: string;
    automation_error?: string;
    automation?: string;
    status?: string;
    definition?: string;
    archivedAutomation?: string;
    archivedStatus?: string;
    archivedDefinition?: string;
  }>;
}>;

function getErrorMessage(code: string): string {
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

function parseSelectedJobStatus(input: string | undefined): AdminAutomationJobStatus | null {
  if (
    input === "PENDING" ||
    input === "RUNNING" ||
    input === "FAILED" ||
    input === "SUCCEEDED" ||
    input === "CANCELLED"
  ) {
    return input;
  }

  return null;
}

function parseSelectedDefinitionFilter(
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

function parseSelectedArchivedJobStatus(
  input: string | undefined
): AdminAutomationJobStatus | null {
  if (
    input === "PENDING" ||
    input === "RUNNING" ||
    input === "FAILED" ||
    input === "SUCCEEDED" ||
    input === "CANCELLED"
  ) {
    return input;
  }

  return null;
}

function parseSelectedArchivedDefinitionFilter(
  input: string | undefined
): AdminArchivedAutomationFilter | null {
  if (input === "code-released" || input === "direct-restore") {
    return input;
  }

  return null;
}

function matchesDefinitionFilter(
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

function getDefinitionFilterEmptyMessage(
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

function getDefinitionsCountSummary(input: {
  totalCount: number;
  visibleCount: number;
  selectedDefinitionLabel: string | null;
}): string {
  const visibleLabel =
    input.visibleCount > 1 ? `${input.visibleCount} définitions visibles` : `${input.visibleCount} définition visible`;
  const totalLabel =
    input.totalCount > 1 ? `${input.totalCount} définitions` : `${input.totalCount} définition`;

  if (input.selectedDefinitionLabel) {
    return `${visibleLabel} sur ${totalLabel} pour le filtre ${input.selectedDefinitionLabel.toLowerCase()}.`;
  }

  return `${visibleLabel}.`;
}

function getArchivedAutomationsCountSummary(count: number): string {
  if (count <= 0) {
    return "Aucune automation archivée.";
  }

  if (count === 1) {
    return "1 automation archivée.";
  }

  return `${count} automations archivées.`;
}

function matchesArchivedDefinitionFilter(
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

function getArchivedDefinitionsCountSummary(input: {
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

function getArchivedDefinitionsEmptyStateMessage(
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

function getArchivedDefinitionsFilterCount(
  automations: ReadonlyArray<AdminArchivedAutomationSummary>,
  filter: AdminArchivedAutomationFilter | null
): number {
  return automations.filter((automation) =>
    matchesArchivedDefinitionFilter(automation, filter)
  ).length;
}

function getArchivedDefinitionsFilterLabel(input: {
  baseLabel: string;
  filter: AdminArchivedAutomationFilter | null;
  automations: ReadonlyArray<AdminArchivedAutomationSummary>;
}): string {
  return `${input.baseLabel} (${getArchivedDefinitionsFilterCount(
    input.automations,
    input.filter
  )})`;
}

function getArchivedJobsCountSummary(input: {
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

function getArchivedJobsEmptyStateMessage(
  selectedStatus: AdminAutomationJobStatus | null,
  selectedAutomationCode: string | null
): string {
  if (selectedAutomationCode && selectedStatus) {
    const statusLabel =
      ARCHIVED_JOB_STATUS_FILTERS.find((filter) => filter.value === selectedStatus)?.label ??
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
    ARCHIVED_JOB_STATUS_FILTERS.find((filter) => filter.value === selectedStatus)?.label ??
    selectedStatus;

  return `Aucun job archivé ${statusLabel.toLowerCase()} dans la vue courante.`;
}

function getArchivedAutomationStatusCount(
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

function getArchivedAutomationJobsFocusSummary(
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

function getArchivedJobsFilterLabel(input: {
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

function getActivePageFiltersSummary(input: {
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

function buildAutomationsPageHref(input: {
  automationId?: string | null;
  status?: AdminAutomationJobStatus | null;
  definition?: AdminAutomationDefinitionFilter | null;
  archivedAutomationId?: string | null;
  archivedStatus?: AdminAutomationJobStatus | null;
  archivedDefinition?: AdminArchivedAutomationFilter | null;
  hash?: "automation-jobs" | "archives" | "archived-automations" | "archived-jobs";
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
    ? `/admin/marketing/automations?${query}${hash}`
    : `/admin/marketing/automations${hash}`;
}

export default async function AdminMarketingAutomationsPage({
  searchParams,
}: AdminMarketingAutomationsPageProps) {
  const featureActive = await isAutomationsFeatureActive();
  if (!featureActive) notFound();
  const nowIso = new Date().toISOString();
  const resolvedSearchParams = await searchParams;
  const selectedAutomationId =
    typeof resolvedSearchParams.automation === "string" &&
    resolvedSearchParams.automation.length > 0
      ? resolvedSearchParams.automation
      : null;
  const selectedJobStatus = parseSelectedJobStatus(resolvedSearchParams.status);
  const selectedDefinitionFilter = parseSelectedDefinitionFilter(
    resolvedSearchParams.definition
  );
  const selectedArchivedAutomationId =
    typeof resolvedSearchParams.archivedAutomation === "string" &&
    resolvedSearchParams.archivedAutomation.length > 0
      ? resolvedSearchParams.archivedAutomation
      : null;
  const selectedArchivedJobStatus = parseSelectedArchivedJobStatus(
    resolvedSearchParams.archivedStatus
  );
  const selectedArchivedDefinitionFilter = parseSelectedArchivedDefinitionFilter(
    resolvedSearchParams.archivedDefinition
  );

  const [automations, archivedAutomations, { jobs, stats }, archivedJobs] = await Promise.all([
    listAdminAutomations(),
    listAdminArchivedAutomations(),
    listAdminAutomationJobsWithFilter(25, selectedAutomationId, selectedJobStatus),
    listAdminArchivedAutomationJobs(
      25,
      selectedArchivedAutomationId,
      selectedArchivedJobStatus
    ),
  ]);
  const selectedAutomation =
    automations.find((automation) => automation.id === selectedAutomationId) ?? null;
  const filteredAutomations = automations.filter((automation) =>
    matchesDefinitionFilter(automation, selectedDefinitionFilter)
  );
  const selectedDefinitionLabel =
    DEFINITION_FILTERS.find((filter) => filter.value === selectedDefinitionFilter)?.label ?? null;
  const definitionsCountSummary = getDefinitionsCountSummary({
    totalCount: automations.length,
    visibleCount: filteredAutomations.length,
    selectedDefinitionLabel,
  });
  const archivedAutomationsCountSummary = getArchivedAutomationsCountSummary(
    archivedAutomations.length
  );
  const filteredArchivedAutomations = archivedAutomations.filter((automation) =>
    matchesArchivedDefinitionFilter(automation, selectedArchivedDefinitionFilter)
  );
  const normalizedSelectedArchivedAutomation =
    archivedAutomations.find((automation) => automation.id === selectedArchivedAutomationId) ??
    null;
  const isSelectedArchivedAutomationVisible =
    normalizedSelectedArchivedAutomation === null
      ? false
      : filteredArchivedAutomations.some(
          (automation) => automation.id === normalizedSelectedArchivedAutomation.id
        );
  const selectedArchivedDefinitionLabel =
    ARCHIVED_DEFINITION_FILTERS.find(
      (filter) => filter.value === selectedArchivedDefinitionFilter
    )?.label ?? null;
  const archivedDefinitionsCountSummary = getArchivedDefinitionsCountSummary({
    visibleCount: filteredArchivedAutomations.length,
    totalCount: archivedAutomations.length,
    selectedFilterLabel: selectedArchivedDefinitionLabel,
  });
  const archivedDefinitionsEmptyStateMessage = getArchivedDefinitionsEmptyStateMessage(
    selectedArchivedDefinitionFilter
  );
  const selectedArchivedJobStatusLabel =
    ARCHIVED_JOB_STATUS_FILTERS.find((filter) => filter.value === selectedArchivedJobStatus)
      ?.label ?? null;
  const archivedJobsCountSummary = getArchivedJobsCountSummary({
    visibleCount: archivedJobs.jobs.length,
    totalCount: archivedJobs.totalCount,
    selectedStatusLabel: selectedArchivedJobStatusLabel,
    selectedAutomationCode:
      normalizedSelectedArchivedAutomation === null
        ? null
        : restoreOriginalAutomationCode(normalizedSelectedArchivedAutomation.code),
  });
  const archivedJobsEmptyStateMessage = getArchivedJobsEmptyStateMessage(
    selectedArchivedJobStatus,
    normalizedSelectedArchivedAutomation === null
      ? null
      : restoreOriginalAutomationCode(normalizedSelectedArchivedAutomation.code)
  );
  const isArchivedJobsStatusMaskingFocusedAutomation =
    normalizedSelectedArchivedAutomation !== null &&
    selectedArchivedJobStatus !== null &&
    normalizedSelectedArchivedAutomation.jobActivity.total > 0 &&
    getArchivedAutomationStatusCount(
      normalizedSelectedArchivedAutomation,
      selectedArchivedJobStatus
    ) === 0;
  const hasActiveArchivesFilters =
    normalizedSelectedArchivedAutomation !== null ||
    selectedArchivedJobStatus !== null ||
    selectedArchivedDefinitionFilter !== null;
  const hasActivePageFilters =
    selectedAutomationId !== null ||
    selectedJobStatus !== null ||
    selectedDefinitionFilter !== null ||
    hasActiveArchivesFilters ||
    selectedArchivedJobStatus !== null ||
    selectedArchivedDefinitionFilter !== null;
  const activePageFiltersSummary = getActivePageFiltersSummary({
    selectedAutomationCode: selectedAutomation?.code ?? null,
    selectedJobStatus,
    selectedDefinitionLabel,
    selectedArchivedAutomationCode:
      normalizedSelectedArchivedAutomation === null
        ? null
        : restoreOriginalAutomationCode(normalizedSelectedArchivedAutomation.code),
    selectedArchivedJobStatusLabel,
    selectedArchivedDefinitionLabel,
  });

  return (
    <AdminPageShell
      scrollBehavior="page"
      title="Automations"
      breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Marketing", href: "/admin/marketing/overview" }, { label: "Automations" }]}
      showBreadcrumbsInContent={false}
      showTitleInContent={false}
      contentPreset="table"
    >
      <div className="grid gap-6">
        {resolvedSearchParams.automation_created ? (
          <p className="rounded-lg border border-feedback-success-border bg-feedback-success-surface px-3 py-2 text-sm text-feedback-success-foreground">
            Automation créée.
          </p>
        ) : null}
        {resolvedSearchParams.automation_error ? (
          <p className="rounded-lg border border-feedback-error-border bg-feedback-error-surface px-3 py-2 text-sm text-feedback-error-foreground">
            {getErrorMessage(resolvedSearchParams.automation_error)}
          </p>
        ) : null}
        {hasActivePageFilters ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-surface-border/60 bg-surface-subtle/20 px-4 py-3">
            <p className="text-xs text-foreground">{activePageFiltersSummary}</p>
            <Link
              href={buildAutomationsPageHref({})}
              className="text-xs font-medium text-primary hover:underline"
            >
              Retirer tous les filtres de la page
            </Link>
          </div>
        ) : null}

        <section className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 p-5 shadow-sm">
          <h2 className="mb-1 text-lg font-semibold tracking-tight text-foreground">
            Nouvelle automation
          </h2>
          <p className="mb-4 text-xs text-muted-foreground">
            Référentiel admin des définitions uniquement. Toute automation est
            créée en brouillon ; l&apos;activation ne branche encore aucun
            worker ni envoi provider dans ce lot.
          </p>
          <AdminAutomationCreateForm />
        </section>

        <section className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 p-5 shadow-sm">
          <h2 className="mb-1 text-lg font-semibold tracking-tight text-foreground">
            Définitions d&apos;automation
          </h2>
          <p className="mb-4 text-xs text-muted-foreground">
            Déclencheurs, actions et délais gouvernés au niveau boutique.
            L&apos;exécution réelle reste hors périmètre ; seule la
            planification de jobs sur `NEWSLETTER_SUBSCRIBED` est branchée.
            Désactiver une automation annule aussi ses jobs encore en attente.
            Chaque définition expose aussi un résumé local de ses jobs liés.
          </p>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {DEFINITION_FILTERS.map((filter) => {
              const isActive = selectedDefinitionFilter === filter.value;
              return (
                <Button
                  key={filter.label}
                  asChild
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                >
                  <Link
                    href={buildAutomationsPageHref({
                      automationId: selectedAutomationId,
                      status: selectedJobStatus,
                      definition: filter.value,
                      archivedAutomationId: normalizedSelectedArchivedAutomation?.id ?? null,
                      archivedStatus: selectedArchivedJobStatus,
                      archivedDefinition: selectedArchivedDefinitionFilter,
                    })}
                  >
                    {filter.label}
                  </Link>
                </Button>
              );
            })}
          </div>
          <p className="mb-4 text-xs text-muted-foreground">{definitionsCountSummary}</p>
          {selectedDefinitionLabel ? (
            <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-surface-border/60 bg-surface-subtle/20 px-3 py-2">
              <p className="text-xs text-foreground">
                Filtre définitions :{" "}
                <span className="font-medium">{selectedDefinitionLabel}</span>
              </p>
              <Link
                href={buildAutomationsPageHref({
                  automationId: selectedAutomationId,
                  status: selectedJobStatus,
                  archivedAutomationId: normalizedSelectedArchivedAutomation?.id ?? null,
                  archivedStatus: selectedArchivedJobStatus,
                  archivedDefinition: selectedArchivedDefinitionFilter,
                })}
                className="text-xs font-medium text-primary hover:underline"
              >
                Retirer filtre définitions
              </Link>
            </div>
          ) : null}
          {filteredAutomations.length > 0 ? (
            <AdminAutomationsList
              automations={filteredAutomations}
              selectedAutomationId={selectedAutomationId}
              selectedJobStatus={selectedJobStatus}
              selectedDefinitionFilter={selectedDefinitionFilter}
            />
          ) : (
            <p className="py-10 text-center text-sm text-muted-foreground">
              {getDefinitionFilterEmptyMessage(selectedDefinitionFilter)}
            </p>
          )}
        </section>

        <section
          id="automation-jobs"
          className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 p-5 shadow-sm"
        >
          <h2 className="mb-1 text-lg font-semibold tracking-tight text-foreground">
            Jobs planifiés
          </h2>
          <p className="mb-4 text-xs text-muted-foreground">
            Lecture bornée des jobs créés par le premier déclencheur réel
            `NEWSLETTER_SUBSCRIBED`, avec exécution manuelle locale et trace
            `EmailMessage` quand elle existe. Aucun worker global
            d&apos;exécution n&apos;est branché dans ce lot.
          </p>
          {selectedAutomationId || selectedJobStatus ? (
            <div className="mb-4 flex justify-end">
              <Link
                href={buildAutomationsPageHref({
                  definition: selectedDefinitionFilter,
                  archivedAutomationId: normalizedSelectedArchivedAutomation?.id ?? null,
                  archivedStatus: selectedArchivedJobStatus,
                  archivedDefinition: selectedArchivedDefinitionFilter,
                  hash: "automation-jobs",
                })}
                className="text-xs font-medium text-primary hover:underline"
              >
                Retirer tous les filtres jobs
              </Link>
            </div>
          ) : null}
          {selectedAutomation ? (
            <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-surface-border/60 bg-surface-subtle/30 px-3 py-2">
              <p className="text-xs text-foreground">
                Filtre actif : <span className="font-mono">{selectedAutomation.code}</span>
              </p>
              <Link
                href={buildAutomationsPageHref({
                  status: selectedJobStatus,
                  definition: selectedDefinitionFilter,
                  archivedAutomationId: normalizedSelectedArchivedAutomation?.id ?? null,
                  archivedStatus: selectedArchivedJobStatus,
                  archivedDefinition: selectedArchivedDefinitionFilter,
                  hash: "automation-jobs",
                })}
                className="text-xs font-medium text-primary hover:underline"
              >
                Retirer filtre automation
              </Link>
            </div>
          ) : null}
          {selectedJobStatus ? (
            <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-surface-border/60 bg-surface-subtle/20 px-3 py-2">
              <p className="text-xs text-foreground">
                Statut actif :{" "}
                <span className="font-medium">
                  {JOB_STATUS_FILTERS.find((item) => item.value === selectedJobStatus)?.label}
                </span>
              </p>
              <Link
                href={buildAutomationsPageHref({
                  automationId: selectedAutomationId,
                  definition: selectedDefinitionFilter,
                  archivedAutomationId: normalizedSelectedArchivedAutomation?.id ?? null,
                  archivedStatus: selectedArchivedJobStatus,
                  archivedDefinition: selectedArchivedDefinitionFilter,
                  hash: "automation-jobs",
                })}
                className="text-xs font-medium text-primary hover:underline"
              >
                Retirer filtre statut
              </Link>
            </div>
          ) : null}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {JOB_STATUS_FILTERS.map((filter) => {
              const isActive = selectedJobStatus === filter.value;
              return (
                <Button
                  key={filter.label}
                  asChild
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                >
                  <Link
                    href={buildAutomationsPageHref({
                      automationId: selectedAutomationId,
                      status: filter.value,
                      definition: selectedDefinitionFilter,
                      archivedAutomationId: normalizedSelectedArchivedAutomation?.id ?? null,
                      archivedStatus: selectedArchivedJobStatus,
                      archivedDefinition: selectedArchivedDefinitionFilter,
                      hash: "automation-jobs",
                    })}
                  >
                    {filter.label}
                  </Link>
                </Button>
              );
            })}
          </div>
          <AdminAutomationJobsList
            jobs={jobs}
            stats={stats}
            nowIso={nowIso}
            selectedAutomationId={selectedAutomationId}
            selectedAutomationCode={selectedAutomation?.code ?? null}
            selectedJobStatus={selectedJobStatus}
            selectedDefinitionFilter={selectedDefinitionFilter}
          />
        </section>

        <section
          id="archives"
          className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 p-5 shadow-sm"
        >
          <h2 className="mb-1 text-lg font-semibold tracking-tight text-foreground">
            Archives
          </h2>
          <p className="mb-6 text-xs text-muted-foreground">
            Corbeille locale des définitions et des jobs retirés de la liste active.
            Les restaurations reviennent sur les routes canoniques des réglages, sans
            changer les contrats existants du module.
          </p>
          {hasActiveArchivesFilters ? (
            <div className="mb-6 flex justify-end">
              <Link
                href={buildAutomationsPageHref({
                  automationId: selectedAutomationId,
                  status: selectedJobStatus,
                  definition: selectedDefinitionFilter,
                  hash: "archives",
                })}
                className="text-xs font-medium text-primary hover:underline"
              >
                Retirer tous les filtres archives
              </Link>
            </div>
          ) : null}

          <div className="grid gap-6">
            <section id="archived-automations" className="grid gap-4">
              <div>
                <h3 className="mb-1 text-base font-semibold tracking-tight text-foreground">
                  Automations archivées
                </h3>
                <p className="text-xs text-muted-foreground">
                  Corbeille locale des définitions retirées de la liste active. Une
                  restauration les remet en `INACTIVE`, sur la même route canonique.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {ARCHIVED_DEFINITION_FILTERS.map((filter) => {
                  const isActive = selectedArchivedDefinitionFilter === filter.value;
                  return (
                    <Button
                      key={filter.label}
                      asChild
                      variant={isActive ? "secondary" : "ghost"}
                      size="sm"
                    >
                      <Link
                        href={buildAutomationsPageHref({
                          automationId: selectedAutomationId,
                          status: selectedJobStatus,
                          definition: selectedDefinitionFilter,
                          archivedAutomationId: normalizedSelectedArchivedAutomation?.id ?? null,
                          archivedStatus: selectedArchivedJobStatus,
                          archivedDefinition: filter.value,
                          hash: "archived-automations",
                        })}
                      >
                        {getArchivedDefinitionsFilterLabel({
                          baseLabel: filter.label,
                          filter: filter.value,
                          automations: archivedAutomations,
                        })}
                      </Link>
                    </Button>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground">
                {selectedArchivedDefinitionFilter === null
                  ? archivedAutomationsCountSummary
                  : archivedDefinitionsCountSummary}
              </p>
              {normalizedSelectedArchivedAutomation ? (
                <div className="flex flex-wrap items-center gap-3 rounded-xl border border-surface-border/60 bg-surface-subtle/20 px-3 py-2">
                  <p className="text-xs text-foreground">
                    Focus automation archivée :{" "}
                    <span className="font-mono">
                      {restoreOriginalAutomationCode(normalizedSelectedArchivedAutomation.code)}
                    </span>
                  </p>
                  <Link
                    href={buildAutomationsPageHref({
                      automationId: selectedAutomationId,
                      status: selectedJobStatus,
                      definition: selectedDefinitionFilter,
                      archivedStatus: selectedArchivedJobStatus,
                      archivedDefinition: selectedArchivedDefinitionFilter,
                      hash: "archived-automations",
                    })}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Retirer focus automation archivée
                  </Link>
                </div>
              ) : null}
              {normalizedSelectedArchivedAutomation &&
              selectedArchivedDefinitionLabel &&
              !isSelectedArchivedAutomationVisible ? (
                <div className="flex flex-wrap items-center gap-3 rounded-xl border border-surface-border/60 bg-surface-subtle/20 px-3 py-2">
                  <p className="text-xs text-foreground">
                    Le focus courant est masqué par le filtre{" "}
                    <span className="font-medium">{selectedArchivedDefinitionLabel}</span>.
                  </p>
                  <Link
                    href={buildAutomationsPageHref({
                      automationId: selectedAutomationId,
                      status: selectedJobStatus,
                      definition: selectedDefinitionFilter,
                      archivedAutomationId: normalizedSelectedArchivedAutomation.id,
                      archivedStatus: selectedArchivedJobStatus,
                      hash: "archived-automations",
                    })}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Retirer filtre automations archivées
                  </Link>
                </div>
              ) : null}
              {selectedArchivedDefinitionLabel ? (
                <div className="flex flex-wrap items-center gap-3 rounded-xl border border-surface-border/60 bg-surface-subtle/20 px-3 py-2">
                  <p className="text-xs text-foreground">
                    Filtre automations archivées :{" "}
                    <span className="font-medium">{selectedArchivedDefinitionLabel}</span>
                  </p>
                  <Link
                    href={buildAutomationsPageHref({
                      automationId: selectedAutomationId,
                      status: selectedJobStatus,
                      definition: selectedDefinitionFilter,
                      archivedAutomationId: normalizedSelectedArchivedAutomation?.id ?? null,
                      archivedStatus: selectedArchivedJobStatus,
                      hash: "archived-automations",
                    })}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Retirer filtre automations archivées
                  </Link>
                </div>
              ) : null}
              <AdminArchivedAutomationsList
                automations={filteredArchivedAutomations}
                emptyMessage={archivedDefinitionsEmptyStateMessage}
                selectedAutomationId={selectedAutomationId}
                selectedJobStatus={selectedJobStatus}
                selectedDefinitionFilter={selectedDefinitionFilter}
                selectedArchivedAutomationId={normalizedSelectedArchivedAutomation?.id ?? null}
                selectedArchivedJobStatus={selectedArchivedJobStatus}
                selectedArchivedDefinitionFilter={selectedArchivedDefinitionFilter}
              />
            </section>

            <section
              id="archived-jobs"
              className="grid gap-4 border-t border-surface-border/50 pt-6"
            >
              <div>
                <h3 className="mb-1 text-base font-semibold tracking-tight text-foreground">
                  Jobs archivés
                </h3>
                <p className="text-xs text-muted-foreground">
                  Corbeille locale des jobs retirés de la liste active. Un job
                  supprimé alors qu&apos;il était encore en attente peut revenir en
                  `PENDING` si son automation liée est toujours `ACTIVE` ; sinon il
                  redevient simplement visible dans la liste active.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {ARCHIVED_JOB_STATUS_FILTERS.map((filter) => {
                  const isActive = selectedArchivedJobStatus === filter.value;
                  return (
                    <Button
                      key={filter.label}
                      asChild
                      variant={isActive ? "secondary" : "ghost"}
                      size="sm"
                    >
                      <Link
                        href={buildAutomationsPageHref({
                          automationId: selectedAutomationId,
                          status: selectedJobStatus,
                          definition: selectedDefinitionFilter,
                          archivedAutomationId: normalizedSelectedArchivedAutomation?.id ?? null,
                          archivedStatus: filter.value,
                          archivedDefinition: selectedArchivedDefinitionFilter,
                          hash: "archived-jobs",
                        })}
                      >
                        {getArchivedJobsFilterLabel({
                          baseLabel: filter.label,
                          status: filter.value,
                          focusedAutomation: normalizedSelectedArchivedAutomation,
                        })}
                      </Link>
                    </Button>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground">{archivedJobsCountSummary}</p>
              {normalizedSelectedArchivedAutomation ? (
                <div className="flex flex-wrap items-center gap-3 rounded-xl border border-surface-border/60 bg-surface-subtle/20 px-3 py-2">
                  <p className="text-xs text-foreground">
                    Filtre automation archivée :{" "}
                    <span className="font-mono">
                      {restoreOriginalAutomationCode(normalizedSelectedArchivedAutomation.code)}
                    </span>
                  </p>
                  <Link
                    href={buildAutomationsPageHref({
                      automationId: selectedAutomationId,
                      status: selectedJobStatus,
                      definition: selectedDefinitionFilter,
                      archivedStatus: selectedArchivedJobStatus,
                      archivedDefinition: selectedArchivedDefinitionFilter,
                      hash: "archived-jobs",
                    })}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Retirer filtre automation archivée
                  </Link>
                </div>
              ) : null}
              {normalizedSelectedArchivedAutomation ? (
                <p className="text-xs text-muted-foreground">
                  {getArchivedAutomationJobsFocusSummary(normalizedSelectedArchivedAutomation)}
                </p>
              ) : null}
              {selectedArchivedJobStatusLabel ? (
                <div className="flex flex-wrap items-center gap-3 rounded-xl border border-surface-border/60 bg-surface-subtle/20 px-3 py-2">
                  <p className="text-xs text-foreground">
                    Filtre archives jobs :{" "}
                    <span className="font-medium">{selectedArchivedJobStatusLabel}</span>
                  </p>
                  <Link
                    href={buildAutomationsPageHref({
                      automationId: selectedAutomationId,
                      status: selectedJobStatus,
                      definition: selectedDefinitionFilter,
                      archivedAutomationId: normalizedSelectedArchivedAutomation?.id ?? null,
                      archivedDefinition: selectedArchivedDefinitionFilter,
                      hash: "archived-jobs",
                    })}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Retirer filtre archives jobs
                  </Link>
                </div>
              ) : null}
              {isArchivedJobsStatusMaskingFocusedAutomation &&
              normalizedSelectedArchivedAutomation ? (
                <div className="flex flex-wrap items-center gap-3 rounded-xl border border-surface-border/60 bg-surface-subtle/20 px-3 py-2">
                  <p className="text-xs text-foreground">
                    L'automation{" "}
                    <span className="font-mono">
                      {restoreOriginalAutomationCode(normalizedSelectedArchivedAutomation.code)}
                    </span>{" "}
                    a bien des jobs archivés, mais aucun pour le statut{" "}
                    <span className="font-medium">{selectedArchivedJobStatusLabel}</span>.
                  </p>
                  <Link
                    href={buildAutomationsPageHref({
                      automationId: selectedAutomationId,
                      status: selectedJobStatus,
                      definition: selectedDefinitionFilter,
                      archivedAutomationId: normalizedSelectedArchivedAutomation.id,
                      archivedDefinition: selectedArchivedDefinitionFilter,
                      hash: "archived-jobs",
                    })}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Retirer filtre archives jobs
                  </Link>
                </div>
              ) : null}
              <AdminArchivedAutomationJobsList
                jobs={archivedJobs.jobs}
                totalCount={archivedJobs.totalCount}
                emptyMessage={archivedJobsEmptyStateMessage}
                selectedAutomationId={selectedAutomationId}
                selectedJobStatus={selectedJobStatus}
                selectedDefinitionFilter={selectedDefinitionFilter}
                selectedArchivedAutomationId={normalizedSelectedArchivedAutomation?.id ?? null}
                selectedArchivedJobStatus={selectedArchivedJobStatus}
                selectedArchivedDefinitionFilter={selectedArchivedDefinitionFilter}
              />
            </section>
          </div>
        </section>
      </div>
    </AdminPageShell>
  );
}
