"use client";

import Link from "next/link";
import { AlertCircle, CheckCircle2, Clock, Loader2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { archiveAutomationJobAction } from "@/features/admin/marketing/automations/actions/archive-automation-job.action";
import { cancelAutomationJobAction } from "@/features/admin/marketing/automations/actions/cancel-automation-job.action";
import { cancelAutomationJobsBatchAction } from "@/features/admin/marketing/automations/actions/cancel-automation-jobs-batch.action";
import { executeAutomationJobsBatchAction } from "@/features/admin/marketing/automations/actions/execute-automation-jobs-batch.action";
import { executeAutomationJobAction } from "@/features/admin/marketing/automations/actions/execute-automation-job.action";
import { rescheduleAutomationJobAction } from "@/features/admin/marketing/automations/actions/reschedule-automation-job.action";
import { retryAutomationJobAction } from "@/features/admin/marketing/automations/actions/retry-automation-job.action";
import { retryAutomationJobsBatchAction } from "@/features/admin/marketing/automations/actions/retry-automation-jobs-batch.action";
import {
  AUTOMATION_ACTION_LABELS,
  AUTOMATION_TRIGGER_LABELS,
} from "@/features/admin/marketing/automations/shared/admin-automation-options";
import type { AdminAutomationDefinitionFilter } from "@/features/admin/marketing/automations/types/admin-automation.types";
import type {
  AdminAutomationJobsStats,
  AdminAutomationJobStatus,
  AdminAutomationJobSummary,
} from "@/features/admin/marketing/automations/types/admin-automation-job.types";
import { cn } from "@/lib/utils";

type AdminAutomationJobsListProps = {
  jobs: ReadonlyArray<AdminAutomationJobSummary>;
  stats: AdminAutomationJobsStats;
  nowIso: string;
  selectedAutomationId: string | null;
  selectedAutomationCode: string | null;
  selectedJobStatus: AdminAutomationJobStatus | null;
  selectedDefinitionFilter: AdminAutomationDefinitionFilter | null;
};

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

const STATUS_CONFIG: Record<
  AdminAutomationJobSummary["status"],
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

const heroStatsConfig = [
  { key: "total", label: "Total", status: null },
  { key: "pending", label: "En attente", status: "PENDING" },
  { key: "running", label: "En cours", status: "RUNNING" },
  { key: "failed", label: "Échoués", status: "FAILED" },
] satisfies Array<{
  key: keyof AdminAutomationJobsStats;
  label: string;
  status: AdminAutomationJobStatus | null;
}>;

const EMAIL_STATUS_LABELS: Record<NonNullable<AdminAutomationJobSummary["emailStatus"]>, string> =
  {
    pending: "Préparé",
    sent: "Envoyé",
    failed: "Échoué",
  };

const EMAIL_STATUS_BADGE_STYLES: Record<
  NonNullable<AdminAutomationJobSummary["emailStatus"]>,
  string
> = {
  pending: "bg-surface-subtle text-muted-foreground",
  sent: "bg-feedback-success-surface/75 text-feedback-success-foreground",
  failed: "bg-feedback-error-surface/75 text-feedback-error-foreground",
};

const JOB_STATUS_LABELS: Record<AdminAutomationJobStatus, string> = {
  PENDING: "en attente",
  RUNNING: "en cours",
  SUCCEEDED: "réussis",
  FAILED: "échoués",
  CANCELLED: "annulés",
};

function formatSubjectSuffix(job: AdminAutomationJobSummary): string | null {
  if (!job.newsletterSubscriberId) {
    return null;
  }

  return job.newsletterSubscriberId.slice(-8);
}

function getJobShortId(jobId: string): string {
  return jobId.slice(-8);
}

function getPendingReadinessSummary(input: {
  status: AdminAutomationJobStatus;
  isRunnable: boolean;
}): { label: string; className: string } | null {
  if (input.status !== "PENDING") {
    return null;
  }

  if (input.isRunnable) {
    return {
      label: "Prêt à exécuter",
      className: "bg-feedback-success-surface/75 text-feedback-success-foreground",
    };
  }

  return {
    label: "Programmé",
    className: "bg-surface-subtle text-muted-foreground",
  };
}

function getPendingExecutionMessage(
  job: AdminAutomationJobSummary,
  nowTimestamp: number
): string | null {
  if (job.status !== "PENDING") {
    return null;
  }

  if (job.scheduledAt === null) {
    return "Exécution immédiate possible.";
  }

  const scheduledTimestamp = new Date(job.scheduledAt).getTime();

  if (scheduledTimestamp <= nowTimestamp) {
    return "Échéance atteinte, exécution possible.";
  }

  return `Exécutable le ${dateFormatter.format(new Date(job.scheduledAt))}.`;
}

function getPassiveActionMessage(status: AdminAutomationJobStatus): string {
  switch (status) {
    case "RUNNING":
      return "Exécution en cours";
    case "SUCCEEDED":
      return "Aucune action";
    case "CANCELLED":
      return "Aucune action";
    case "PENDING":
      return "Planifié";
    case "FAILED":
    default:
      return "—";
  }
}

function getExecuteBatchActionLabel(count: number): string {
  if (count <= 0) {
    return "Exécuter les jobs prêts";
  }

  if (count === 1) {
    return "Exécuter 1 job prêt";
  }

  return `Exécuter ${count} jobs prêts`;
}

function getCancelBatchActionLabel(count: number): string {
  if (count <= 0) {
    return "Annuler les jobs en attente";
  }

  if (count === 1) {
    return "Annuler 1 job en attente";
  }

  return `Annuler ${count} jobs en attente`;
}

function getRetryBatchActionLabel(count: number): string {
  if (count <= 0) {
    return "Relancer les jobs échoués";
  }

  if (count === 1) {
    return "Relancer 1 job échoué";
  }

  return `Relancer ${count} jobs échoués`;
}

function isRunnableJob(job: AdminAutomationJobSummary, nowTimestamp: number): boolean {
  return (
    job.status === "PENDING" &&
    (job.scheduledAt === null || new Date(job.scheduledAt).getTime() <= nowTimestamp)
  );
}

function getEmailTraceSummary(job: AdminAutomationJobSummary): {
  traceId: string;
  recipient: string | null;
  status: NonNullable<AdminAutomationJobSummary["emailStatus"]> | null;
  statusLabel: string | null;
  sentAtLabel: string | null;
  provider: string | null;
  providerReference: string | null;
  error: string | null;
} | null {
  if (job.emailMessageId === null) {
    return null;
  }

  return {
    traceId: job.emailMessageId.slice(-8),
    recipient: job.emailRecipient,
    status: job.emailStatus,
    statusLabel: job.emailStatus ? EMAIL_STATUS_LABELS[job.emailStatus] : null,
    sentAtLabel:
      job.emailStatus === "sent" && job.emailSentAt
        ? dateFormatter.format(new Date(job.emailSentAt))
        : null,
    provider: job.emailProvider,
    providerReference: job.emailProviderMessageId,
    error: job.emailLastError,
  };
}

function getEmailTraceAvailabilityMessage(job: AdminAutomationJobSummary): string | null {
  if (job.actionType !== "EMAIL_MESSAGE" || job.emailMessageId !== null) {
    return null;
  }

  if (job.status === "PENDING") {
    return "Aucune trace email avant exécution.";
  }

  if (job.status === "RUNNING") {
    return "Trace email locale non encore disponible.";
  }

  if (
    job.status === "SUCCEEDED" ||
    job.status === "FAILED" ||
    job.status === "CANCELLED"
  ) {
    return "Aucune trace email locale.";
  }

  return null;
}

function formatDateTimeLocalInputValue(input: string | null): string {
  if (!input) {
    return "";
  }

  const date = new Date(input);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function buildAutomationJobsHref(input: {
  automationId: string | null;
  status: AdminAutomationJobStatus | null;
  definition: AdminAutomationDefinitionFilter | null;
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

  const query = params.toString();
  return query.length > 0
    ? `/admin/marketing/automations?${query}#automation-jobs`
    : "/admin/marketing/automations#automation-jobs";
}

function getJobsEmptyStateMessage(input: {
  selectedAutomationCode: string | null;
  selectedJobStatus: AdminAutomationJobStatus | null;
}): string {
  if (input.selectedAutomationCode && input.selectedJobStatus) {
    return `Aucun job ${JOB_STATUS_LABELS[input.selectedJobStatus]} pour l'automation ${input.selectedAutomationCode}.`;
  }

  if (input.selectedAutomationCode) {
    return `Aucun job visible pour l'automation ${input.selectedAutomationCode}.`;
  }

  if (input.selectedJobStatus) {
    return `Aucun job ${JOB_STATUS_LABELS[input.selectedJobStatus]} dans la vue courante.`;
  }

  return "Aucun job d'automation planifié pour le moment.";
}

function getJobsCountSummary(input: {
  visibleCount: number;
  totalCount: number;
}): string {
  const visibleLabel =
    input.visibleCount > 1 ? `${input.visibleCount} jobs récents affichés` : `${input.visibleCount} job récent affiché`;
  const totalLabel =
    input.totalCount > 1 ? `${input.totalCount} jobs` : `${input.totalCount} job`;

  if (input.totalCount === 0) {
    return "Aucun job correspondant aux filtres actifs.";
  }

  if (input.visibleCount < input.totalCount) {
    return `${visibleLabel} sur ${totalLabel} correspondant aux filtres actifs.`;
  }

  return `${totalLabel} correspondant aux filtres actifs.`;
}

function getJobTimestampLabel(job: AdminAutomationJobSummary): string {
  if (job.finishedAt) {
    return "Terminé";
  }

  if (job.startedAt) {
    return "Démarré";
  }

  if (job.scheduledAt) {
    return "Planifié";
  }

  return "Créé";
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

function AutomationJobRow({
  job,
  nowTimestamp,
  selectedAutomationId,
  selectedJobStatus,
  selectedDefinitionFilter,
}: {
  job: AdminAutomationJobSummary;
  nowTimestamp: number;
  selectedAutomationId: string | null;
  selectedJobStatus: AdminAutomationJobStatus | null;
  selectedDefinitionFilter: AdminAutomationDefinitionFilter | null;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const cfg = STATUS_CONFIG[job.status];
  const StatusIcon = cfg.icon;
  const ts = job.finishedAt ?? job.startedAt ?? job.scheduledAt ?? job.createdAt;
  const tsLabel = getJobTimestampLabel(job);
  const isRunnable = isRunnableJob(job, nowTimestamp);
  const isCancelable = job.status === "PENDING";
  const isRetryable = job.status === "FAILED";
  const canArchive = job.status !== "RUNNING";
  const emailTrace = getEmailTraceSummary(job);
  const isActiveStatus = selectedJobStatus === job.status;
  const shouldKeepAutomationFilter =
    selectedAutomationId !== null ? selectedAutomationId : job.automationId;
  const pendingReadiness = getPendingReadinessSummary({
    status: job.status,
    isRunnable,
  });
  const pendingExecutionMessage = getPendingExecutionMessage(job, nowTimestamp);
  const emailTraceAvailabilityMessage = getEmailTraceAvailabilityMessage(job);

  function handleExecute() {
    startTransition(async () => {
      setError(null);
      setMessage(null);
      const result = await executeAutomationJobAction(job.id);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setIsEditing(false);
      router.refresh();
    });
  }

  function handleCancel() {
    startTransition(async () => {
      setError(null);
      setMessage(null);
      const result = await cancelAutomationJobAction(job.id);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setIsEditing(false);
      router.refresh();
    });
  }

  function handleRetry() {
    startTransition(async () => {
      setError(null);
      setMessage(null);
      const result = await retryAutomationJobAction(job.id);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setIsEditing(false);
      router.refresh();
    });
  }

  function handleReschedule(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const scheduledAtRaw = String(formData.get("scheduledAt") ?? "").trim();
    const scheduledAtIso =
      scheduledAtRaw.length > 0 ? new Date(scheduledAtRaw).toISOString() : null;

    startTransition(async () => {
      setError(null);
      setMessage(null);

      const result = await rescheduleAutomationJobAction(job.id, scheduledAtIso);
      if (!result.ok) {
        setError(result.error);
        return;
      }

      setIsEditing(false);
      setMessage(
        scheduledAtIso ? "Planification du job mise à jour." : "Job rendu exécutable immédiatement."
      );
      router.refresh();
    });
  }

  function handleArchive() {
    const confirmed = window.confirm(
      job.status === "PENDING"
        ? "Supprimer ce job ? Il sera annulé puis retiré de la liste active."
        : "Supprimer ce job de la liste active ?"
    );

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      setError(null);
      setMessage(null);

      const result = await archiveAutomationJobAction(job.id);
      if (!result.ok) {
        setError(result.error);
        return;
      }

      setIsEditing(false);
      router.refresh();
    });
  }

  return (
    <div className="grid gap-2 px-4 py-3 hover:bg-surface-subtle/20 transition-colors">
      <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {job.automationId ? (
              <Link
                href={buildAutomationJobsHref({
                  automationId: job.automationId,
                  status: selectedJobStatus,
                  definition: selectedDefinitionFilter,
                })}
                className="truncate font-mono text-[12px] font-medium text-foreground transition-colors hover:text-primary hover:underline"
              >
                {job.automationCode ?? "AUTOMATION"}
              </Link>
            ) : (
              <p className="truncate font-mono text-[12px] font-medium text-foreground">
                {job.automationCode ?? "AUTOMATION"}
              </p>
            )}
            <span className="rounded-full border border-surface-border/60 bg-surface-subtle/20 px-2 py-0.5 font-mono text-[10px] text-muted-foreground/80">
              Job {getJobShortId(job.id)}
            </span>
            {pendingReadiness ? (
              <span
                className={cn(
                  "inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium",
                  pendingReadiness.className
                )}
              >
                {pendingReadiness.label}
              </span>
            ) : null}
          </div>
          <p className="mt-0.5 text-[11px] text-muted-foreground/60">
            {getTriggerLabel(job.triggerType)}
            {` · action ${getActionLabel(job.actionType)}`}
            {formatSubjectSuffix(job) ? ` · abonné ${formatSubjectSuffix(job)}` : ""}
          </p>
          {pendingExecutionMessage ? (
            <p className="mt-0.5 text-[11px] text-muted-foreground/70">
              {pendingExecutionMessage}
            </p>
          ) : null}
          {job.errorMessage ? (
            <p className="mt-0.5 truncate text-[11px] text-feedback-error-foreground">
              Erreur job {job.errorMessage}
            </p>
          ) : null}
          {emailTraceAvailabilityMessage ? (
            <p className="mt-0.5 text-[11px] text-muted-foreground/70">
              {emailTraceAvailabilityMessage}
            </p>
          ) : null}
          {emailTrace ? (
            <div className="mt-1 grid gap-1 rounded-lg border border-surface-border/60 bg-surface-subtle/20 p-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[10px] font-medium text-foreground">
                  Trace email {emailTrace.traceId}
                </span>
                {emailTrace.status ? (
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium",
                      EMAIL_STATUS_BADGE_STYLES[emailTrace.status]
                    )}
                  >
                    {emailTrace.statusLabel}
                  </span>
                ) : null}
                {emailTrace.sentAtLabel ? (
                  <span className="text-[10px] text-muted-foreground/70">
                    Envoyé le {emailTrace.sentAtLabel}
                  </span>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground/70">
                {emailTrace.recipient ? <span>Destinataire {emailTrace.recipient}</span> : null}
                {emailTrace.provider ? <span>Provider {emailTrace.provider}</span> : null}
                {emailTrace.providerReference ? (
                  <span>Réf. provider {emailTrace.providerReference}</span>
                ) : null}
              </div>
              {emailTrace.error ? (
                <p className="text-[11px] text-feedback-error-foreground">
                  Erreur email {emailTrace.error}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>

        <Link
          href={buildAutomationJobsHref({
            automationId: shouldKeepAutomationFilter,
            status: job.status,
            definition: selectedDefinitionFilter,
          })}
          className={cn(
            "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium transition-colors hover:opacity-90",
            cfg.badge,
            isActiveStatus ? "ring-1 ring-inset ring-current" : ""
          )}
        >
          <StatusIcon className="size-3 shrink-0" />
          {cfg.label}
        </Link>

        <div className="grid shrink-0 gap-0.5 text-right">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">
            {tsLabel}
          </span>
          <span className="text-[11px] text-muted-foreground/60">
            {dateFormatter.format(new Date(ts))}
          </span>
        </div>

        {isCancelable ? (
          <div className="grid shrink-0 justify-items-end gap-1">
            <div className="flex flex-wrap justify-end gap-2">
              {isRunnable ? (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={isPending}
                  onClick={handleExecute}
                >
                  Exécuter
                </Button>
              ) : null}
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={isPending}
                onClick={() => {
                  setIsEditing((current) => !current);
                  setError(null);
                  setMessage(null);
                }}
              >
                {isEditing ? "Fermer" : "Modifier"}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                disabled={isPending}
                onClick={handleCancel}
              >
                Annuler
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                disabled={isPending}
                onClick={handleArchive}
              >
                Supprimer
              </Button>
            </div>
            {!isRunnable ? (
              <span className="text-[10px] text-muted-foreground/60">
                En attente d&apos;échéance
              </span>
            ) : null}
          </div>
        ) : isRetryable ? (
          <div className="flex shrink-0 flex-wrap justify-end gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={isPending}
              onClick={handleRetry}
            >
              Réessayer
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              disabled={isPending}
              onClick={handleArchive}
            >
              Supprimer
            </Button>
          </div>
        ) : (
          <div className="grid shrink-0 justify-items-end gap-1">
            <span className="text-[11px] text-muted-foreground/50">
              {getPassiveActionMessage(job.status)}
            </span>
            {canArchive ? (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                disabled={isPending}
                onClick={handleArchive}
              >
                Supprimer
              </Button>
            ) : null}
          </div>
        )}
      </div>

      {isEditing ? (
        <form
          onSubmit={handleReschedule}
          className="grid gap-3 rounded-xl border border-surface-border/60 bg-surface-subtle/20 p-3 sm:grid-cols-[minmax(0,220px)_auto]"
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`job-scheduled-at-${job.id}`}>Planification</Label>
            <Input
              id={`job-scheduled-at-${job.id}`}
              name="scheduledAt"
              type="datetime-local"
              defaultValue={formatDateTimeLocalInputValue(job.scheduledAt)}
            />
          </div>
          <div className="flex flex-wrap items-end gap-2">
            <Button type="submit" size="sm" disabled={isPending}>
              Enregistrer
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              disabled={isPending}
              onClick={() => {
                setIsEditing(false);
                setError(null);
              }}
            >
              Annuler
            </Button>
            <span className="text-[11px] text-muted-foreground/70">
              Laisser vide pour rendre le job exécutable immédiatement.
            </span>
          </div>
        </form>
      ) : null}

      {message ? (
        <p className="text-[11px] text-feedback-success-foreground">{message}</p>
      ) : null}
      {error ? (
        <p className="text-[11px] text-feedback-error-foreground">{error}</p>
      ) : null}
    </div>
  );
}

export function AdminAutomationJobsList({
  jobs,
  stats,
  nowIso,
  selectedAutomationId,
  selectedAutomationCode,
  selectedJobStatus,
  selectedDefinitionFilter,
}: AdminAutomationJobsListProps) {
  const nowTimestamp = new Date(nowIso).getTime();
  const pendingJobIds = jobs.filter((job) => job.status === "PENDING").map((job) => job.id);
  const readyJobIds = jobs.filter((job) => isRunnableJob(job, nowTimestamp)).map((job) => job.id);
  const pendingScheduledCount = Math.max(pendingJobIds.length - readyJobIds.length, 0);
  const failedJobIds = jobs.filter((job) => job.status === "FAILED").map((job) => job.id);
  const [isBatchPending, startBatchTransition] = useTransition();
  const [batchMessage, setBatchMessage] = useState<string | null>(null);
  const [batchError, setBatchError] = useState<string | null>(null);
  const router = useRouter();
  const jobsCountSummary = getJobsCountSummary({
    visibleCount: jobs.length,
    totalCount: stats.total,
  });

  function handleExecuteReadyJobs() {
    startBatchTransition(async () => {
      setBatchMessage(null);
      setBatchError(null);

      const result = await executeAutomationJobsBatchAction(readyJobIds);

      if (!result.ok) {
        setBatchError(result.error);
        return;
      }

      const summary =
        result.failed > 0
          ? `${result.succeeded} job(s) exécuté(s), ${result.failed} en échec.`
          : `${result.succeeded} job(s) exécuté(s).`;

      setBatchMessage(summary);
      setBatchError(result.errors.length > 0 ? result.errors.join(" · ") : null);
      router.refresh();
    });
  }

  function handleCancelPendingJobs() {
    startBatchTransition(async () => {
      setBatchMessage(null);
      setBatchError(null);

      const result = await cancelAutomationJobsBatchAction(pendingJobIds);

      if (!result.ok) {
        setBatchError(result.error);
        return;
      }

      const summary =
        result.failed > 0
          ? `${result.succeeded} job(s) annulé(s), ${result.failed} en échec.`
          : `${result.succeeded} job(s) annulé(s).`;

      setBatchMessage(summary);
      setBatchError(result.errors.length > 0 ? result.errors.join(" · ") : null);
      router.refresh();
    });
  }

  function handleRetryFailedJobs() {
    startBatchTransition(async () => {
      setBatchMessage(null);
      setBatchError(null);

      const result = await retryAutomationJobsBatchAction(failedJobIds);

      if (!result.ok) {
        setBatchError(result.error);
        return;
      }

      const summary =
        result.failed > 0
          ? `${result.succeeded} job(s) relancé(s), ${result.failed} en échec.`
          : `${result.succeeded} job(s) relancé(s).`;

      setBatchMessage(summary);
      setBatchError(result.errors.length > 0 ? result.errors.join(" · ") : null);
      router.refresh();
    });
  }

  return (
    <div className="grid gap-4">
      <p className="text-xs text-muted-foreground">{jobsCountSummary}</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {heroStatsConfig.map((item) => {
          const value = stats[item.key];
          const isAlert = item.key === "failed" && value > 0;
          const isActive = selectedJobStatus === item.status;

          return (
            <Link
              key={item.key}
              href={buildAutomationJobsHref({
                automationId: selectedAutomationId,
                status: item.status,
                definition: selectedDefinitionFilter,
              })}
              className={cn(
                "rounded-2xl border border-surface-border/60 px-4 py-3 shadow-sm backdrop-blur-sm transition-colors hover:border-control-border-strong hover:bg-surface-subtle/40",
                isAlert
                  ? "border-feedback-error-border bg-feedback-error-surface/30"
                  : "bg-surface-panel/60",
                isActive ? "border-control-border-strong bg-surface-subtle/40" : ""
              )}
            >
              <p
                className={cn(
                  "text-2xl font-semibold tracking-tight",
                  isAlert ? "text-feedback-error-foreground" : "text-foreground"
                )}
              >
                {value}
              </p>
              <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                {item.label}
              </p>
            </Link>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isBatchPending || readyJobIds.length === 0}
          onClick={handleExecuteReadyJobs}
        >
          {getExecuteBatchActionLabel(readyJobIds.length)}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isBatchPending || pendingJobIds.length === 0}
          onClick={handleCancelPendingJobs}
        >
          {getCancelBatchActionLabel(pendingJobIds.length)}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isBatchPending || failedJobIds.length === 0}
          onClick={handleRetryFailedJobs}
        >
          {getRetryBatchActionLabel(failedJobIds.length)}
        </Button>
        <span className="text-xs text-muted-foreground">
          {readyJobIds.length > 0
            ? `${readyJobIds.length} job(s) visible(s) prêt(s) à exécuter`
            : "Aucun job visible prêt à exécuter"}
        </span>
        <span className="text-xs text-muted-foreground">
          {pendingJobIds.length > 0
            ? `${pendingJobIds.length} job(s) visible(s) en attente annulable(s)`
            : "Aucun job visible en attente à annuler"}
        </span>
        <span className="text-xs text-muted-foreground">
          {pendingScheduledCount > 0
            ? `${pendingScheduledCount} job(s) visible(s) encore en attente d'échéance`
            : "Aucun job visible en attente d'échéance"}
        </span>
        <span className="text-xs text-muted-foreground">
          {failedJobIds.length > 0
            ? `${failedJobIds.length} job(s) visible(s) échoué(s) relançable(s)`
            : "Aucun job visible échoué à relancer"}
        </span>
        <span className="text-xs text-muted-foreground">
          La trace email locale apparaît dès qu&apos;un `EmailMessage` existe pour le job.
        </span>
        <span className="text-xs text-muted-foreground">
          Un job `PENDING` peut aussi être annulé manuellement depuis sa ligne.
        </span>
        <span className="text-xs text-muted-foreground">
          Un job `FAILED` peut être relancé localement sans ouvrir de worker global.
        </span>
      </div>

      {batchMessage ? (
        <p className="text-xs text-feedback-success-foreground">{batchMessage}</p>
      ) : null}
      {batchError ? (
        <p className="text-xs text-feedback-error-foreground">{batchError}</p>
      ) : null}

      {jobs.length === 0 ? (
        <div className="grid gap-3 rounded-2xl border border-dashed border-surface-border/60 bg-surface-panel/30 px-5 py-10 text-center">
          <p className="text-sm text-muted-foreground">
            {getJobsEmptyStateMessage({
              selectedAutomationCode,
              selectedJobStatus,
            })}
          </p>
          {selectedAutomationId || selectedJobStatus ? (
            <div className="flex justify-center">
              <Button asChild type="button" variant="ghost" size="sm">
                <Link
                  href={buildAutomationJobsHref({
                    automationId: null,
                    status: null,
                    definition: selectedDefinitionFilter,
                  })}
                >
                  Retirer les filtres jobs
                </Link>
              </Button>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-surface-border/60 bg-surface-panel/50">
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-3 border-b border-surface-border/40 px-4 py-2.5">
            {["Automation / Sujet", "Statut", "Date", "Action"].map((label) => (
              <p
                key={label}
                className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60"
              >
                {label}
              </p>
            ))}
          </div>

          <div className="divide-y divide-surface-border/30">
            {jobs.map((job) => (
              <AutomationJobRow
                key={job.id}
                job={job}
                nowTimestamp={nowTimestamp}
                selectedAutomationId={selectedAutomationId}
                selectedJobStatus={selectedJobStatus}
                selectedDefinitionFilter={selectedDefinitionFilter}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
