import Link from "next/link";

import { Button } from "@/components/ui/button";
import { AdminArchivedAutomationJobsList } from "@/features/admin/marketing/automations/components/admin-archived-automation-jobs-list";
import { restoreOriginalAutomationCode } from "@/features/admin/marketing/automations/shared/admin-automation-code";
import {
  getArchivedAutomationJobActivitySummary,
  getArchivedJobsFilterLabel,
  type AdminArchivedAutomationFilter,
} from "@/features/admin/marketing/automations/shared/admin-automations-archives-filters";
import { JOB_STATUS_FILTERS } from "@/features/admin/marketing/automations/shared/admin-automations-jobs-filters";
import { buildAutomationsPageHref } from "@/features/admin/marketing/automations/shared/admin-automations-page-href";
import type {
  AdminArchivedAutomationJobSummary,
  AdminAutomationJobStatus,
} from "@/features/admin/marketing/automations/types/admin-automation-job.types";
import type {
  AdminArchivedAutomationSummary,
  AdminAutomationDefinitionFilter,
} from "@/features/admin/marketing/automations/types/admin-automation.types";

type AdminArchivedAutomationJobsSectionProps = {
  archivedJobs: {
    jobs: ReadonlyArray<AdminArchivedAutomationJobSummary>;
    totalCount: number;
  };
  archivedJobsCountSummary: string;
  archivedJobsEmptyStateMessage: string;
  selectedArchivedJobStatusLabel: string | null;
  isArchivedJobsStatusMaskingFocusedAutomation: boolean;
  normalizedSelectedArchivedAutomation: AdminArchivedAutomationSummary | null;
  selectedAutomationId: string | null;
  selectedJobStatus: AdminAutomationJobStatus | null;
  selectedDefinitionFilter: AdminAutomationDefinitionFilter | null;
  selectedArchivedJobStatus: AdminAutomationJobStatus | null;
  selectedArchivedDefinitionFilter: AdminArchivedAutomationFilter | null;
};

export function AdminArchivedAutomationJobsSection({
  archivedJobs,
  archivedJobsCountSummary,
  archivedJobsEmptyStateMessage,
  selectedArchivedJobStatusLabel,
  isArchivedJobsStatusMaskingFocusedAutomation,
  normalizedSelectedArchivedAutomation,
  selectedAutomationId,
  selectedJobStatus,
  selectedDefinitionFilter,
  selectedArchivedJobStatus,
  selectedArchivedDefinitionFilter,
}: AdminArchivedAutomationJobsSectionProps) {
  return (
    <section id="archived-jobs" className="grid gap-4 border-t border-surface-border/50 pt-6">
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
        {JOB_STATUS_FILTERS.map((filter) => {
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
          {getArchivedAutomationJobActivitySummary(normalizedSelectedArchivedAutomation)}
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
  );
}
