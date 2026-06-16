"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { AutomationJobRow } from "@/features/admin/marketing/automations/components/admin-automation-job-row";
import { cancelAutomationJobsBatchAction } from "@/features/admin/marketing/automations/actions/cancel-automation-jobs-batch.action";
import { executeAutomationJobsBatchAction } from "@/features/admin/marketing/automations/actions/execute-automation-jobs-batch.action";
import { retryAutomationJobsBatchAction } from "@/features/admin/marketing/automations/actions/retry-automation-jobs-batch.action";
import {
  buildAutomationJobsHref,
  getCancelBatchActionLabel,
  getExecuteBatchActionLabel,
  getJobsEmptyStateMessage,
  getRetryBatchActionLabel,
  heroStatsConfig,
  isRunnableJob,
} from "@/features/admin/marketing/automations/shared/admin-automation-jobs-list-helpers";
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
              <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
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
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60"
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
