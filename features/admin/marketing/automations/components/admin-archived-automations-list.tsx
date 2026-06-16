"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { restoreAutomationAction } from "@/features/admin/marketing/automations/actions/restore-automation.action";
import { restoreAutomationsBatchAction } from "@/features/admin/marketing/automations/actions/restore-automations-batch.action";
import { restoreOriginalAutomationCode } from "@/features/admin/marketing/automations/shared/admin-automation-code";
import {
  AUTOMATION_ACTION_LABELS,
  AUTOMATION_TRIGGER_LABELS,
} from "@/features/admin/marketing/automations/shared/admin-automation-options";
import { getArchivedAutomationJobActivitySummary } from "@/features/admin/marketing/automations/shared/admin-automations-archives-filters";
import { buildAutomationsPageHref } from "@/features/admin/marketing/automations/shared/admin-automations-page-href";
import type {
  AdminArchivedAutomationSummary,
  AdminAutomationDefinitionFilter,
} from "@/features/admin/marketing/automations/types/admin-automation.types";
import type { AdminAutomationJobStatus } from "@/features/admin/marketing/automations/types/admin-automation-job.types";
import { cn } from "@/lib/utils";

type AdminArchivedAutomationsListProps = {
  automations: ReadonlyArray<AdminArchivedAutomationSummary>;
  emptyMessage?: string;
  selectedAutomationId: string | null;
  selectedJobStatus: AdminAutomationJobStatus | null;
  selectedDefinitionFilter: AdminAutomationDefinitionFilter | null;
  selectedArchivedAutomationId: string | null;
  selectedArchivedJobStatus: AdminAutomationJobStatus | null;
  selectedArchivedDefinitionFilter: "code-released" | "direct-restore" | null;
};

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" });
const dateTimeFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

/**
 * Badges cliquables (liens de filtrage par statut) pour l'activité jobs
 * archivés d'une automation.
 *
 * Distinct intentionnellement de `getArchivedAutomationJobActivitySummary`
 * (shared/admin-automations-archives-filters.ts) : même `jobActivity` en
 * entrée, mais sortie structurée pour des liens plutôt qu'une phrase
 * résumée. Pas de fusion pour éviter une abstraction commune sans gain net.
 */
function formatArchivedActivityBadges(automation: AdminArchivedAutomationSummary): Array<{
  label: string;
  status: AdminAutomationJobStatus | null;
}> {
  const items: Array<{ label: string; status: AdminAutomationJobStatus | null }> = [];

  if (automation.jobActivity.pending > 0) {
    items.push({
      label: `${automation.jobActivity.pending} en attente`,
      status: "PENDING",
    });
  }

  if (automation.jobActivity.running > 0) {
    items.push({
      label: `${automation.jobActivity.running} en cours`,
      status: "RUNNING",
    });
  }

  if (automation.jobActivity.failed > 0) {
    items.push({
      label: `${automation.jobActivity.failed} échoué(s)`,
      status: "FAILED",
    });
  }

  if (automation.jobActivity.succeeded > 0) {
    items.push({
      label: `${automation.jobActivity.succeeded} réussi(s)`,
      status: "SUCCEEDED",
    });
  }

  if (automation.jobActivity.cancelled > 0) {
    items.push({
      label: `${automation.jobActivity.cancelled} annulé(s)`,
      status: "CANCELLED",
    });
  }

  if (automation.jobActivity.total > 0) {
    items.push({
      label: `${automation.jobActivity.total} job(s)`,
      status: null,
    });
  }

  return items;
}

function formatDelay(delayMinutes: number): string {
  if (delayMinutes <= 0) {
    return "Immédiat";
  }

  if (delayMinutes < 60) {
    return `${delayMinutes} min`;
  }

  const hours = Math.floor(delayMinutes / 60);
  const minutes = delayMinutes % 60;

  if (minutes === 0) {
    return `${hours} h`;
  }

  return `${hours} h ${minutes} min`;
}

