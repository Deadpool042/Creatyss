"use client";

import Link from "next/link";
import { AlertCircle, CheckCircle2, Clock, Loader2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { restoreAutomationJobAction } from "@/features/admin/marketing/automations/actions/restore-automation-job.action";
import { restoreAutomationJobsBatchAction } from "@/features/admin/marketing/automations/actions/restore-automation-jobs-batch.action";
import { ADMIN_AUTOMATIONS_PATH } from "@/features/admin/marketing/automations/shared/admin-automations-routes";
import {
  AUTOMATION_ACTION_LABELS,
  AUTOMATION_TRIGGER_LABELS,
} from "@/features/admin/marketing/automations/shared/admin-automation-options";
import type {
  AdminArchivedAutomationJobSummary,
  AdminAutomationJobStatus,
} from "@/features/admin/marketing/automations/types/admin-automation-job.types";
import type { AdminAutomationDefinitionFilter } from "@/features/admin/marketing/automations/types/admin-automation.types";
import { cn } from "@/lib/utils";

type AdminArchivedAutomationJobsListProps = {
  jobs: ReadonlyArray<AdminArchivedAutomationJobSummary>;
  totalCount: number;
  emptyMessage?: string;
  selectedAutomationId: string | null;
  selectedJobStatus: AdminAutomationJobStatus | null;
  selectedDefinitionFilter: AdminAutomationDefinitionFilter | null;
  selectedArchivedAutomationId: string | null;
  selectedArchivedJobStatus: AdminAutomationJobStatus | null;
  selectedArchivedDefinitionFilter: "code-released" | "direct-restore" | null;
};

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

const STATUS_CONFIG: Record<
  AdminArchivedAutomationJobSummary["status"],
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge: string;
  }
> = {
  PENDING: { label: "En attente", icon: Clock, badge: "bg-surface-subtle text-muted-foreground" },
  RUNNING: { label: "En cours", icon: Loader2, badge: "bg-sky-50/80 text-sky-700" },
  SUCCEEDED: {
    label: "Réussi",
    icon: CheckCircle2,
    badge: "bg-feedback-success-surface/75 text-feedback-success-foreground",
  },
  FAILED: {
    label: "Échoué",
    icon: XCircle,
    badge: "bg-feedback-error-surface/75 text-feedback-error-foreground",
  },
  CANCELLED: {
    label: "Annulé",
    icon: AlertCircle,
    badge: "bg-surface-subtle text-muted-foreground/70",
  },
};

function getJobShortId(jobId: string): string {
  return jobId.slice(-8);
}

function getArchivedJobsCountSummary(input: {
  visibleCount: number;
  totalCount: number;
}): string {
  if (input.totalCount === 0) {
    return "Aucun job archivé.";
  }

  const visibleLabel =
    input.visibleCount > 1
      ? `${input.visibleCount} jobs archivés récents affichés`
      : `${input.visibleCount} job archivé récent affiché`;
  const totalLabel =
    input.totalCount > 1 ? `${input.totalCount} jobs archivés` : `${input.totalCount} job archivé`;

  if (input.visibleCount < input.totalCount) {
    return `${visibleLabel} sur ${totalLabel}.`;
  }

  return `${totalLabel}.`;
}

function getTriggerLabel(input: string | null): string {
  if (
    input === "CART_ABANDONED" ||
    input === "ORDER_PLACED" ||
    input === "NEWSLETTER_SUBSCRIBED" ||
    input === "CUSTOMER_CREATED" ||
    input === "MANUAL" ||
    input === "OTHER"
  ) {
    return AUTOMATION_TRIGGER_LABELS[input];
  }

  return "Trigger inconnu";
}

function getActionLabel(input: string | null): string {
  if (
    input === "EMAIL_MESSAGE" ||
    input === "NEWSLETTER_CAMPAIGN" ||
    input === "NOTIFICATION" ||
    input === "WEBHOOK" ||
    input === "OTHER"
  ) {
    return AUTOMATION_ACTION_LABELS[input];
  }

  return "Action inconnue";
}

function getRestoreHint(job: AdminArchivedAutomationJobSummary): string {
  if (job.status === "CANCELLED" && job.errorCode === "archived_by_admin") {
    return "Restauration en attente si l'automation liée est encore ACTIVE, sinon simple réaffichage.";
  }

  return "Restaurer remet ce job dans la liste active avec son état actuel.";
}

function buildArchivedAutomationHref(input: {
  archivedAutomationId: string;
  selectedAutomationId: string | null;
  selectedJobStatus: AdminAutomationJobStatus | null;
  selectedDefinitionFilter: AdminAutomationDefinitionFilter | null;
  selectedArchivedJobStatus: AdminAutomationJobStatus | null;
  selectedArchivedDefinitionFilter: "code-released" | "direct-restore" | null;
}): string {
  const params = new URLSearchParams();

  if (input.selectedAutomationId) {
    params.set("automation", input.selectedAutomationId);
  }

  if (input.selectedJobStatus) {
    params.set("status", input.selectedJobStatus);
  }

  if (input.selectedDefinitionFilter) {
    params.set("definition", input.selectedDefinitionFilter);
  }

  params.set("archivedAutomation", input.archivedAutomationId);

  if (input.selectedArchivedJobStatus) {
    params.set("archivedStatus", input.selectedArchivedJobStatus);
  }

  if (input.selectedArchivedDefinitionFilter) {
    params.set("archivedDefinition", input.selectedArchivedDefinitionFilter);
  }

  return `${ADMIN_AUTOMATIONS_PATH}?${params.toString()}#archived-automations`;
}

