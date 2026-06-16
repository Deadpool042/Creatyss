import Link from "next/link";

import { Button } from "@/components/ui/button";
import { AdminAutomationJobsList } from "@/features/admin/marketing/automations/components/admin-automation-jobs-list";
import type { AdminArchivedAutomationFilter } from "@/features/admin/marketing/automations/shared/admin-automations-archives-filters";
import { getJobsCountSummary } from "@/features/admin/marketing/automations/shared/admin-automation-jobs-list-helpers";
import { JOB_STATUS_FILTERS } from "@/features/admin/marketing/automations/shared/admin-automations-jobs-filters";
import { buildAutomationsPageHref } from "@/features/admin/marketing/automations/shared/admin-automations-page-href";
import type {
  AdminAutomationJobsStats,
  AdminAutomationJobStatus,
  AdminAutomationJobSummary,
} from "@/features/admin/marketing/automations/types/admin-automation-job.types";
import type { AdminAutomationDefinitionFilter } from "@/features/admin/marketing/automations/types/admin-automation.types";

type AdminAutomationJobsSectionProps = {
  jobs: ReadonlyArray<AdminAutomationJobSummary>;
  stats: AdminAutomationJobsStats;
  nowIso: string;
  selectedAutomationId: string | null;
  selectedAutomationCode: string | null;
  selectedJobStatus: AdminAutomationJobStatus | null;
  selectedDefinitionFilter: AdminAutomationDefinitionFilter | null;
  archivedAutomationId: string | null;
  selectedArchivedJobStatus: AdminAutomationJobStatus | null;
  selectedArchivedDefinitionFilter: AdminArchivedAutomationFilter | null;
};

export function AdminAutomationJobsSection({
  jobs,
  stats,
  nowIso,
  selectedAutomationId,
  selectedAutomationCode,
  selectedJobStatus,
  selectedDefinitionFilter,
  archivedAutomationId,
  selectedArchivedJobStatus,
  selectedArchivedDefinitionFilter,
}: AdminAutomationJobsSectionProps) {
  const jobsCountSummary = getJobsCountSummary({
    visibleCount: jobs.length,
    totalCount: stats.total,
  });

  return (
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
              archivedAutomationId,
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
      {selectedAutomationCode ? (
        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-surface-border/60 bg-surface-subtle/30 px-3 py-2">
          <p className="text-xs text-foreground">
            Filtre actif : <span className="font-mono">{selectedAutomationCode}</span>
          </p>
          <Link
            href={buildAutomationsPageHref({
              status: selectedJobStatus,
              definition: selectedDefinitionFilter,
              archivedAutomationId,
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
              archivedAutomationId,
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
                  archivedAutomationId,
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
      <p className="mb-4 text-xs text-muted-foreground">{jobsCountSummary}</p>
      <AdminAutomationJobsList
        jobs={jobs}
        stats={stats}
        nowIso={nowIso}
        selectedAutomationId={selectedAutomationId}
        selectedAutomationCode={selectedAutomationCode}
        selectedJobStatus={selectedJobStatus}
        selectedDefinitionFilter={selectedDefinitionFilter}
      />
    </section>
  );
}
