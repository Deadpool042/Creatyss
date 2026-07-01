"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { archiveAutomationJobAction } from "@/features/admin/marketing/automations/actions/archive-automation-job.action";
import { cancelAutomationJobAction } from "@/features/admin/marketing/automations/actions/cancel-automation-job.action";
import { executeAutomationJobAction } from "@/features/admin/marketing/automations/actions/execute-automation-job.action";
import { rescheduleAutomationJobAction } from "@/features/admin/marketing/automations/actions/reschedule-automation-job.action";
import { retryAutomationJobAction } from "@/features/admin/marketing/automations/actions/retry-automation-job.action";
import {
  buildAutomationJobsHref,
  dateFormatter,
  EMAIL_STATUS_BADGE_STYLES,
  formatDateTimeLocalInputValue,
  formatSubjectSuffix,
  getActionLabel,
  getEmailTraceAvailabilityMessage,
  getEmailTraceSummary,
  getJobShortId,
  getJobTimestampLabel,
  getPassiveActionMessage,
  getPendingExecutionMessage,
  getPendingReadinessSummary,
  getSubjectLabel,
  getTriggerLabel,
  isRunnableJob,
  STATUS_CONFIG,
} from "@/features/admin/marketing/automations/shared/admin-automation-jobs-list-helpers";
import type { AdminAutomationDefinitionFilter } from "@/features/admin/marketing/automations/types/admin-automation.types";
import type {
  AdminAutomationJobStatus,
  AdminAutomationJobSummary,
} from "@/features/admin/marketing/automations/types/admin-automation-job.types";
import { cn } from "@/lib/utils";

export function AutomationJobRow({
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
                className="truncate font-mono text-xs font-medium text-foreground transition-colors hover:text-primary hover:underline"
              >
                {job.automationCode ?? "AUTOMATION"}
              </Link>
            ) : (
              <p className="truncate font-mono text-xs font-medium text-foreground">
                {job.automationCode ?? "AUTOMATION"}
              </p>
            )}
            <span className="rounded-full border border-surface-border/60 bg-surface-subtle/20 px-2 py-0.5 font-mono text-xs text-muted-foreground/80">
              Job {getJobShortId(job.id)}
            </span>
            {pendingReadiness ? (
              <span
                className={cn(
                  "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                  pendingReadiness.className
                )}
              >
                {pendingReadiness.label}
              </span>
            ) : null}
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground/60">
            {getTriggerLabel(job.triggerType)}
            {` · action ${getActionLabel(job.actionType)}`}
            {formatSubjectSuffix(job)
              ? ` · ${getSubjectLabel(job)} ${formatSubjectSuffix(job)}`
              : ""}
          </p>
          {pendingExecutionMessage ? (
            <p className="mt-0.5 text-xs text-muted-foreground/70">{pendingExecutionMessage}</p>
          ) : null}
          {job.errorMessage ? (
            <p className="mt-0.5 truncate text-xs text-feedback-error-foreground">
              Erreur job {job.errorMessage}
            </p>
          ) : null}
          {emailTraceAvailabilityMessage ? (
            <p className="mt-0.5 text-xs text-muted-foreground/70">
              {emailTraceAvailabilityMessage}
            </p>
          ) : null}
          {emailTrace ? (
            <div className="mt-1 grid gap-1 rounded-lg border border-surface-border/60 bg-surface-subtle/20 p-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-medium text-foreground">
                  Trace email {emailTrace.traceId}
                </span>
                {emailTrace.status ? (
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                      EMAIL_STATUS_BADGE_STYLES[emailTrace.status]
                    )}
                  >
                    {emailTrace.statusLabel}
                  </span>
                ) : null}
                {emailTrace.sentAtLabel ? (
                  <span className="text-xs text-muted-foreground/70">
                    Envoyé le {emailTrace.sentAtLabel}
                  </span>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground/70">
                {emailTrace.recipient ? <span>Destinataire {emailTrace.recipient}</span> : null}
                {emailTrace.provider ? <span>Provider {emailTrace.provider}</span> : null}
                {emailTrace.providerReference ? (
                  <span>Réf. provider {emailTrace.providerReference}</span>
                ) : null}
              </div>
              {emailTrace.error ? (
                <p className="text-xs text-feedback-error-foreground">
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
            "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium transition-colors hover:opacity-90",
            cfg.badge,
            isActiveStatus ? "ring-1 ring-inset ring-current" : ""
          )}
        >
          <StatusIcon className="size-3 shrink-0" />
          {cfg.label}
        </Link>

        <div className="grid shrink-0 gap-0.5 text-right">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/50">
            {tsLabel}
          </span>
          <span className="text-xs text-muted-foreground/60">
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
              <span className="text-xs text-muted-foreground/60">En attente d&apos;échéance</span>
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
            <span className="text-xs text-muted-foreground/50">
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
            <span className="text-xs text-muted-foreground/70">
              Laisser vide pour rendre le job exécutable immédiatement.
            </span>
          </div>
        </form>
      ) : null}

      {message ? <p className="text-xs text-feedback-success-foreground">{message}</p> : null}
      {error ? <p className="text-xs text-feedback-error-foreground">{error}</p> : null}
    </div>
  );
}
