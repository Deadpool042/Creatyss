import { AlertCircle, CheckCircle2, Clock, Loader2, XCircle } from "lucide-react";

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

export const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export const STATUS_CONFIG: Record<
  AdminAutomationJobSummary["status"],
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge: string;
  }
> = {
  PENDING: { label: "En attente", icon: Clock, badge: "bg-surface-subtle text-muted-foreground" },
  RUNNING: {
    label: "En cours",
    icon: Loader2,
    badge: "bg-feedback-info-surface/75 text-feedback-info-foreground",
  },
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

export const heroStatsConfig = [
  { key: "total", label: "Total", status: null },
  { key: "pending", label: "En attente", status: "PENDING" },
  { key: "running", label: "En cours", status: "RUNNING" },
  { key: "failed", label: "Échoués", status: "FAILED" },
] satisfies Array<{
  key: keyof AdminAutomationJobsStats;
  label: string;
  status: AdminAutomationJobStatus | null;
}>;

export const EMAIL_STATUS_LABELS: Record<NonNullable<AdminAutomationJobSummary["emailStatus"]>, string> =
  {
    pending: "Préparé",
    sent: "Envoyé",
    failed: "Échoué",
  };

export const EMAIL_STATUS_BADGE_STYLES: Record<
  NonNullable<AdminAutomationJobSummary["emailStatus"]>,
  string
> = {
  pending: "bg-surface-subtle text-muted-foreground",
  sent: "bg-feedback-success-surface/75 text-feedback-success-foreground",
  failed: "bg-feedback-error-surface/75 text-feedback-error-foreground",
};

export const JOB_STATUS_LABELS: Record<AdminAutomationJobStatus, string> = {
  PENDING: "en attente",
  RUNNING: "en cours",
  SUCCEEDED: "réussis",
  FAILED: "échoués",
  CANCELLED: "annulés",
};

export function formatSubjectSuffix(job: AdminAutomationJobSummary): string | null {
  if (!job.newsletterSubscriberId) {
    return null;
  }

  return job.newsletterSubscriberId.slice(-8);
}

export function getJobShortId(jobId: string): string {
  return jobId.slice(-8);
}

export function getPendingReadinessSummary(input: {
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

export function getPendingExecutionMessage(
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

export function getPassiveActionMessage(status: AdminAutomationJobStatus): string {
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

export function getExecuteBatchActionLabel(count: number): string {
  if (count <= 0) {
    return "Exécuter les jobs prêts";
  }

  if (count === 1) {
    return "Exécuter 1 job prêt";
  }

  return `Exécuter ${count} jobs prêts`;
}

export function getCancelBatchActionLabel(count: number): string {
  if (count <= 0) {
    return "Annuler les jobs en attente";
  }

  if (count === 1) {
    return "Annuler 1 job en attente";
  }

  return `Annuler ${count} jobs en attente`;
}

export function getRetryBatchActionLabel(count: number): string {
  if (count <= 0) {
    return "Relancer les jobs échoués";
  }

  if (count === 1) {
    return "Relancer 1 job échoué";
  }

  return `Relancer ${count} jobs échoués`;
}

export function isRunnableJob(job: AdminAutomationJobSummary, nowTimestamp: number): boolean {
  return (
    job.status === "PENDING" &&
    (job.scheduledAt === null || new Date(job.scheduledAt).getTime() <= nowTimestamp)
  );
}

export function getEmailTraceSummary(job: AdminAutomationJobSummary): {
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

export function getEmailTraceAvailabilityMessage(job: AdminAutomationJobSummary): string | null {
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

export function formatDateTimeLocalInputValue(input: string | null): string {
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

export function buildAutomationJobsHref(input: {
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

export function getJobsEmptyStateMessage(input: {
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

export function getJobsCountSummary(input: {
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

export function getJobTimestampLabel(job: AdminAutomationJobSummary): string {
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

export function getTriggerLabel(input: string | null): string {
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

export function getActionLabel(input: string | null): string {
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