function ArchivedAutomationJobRow({
  job,
  selectedAutomationId,
  selectedJobStatus,
  selectedDefinitionFilter,
  selectedArchivedAutomationId,
  selectedArchivedJobStatus,
  selectedArchivedDefinitionFilter,
}: {
  job: AdminArchivedAutomationJobSummary;
  selectedAutomationId: string | null;
  selectedJobStatus: AdminAutomationJobStatus | null;
  selectedDefinitionFilter: AdminAutomationDefinitionFilter | null;
  selectedArchivedAutomationId: string | null;
  selectedArchivedJobStatus: AdminAutomationJobStatus | null;
  selectedArchivedDefinitionFilter: "code-released" | "direct-restore" | null;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const cfg = STATUS_CONFIG[job.status];
  const StatusIcon = cfg.icon;
  const archivedAutomationHref =
    job.automationId !== null
      ? buildArchivedAutomationHref({
          archivedAutomationId: job.automationId,
          selectedAutomationId,
          selectedJobStatus,
          selectedDefinitionFilter,
          selectedArchivedJobStatus,
          selectedArchivedDefinitionFilter,
        })
      : null;
  const isArchivedAutomationFocused =
    job.automationId !== null && selectedArchivedAutomationId === job.automationId;

  function handleRestore(): void {
    const confirmed = window.confirm(
      `Restaurer le job ${getJobShortId(job.id)} dans la liste active ?`
    );

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      setMessage(null);
      setError(null);

      const result = await restoreAutomationJobAction(job.id);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setMessage(
        result.mode === "rearmed_pending"
          ? "Job restauré en attente."
          : "Job restauré dans la liste active."
      );
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          {archivedAutomationHref ? (
            <Link
              href={archivedAutomationHref}
              className={
                isArchivedAutomationFocused
                  ? "font-mono text-sm font-semibold text-foreground underline underline-offset-2"
                  : "font-mono text-sm font-semibold text-primary hover:underline"
              }
            >
              {job.automationCode ?? "AUTOMATION"}
            </Link>
          ) : (
            <span className="font-mono text-sm font-semibold text-foreground">
              {job.automationCode ?? "AUTOMATION"}
            </span>
          )}
          <span className="rounded-full border border-surface-border/60 bg-surface-subtle/20 px-2 py-0.5 font-mono text-[10px] text-muted-foreground/80">
            Job {getJobShortId(job.id)}
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium",
              cfg.badge
            )}
          >
            <StatusIcon className="size-3 shrink-0" />
            {cfg.label}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          {getTriggerLabel(job.triggerType)}
          {` · action ${getActionLabel(job.actionType)}`}
        </p>
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span>Créé le {dateFormatter.format(new Date(job.createdAt))}</span>
          <span>Archivé le {dateFormatter.format(new Date(job.archivedAt))}</span>
          {job.scheduledAt ? (
            <span>Planifié pour le {dateFormatter.format(new Date(job.scheduledAt))}</span>
          ) : (
            <span>Planification immédiate</span>
          )}
        </div>
        <p className="text-[11px] text-muted-foreground/70">{getRestoreHint(job)}</p>
        {job.errorMessage ? (
          <p className="text-[11px] text-muted-foreground/70">Dernier message: {job.errorMessage}</p>
        ) : null}
        {message ? <p className="text-[11px] text-feedback-success-foreground">{message}</p> : null}
        {error ? <p className="text-[11px] text-feedback-error-foreground">{error}</p> : null}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" variant="outline" size="sm" disabled={isPending} onClick={handleRestore}>
          Restaurer
        </Button>
      </div>
    </div>
  );
}

export function AdminArchivedAutomationJobsList({
  jobs,
  totalCount,
  emptyMessage,
  selectedAutomationId,
  selectedJobStatus,
  selectedDefinitionFilter,
  selectedArchivedAutomationId,
  selectedArchivedJobStatus,
  selectedArchivedDefinitionFilter,
}: AdminArchivedAutomationJobsListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (jobs.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        {emptyMessage ?? "Aucun job archivé."}
      </p>
    );
  }

  function handleBatchRestore(): void {
    const confirmed = window.confirm(
      `Restaurer les ${jobs.length} jobs archivés visibles dans la liste active ?`
    );

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      setMessage(null);
      setError(null);

      const result = await restoreAutomationJobsBatchAction(jobs.map((job) => job.id));

      if (!result.ok) {
        setError(result.error);
        return;
      }

      const parts = [`${result.restoredCount} restauration(s)`];

      if (result.rearmedPendingCount > 0) {
        parts.push(`${result.rearmedPendingCount} réarmé(s) en attente`);
      }

      if (result.unarchivedOnlyCount > 0) {
        parts.push(`${result.unarchivedOnlyCount} réaffiché(s)`);
      }

      if (result.failedCount > 0) {
        parts.push(`${result.failedCount} ignoré(s)`);
      }

      setMessage(parts.join(" · "));
      router.refresh();
    });
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          {getArchivedJobsCountSummary({ visibleCount: jobs.length, totalCount })}
        </p>
        <Button type="button" variant="outline" size="sm" disabled={isPending} onClick={handleBatchRestore}>
          Restaurer les {jobs.length} visibles
        </Button>
      </div>
      {message ? <p className="text-xs text-feedback-success-foreground">{message}</p> : null}
      {error ? <p className="text-xs text-feedback-error-foreground">{error}</p> : null}
      <div className="divide-y divide-surface-border/40">
        {jobs.map((job) => (
          <ArchivedAutomationJobRow
            key={job.id}
            job={job}
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
