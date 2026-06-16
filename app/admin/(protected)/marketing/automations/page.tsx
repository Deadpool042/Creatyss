import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { AdminArchivedAutomationJobsSection } from "@/features/admin/marketing/automations/components/admin-archived-automation-jobs-section";
import { AdminArchivedAutomationsSection } from "@/features/admin/marketing/automations/components/admin-archived-automations-section";
import { AdminAutomationDefinitionsSection } from "@/features/admin/marketing/automations/components/admin-automation-definitions-section";
import { AdminAutomationJobsSection } from "@/features/admin/marketing/automations/components/admin-automation-jobs-section";
import { listAdminArchivedAutomationJobs } from "@/features/admin/marketing/automations/queries/list-admin-archived-automation-jobs.query";
import { listAdminArchivedAutomations } from "@/features/admin/marketing/automations/queries/list-admin-archived-automations.query";
import { listAdminAutomations } from "@/features/admin/marketing/automations/queries/list-admin-automations.query";
import { listAdminAutomationJobsWithFilter } from "@/features/admin/marketing/automations/queries/list-admin-automation-jobs.query";
import { restoreOriginalAutomationCode } from "@/features/admin/marketing/automations/shared/admin-automation-code";
import {
  ARCHIVED_DEFINITION_FILTERS,
  getArchivedAutomationsCountSummary,
  getArchivedAutomationStatusCount,
  getArchivedDefinitionsCountSummary,
  getArchivedDefinitionsEmptyStateMessage,
  getArchivedJobsCountSummary,
  getArchivedJobsEmptyStateMessage,
  matchesArchivedDefinitionFilter,
  parseSelectedArchivedDefinitionFilter,
} from "@/features/admin/marketing/automations/shared/admin-automations-archives-filters";
import {
  DEFINITION_FILTERS,
  getDefinitionsCountSummary,
  matchesDefinitionFilter,
  parseSelectedDefinitionFilter,
} from "@/features/admin/marketing/automations/shared/admin-automations-definitions-filters";
import {
  JOB_STATUS_FILTERS,
  parseSelectedJobStatus,
} from "@/features/admin/marketing/automations/shared/admin-automations-jobs-filters";
import { buildAutomationsPageHref } from "@/features/admin/marketing/automations/shared/admin-automations-page-href";
import {
  getActivePageFiltersSummary,
  getErrorMessage,
} from "@/features/admin/marketing/automations/shared/admin-automations-page-summary";
import { isAutomationsFeatureActive } from "@/features/admin/marketing/queries/is-automations-feature-active.query";

