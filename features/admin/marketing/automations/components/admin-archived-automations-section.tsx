import Link from "next/link";

import { Button } from "@/components/ui/button";
import { AdminArchivedAutomationsList } from "@/features/admin/marketing/automations/components/admin-archived-automations-list";
import { restoreOriginalAutomationCode } from "@/features/admin/marketing/automations/shared/admin-automation-code";
import {
  ARCHIVED_DEFINITION_FILTERS,
  getArchivedDefinitionsFilterLabel,
  type AdminArchivedAutomationFilter,
} from "@/features/admin/marketing/automations/shared/admin-automations-archives-filters";
import { buildAutomationsPageHref } from "@/features/admin/marketing/automations/shared/admin-automations-page-href";
import type { AdminAutomationJobStatus } from "@/features/admin/marketing/automations/types/admin-automation-job.types";
import type {
  AdminArchivedAutomationSummary,
  AdminAutomationDefinitionFilter,
} from "@/features/admin/marketing/automations/types/admin-automation.types";

type AdminArchivedAutomationsSectionProps = {
  archivedAutomations: ReadonlyArray<AdminArchivedAutomationSummary>;
  filteredArchivedAutomations: ReadonlyArray<AdminArchivedAutomationSummary>;
  archivedAutomationsCountSummary: string;
  archivedDefinitionsCountSummary: string;
  archivedDefinitionsEmptyStateMessage: string;
  selectedArchivedDefinitionLabel: string | null;
  isSelectedArchivedAutomationVisible: boolean;
  normalizedSelectedArchivedAutomation: AdminArchivedAutomationSummary | null;
  selectedAutomationId: string | null;
  selectedJobStatus: AdminAutomationJobStatus | null;
  selectedDefinitionFilter: AdminAutomationDefinitionFilter | null;
  selectedArchivedJobStatus: AdminAutomationJobStatus | null;
  selectedArchivedDefinitionFilter: AdminArchivedAutomationFilter | null;
};

export function AdminArchivedAutomationsSection({
  archivedAutomations,
  filteredArchivedAutomations,
  archivedAutomationsCountSummary,
  archivedDefinitionsCountSummary,
  archivedDefinitionsEmptyStateMessage,
  selectedArchivedDefinitionLabel,
  isSelectedArchivedAutomationVisible,
  normalizedSelectedArchivedAutomation,
  selectedAutomationId,
  selectedJobStatus,
  selectedDefinitionFilter,
  selectedArchivedJobStatus,
  selectedArchivedDefinitionFilter,
}: AdminArchivedAutomationsSectionProps) {
  return (
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
  );
}