function ArchivedAutomationRow({
  automation,
  selectedAutomationId,
  selectedJobStatus,
  selectedDefinitionFilter,
  selectedArchivedAutomationId,
  selectedArchivedJobStatus,
  selectedArchivedDefinitionFilter,
}: {
  automation: AdminArchivedAutomationSummary;
  selectedAutomationId: string | null;
  selectedJobStatus: AdminAutomationJobStatus | null;
  selectedDefinitionFilter: AdminAutomationDefinitionFilter | null;
  selectedArchivedAutomationId: string | null;
  selectedArchivedJobStatus: AdminAutomationJobStatus | null;
  selectedArchivedDefinitionFilter: "code-released" | "direct-restore" | null;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  const originalCode = restoreOriginalAutomationCode(automation.code);
  const codeWasFreed = automation.code !== originalCode;
  const activityBadges = formatArchivedActivityBadges(automation);
  const archivedJobsHref =
    automation.jobActivity.total > 0
      ? buildAutomationsPageHref({
          automationId: selectedAutomationId,
          status: selectedJobStatus,
          definition: selectedDefinitionFilter,
          archivedAutomationId: automation.id,
          archivedStatus: selectedArchivedJobStatus,
          archivedDefinition: selectedArchivedDefinitionFilter,
          hash: "archived-jobs",
        })
      : null;
  const isArchivedAutomationFocused = selectedArchivedAutomationId === automation.id;

  function handleRestore(): void {
    const confirmed = window.confirm(
      `Restaurer l'automation "${originalCode}" dans la liste active ?`
    );

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      setFeedbackError(null);
      setFeedbackMessage(null);

      const result = await restoreAutomationAction(automation.id);

      if (!result.ok) {
        setFeedbackError(result.error);
        return;
      }

      setFeedbackMessage(
        result.usedFallbackCode
          ? `Automation restaurée en INACTIVE sous le code ${result.restoredCode}.`
          : "Automation restaurée en INACTIVE."
      );
      router.refresh();
    });
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between",
        isArchivedAutomationFocused ? "bg-surface-subtle/30 px-3" : ""
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-sm font-semibold text-foreground">{originalCode}</span>
          <Badge variant="destructive">Archivée</Badge>
          {isArchivedAutomationFocused ? <Badge variant="secondary">Focus actif</Badge> : null}
          {codeWasFreed ? <Badge variant="outline">Code libéré pour recréation</Badge> : null}
        </div>
        <p className="truncate text-sm font-medium text-foreground">{automation.name}</p>
        {automation.description ? (
          <p className="text-xs text-muted-foreground">{automation.description}</p>
        ) : null}
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span>Déclencheur : {AUTOMATION_TRIGGER_LABELS[automation.triggerType]}</span>
          <span>Action : {AUTOMATION_ACTION_LABELS[automation.actionType]}</span>
          <span>Délai : {formatDelay(automation.delayMinutes)}</span>
          <span>Créée le {dateFormatter.format(new Date(automation.createdAt))}</span>
          <span>Archivée le {dateTimeFormatter.format(new Date(automation.archivedAt))}</span>
          {automation.templateCode ? <span>Template : {automation.templateCode}</span> : null}
        </div>
        <p className="text-xs text-muted-foreground/70">
          {getArchivedAutomationJobActivitySummary(automation)}
        </p>
        {activityBadges.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {activityBadges.map((item) => {
              const isActiveStatus =
                isArchivedAutomationFocused && selectedArchivedJobStatus === item.status;

              return (
                <Link
                  key={`${item.label}-${item.status ?? "all"}`}
                  href={buildAutomationsPageHref({
                    automationId: selectedAutomationId,
                    status: selectedJobStatus,
                    definition: selectedDefinitionFilter,
                    archivedAutomationId: automation.id,
                    archivedStatus: item.status,
                    archivedDefinition: selectedArchivedDefinitionFilter,
                    hash: "archived-jobs",
                  })}
                  className={cn(
                    "rounded-full border border-surface-border/60 px-2 py-0.5 text-muted-foreground transition-colors hover:border-control-border-strong hover:bg-surface-subtle/40",
                    isActiveStatus
                      ? "border-control-border-strong bg-surface-subtle/40 text-foreground"
                      : ""
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        ) : null}
        {archivedJobsHref ? (
          <Link
            href={archivedJobsHref}
            className={
              isArchivedAutomationFocused
                ? "text-xs font-medium text-foreground underline underline-offset-2"
                : "text-xs font-medium text-primary hover:underline"
            }
          >
            {isArchivedAutomationFocused
              ? "Focus archives jobs actif"
              : "Voir les jobs archivés liés"}
          </Link>
        ) : null}
        {feedbackMessage ? (
          <p className="text-xs text-feedback-success-foreground">{feedbackMessage}</p>
        ) : null}
        {feedbackError ? (
          <p className="text-xs text-feedback-error-foreground">{feedbackError}</p>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" variant="outline" size="sm" disabled={isPending} onClick={handleRestore}>
          Restaurer
        </Button>
      </div>
    </div>
  );
}

export function AdminArchivedAutomationsList({
  automations,
  emptyMessage,
  selectedAutomationId,
  selectedJobStatus,
  selectedDefinitionFilter,
  selectedArchivedAutomationId,
  selectedArchivedJobStatus,
  selectedArchivedDefinitionFilter,
}: AdminArchivedAutomationsListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const focusedAutomation =
    selectedArchivedAutomationId === null
      ? null
      : automations.find((automation) => automation.id === selectedArchivedAutomationId) ?? null;

  if (automations.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        {emptyMessage ?? "Aucune automation archivée."}
      </p>
    );
  }

  function handleBatchRestore(): void {
    const confirmed = window.confirm(
      `Restaurer les ${automations.length} automations archivées visibles dans la liste active ?`
    );

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      setMessage(null);
      setError(null);

      const result = await restoreAutomationsBatchAction(
        automations.map((automation) => automation.id)
      );

      if (!result.ok) {
        setError(result.error);
        return;
      }

      const parts = [`${result.restoredCount} restauration(s)`];

      if (result.fallbackCount > 0) {
        parts.push(`${result.fallbackCount} avec code de repli`);
      }

      if (result.failedCount > 0) {
        parts.push(`${result.failedCount} ignorée(s)`);
      }

      setMessage(parts.join(" · "));
      router.refresh();
    });
  }

  return (
    <div className="grid gap-4">
      {focusedAutomation ? (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-surface-border/60 bg-surface-subtle/20 px-3 py-2">
          <p className="text-xs text-foreground">
            Focus automation archivée :{" "}
            <span className="font-mono">
              {restoreOriginalAutomationCode(focusedAutomation.code)}
            </span>
          </p>
        </div>
      ) : null}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          Restaurer en lot les automations archivées visibles.
        </p>
        <Button type="button" variant="outline" size="sm" disabled={isPending} onClick={handleBatchRestore}>
          Restaurer les {automations.length} visibles
        </Button>
      </div>
      {message ? <p className="text-xs text-feedback-success-foreground">{message}</p> : null}
      {error ? <p className="text-xs text-feedback-error-foreground">{error}</p> : null}
      <div className="divide-y divide-surface-border/40">
        {automations.map((automation) => (
          <ArchivedAutomationRow
            key={automation.id}
            automation={automation}
            selectedAutomationId={selectedAutomationId}
            selectedJobStatus={selectedJobStatus}
            selectedDefinitionFilter={selectedDefinitionFilter}
            selectedArchivedAutomationId={selectedArchivedAutomationId}
            selectedArchivedJobStatus={selectedArchivedJobStatus}
            selectedArchivedDefinitionFilter={selectedArchivedDefinitionFilter}
          />
        ))}
      </div>
    </div>
  );
}
