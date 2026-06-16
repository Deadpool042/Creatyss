import Link from "next/link";

import { Button } from "@/components/ui/button";
import { AdminAutomationCreateForm } from "@/features/admin/marketing/automations/components/admin-automation-create-form";
import { AdminAutomationsList } from "@/features/admin/marketing/automations/components/admin-automations-list";
import type { AdminArchivedAutomationFilter } from "@/features/admin/marketing/automations/shared/admin-automations-archives-filters";
import {
  DEFINITION_FILTERS,
  getDefinitionFilterEmptyMessage,
} from "@/features/admin/marketing/automations/shared/admin-automations-definitions-filters";
import { buildAutomationsPageHref } from "@/features/admin/marketing/automations/shared/admin-automations-page-href";
import type { AdminAutomationJobStatus } from "@/features/admin/marketing/automations/types/admin-automation-job.types";
import type {
  AdminAutomationDefinitionFilter,
  AdminAutomationSummary,
} from "@/features/admin/marketing/automations/types/admin-automation.types";

type AdminAutomationDefinitionsSectionProps = {
  filteredAutomations: ReadonlyArray<AdminAutomationSummary>;
  definitionsCountSummary: string;
  selectedDefinitionLabel: string | null;
  selectedAutomationId: string | null;
  selectedJobStatus: AdminAutomationJobStatus | null;
  selectedDefinitionFilter: AdminAutomationDefinitionFilter | null;
  archivedAutomationId: string | null;
  selectedArchivedJobStatus: AdminAutomationJobStatus | null;
  selectedArchivedDefinitionFilter: AdminArchivedAutomationFilter | null;
};

export function AdminAutomationDefinitionsSection({
  filteredAutomations,
  definitionsCountSummary,
  selectedDefinitionLabel,
  selectedAutomationId,
  selectedJobStatus,
  selectedDefinitionFilter,
  archivedAutomationId,
  selectedArchivedJobStatus,
  selectedArchivedDefinitionFilter,
}: AdminAutomationDefinitionsSectionProps) {
  return (
    <>
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
                    archivedAutomationId,
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
                archivedAutomationId,
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
    </>
  );
}