export const dynamic = "force-dynamic";

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
  const selectedDefinitionFilter = parseSelectedDefinitionFilter(resolvedSearchParams.definition);
  const selectedArchivedAutomationId =
    typeof resolvedSearchParams.archivedAutomation === "string" &&
    resolvedSearchParams.archivedAutomation.length > 0
      ? resolvedSearchParams.archivedAutomation
      : null;
  const selectedArchivedJobStatus = parseSelectedJobStatus(resolvedSearchParams.archivedStatus);
  const selectedArchivedDefinitionFilter = parseSelectedArchivedDefinitionFilter(
    resolvedSearchParams.archivedDefinition
  );

  const [automations, archivedAutomations, { jobs, stats }, archivedJobs] = await Promise.all([
    listAdminAutomations(),
    listAdminArchivedAutomations(),
    listAdminAutomationJobsWithFilter(25, selectedAutomationId, selectedJobStatus),
    listAdminArchivedAutomationJobs(25, selectedArchivedAutomationId, selectedArchivedJobStatus),
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
    ARCHIVED_DEFINITION_FILTERS.find((filter) => filter.value === selectedArchivedDefinitionFilter)
      ?.label ?? null;
  const archivedDefinitionsCountSummary = getArchivedDefinitionsCountSummary({
    visibleCount: filteredArchivedAutomations.length,
    totalCount: archivedAutomations.length,
    selectedFilterLabel: selectedArchivedDefinitionLabel,
  });
  const archivedDefinitionsEmptyStateMessage = getArchivedDefinitionsEmptyStateMessage(
    selectedArchivedDefinitionFilter
  );
  const selectedArchivedJobStatusLabel =
    JOB_STATUS_FILTERS.find((filter) => filter.value === selectedArchivedJobStatus)?.label ?? null;
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
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Marketing", href: "/admin/marketing/overview" },
        { label: "Automations" },
      ]}
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

        <AdminAutomationDefinitionsSection
          filteredAutomations={filteredAutomations}
          definitionsCountSummary={definitionsCountSummary}
          selectedDefinitionLabel={selectedDefinitionLabel}
          selectedAutomationId={selectedAutomationId}
          selectedJobStatus={selectedJobStatus}
          selectedDefinitionFilter={selectedDefinitionFilter}
          archivedAutomationId={normalizedSelectedArchivedAutomation?.id ?? null}
          selectedArchivedJobStatus={selectedArchivedJobStatus}
          selectedArchivedDefinitionFilter={selectedArchivedDefinitionFilter}
        />

        <AdminAutomationJobsSection
          jobs={jobs}
          stats={stats}
          nowIso={nowIso}
          selectedAutomationId={selectedAutomationId}
          selectedAutomationCode={selectedAutomation?.code ?? null}
          selectedJobStatus={selectedJobStatus}
          selectedDefinitionFilter={selectedDefinitionFilter}
          archivedAutomationId={normalizedSelectedArchivedAutomation?.id ?? null}
          selectedArchivedJobStatus={selectedArchivedJobStatus}
          selectedArchivedDefinitionFilter={selectedArchivedDefinitionFilter}
        />

        <section
          id="archives"
          className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 p-5 shadow-sm"
        >
          <h2 className="mb-1 text-lg font-semibold tracking-tight text-foreground">Archives</h2>
          <p className="mb-6 text-xs text-muted-foreground">
            Corbeille locale des définitions et des jobs retirés de la liste active. Les
            restaurations reviennent sur les routes canoniques des réglages, sans changer les
            contrats existants du module.
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
            <AdminArchivedAutomationsSection
              archivedAutomations={archivedAutomations}
              filteredArchivedAutomations={filteredArchivedAutomations}
              archivedAutomationsCountSummary={archivedAutomationsCountSummary}
              archivedDefinitionsCountSummary={archivedDefinitionsCountSummary}
              archivedDefinitionsEmptyStateMessage={archivedDefinitionsEmptyStateMessage}
              selectedArchivedDefinitionLabel={selectedArchivedDefinitionLabel}
              isSelectedArchivedAutomationVisible={isSelectedArchivedAutomationVisible}
              normalizedSelectedArchivedAutomation={normalizedSelectedArchivedAutomation}
              selectedAutomationId={selectedAutomationId}
              selectedJobStatus={selectedJobStatus}
              selectedDefinitionFilter={selectedDefinitionFilter}
              selectedArchivedJobStatus={selectedArchivedJobStatus}
              selectedArchivedDefinitionFilter={selectedArchivedDefinitionFilter}
            />

            <AdminArchivedAutomationJobsSection
              archivedJobs={archivedJobs}
              archivedJobsCountSummary={archivedJobsCountSummary}
              archivedJobsEmptyStateMessage={archivedJobsEmptyStateMessage}
              selectedArchivedJobStatusLabel={selectedArchivedJobStatusLabel}
              isArchivedJobsStatusMaskingFocusedAutomation={
                isArchivedJobsStatusMaskingFocusedAutomation
              }
              normalizedSelectedArchivedAutomation={normalizedSelectedArchivedAutomation}
              selectedAutomationId={selectedAutomationId}
              selectedJobStatus={selectedJobStatus}
              selectedDefinitionFilter={selectedDefinitionFilter}
              selectedArchivedJobStatus={selectedArchivedJobStatus}
              selectedArchivedDefinitionFilter={selectedArchivedDefinitionFilter}
            />
          </div>
        </section>
      </div>
    </AdminPageShell>
  );
}
