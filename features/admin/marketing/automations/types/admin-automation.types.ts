import type {
  AutomationActionType,
  AutomationStatus,
  AutomationTriggerType,
} from "@/prisma-generated/client";

export type AdminAutomationExecutionStatus =
  | "PENDING"
  | "RUNNING"
  | "SUCCEEDED"
  | "FAILED"
  | "CANCELLED";

export type AdminAutomationJobActivitySummary = {
  pending: number;
  running: number;
  failed: number;
  succeeded: number;
  cancelled: number;
  total: number;
};

export type AdminAutomationDefinitionFilter =
  | "with-jobs"
  | "pending"
  | "running"
  | "failed"
  | "without-jobs";

/**
 * Résumé d'une `Automation` pour la page admin
 * `/admin/marketing/automations`.
 *
 * Ce lot porte uniquement les définitions : aucune exécution runtime,
 * aucun journal de jobs, aucune intégration provider.
 */
export type AdminAutomationSummary = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  status: AutomationStatus;
  triggerType: AutomationTriggerType;
  actionType: AutomationActionType;
  delayMinutes: number;
  templateCode: string | null;
  createdAt: Date;
  archivedAt: Date | null;
  jobActivity: AdminAutomationJobActivitySummary;
  latestJobStatus: AdminAutomationExecutionStatus | null;
  latestJobAt: Date | null;
  latestJobError: string | null;
};

export type AdminArchivedAutomationSummary = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  triggerType: AutomationTriggerType;
  actionType: AutomationActionType;
  delayMinutes: number;
  templateCode: string | null;
  createdAt: Date;
  archivedAt: Date;
  jobActivity: AdminAutomationJobActivitySummary;
};
