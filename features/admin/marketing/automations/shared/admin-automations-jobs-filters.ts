import type { AdminAutomationJobStatus } from "@/features/admin/marketing/automations/types/admin-automation-job.types";

export const JOB_STATUS_FILTERS = [
  { value: null, label: "Tous" },
  { value: "PENDING", label: "En attente" },
  { value: "RUNNING", label: "En cours" },
  { value: "FAILED", label: "Échoués" },
  { value: "SUCCEEDED", label: "Réussis" },
  { value: "CANCELLED", label: "Annulés" },
] satisfies ReadonlyArray<{ value: AdminAutomationJobStatus | null; label: string }>;

export function parseSelectedJobStatus(input: string | undefined): AdminAutomationJobStatus | null {
  if (
    input === "PENDING" ||
    input === "RUNNING" ||
    input === "FAILED" ||
    input === "SUCCEEDED" ||
    input === "CANCELLED"
  ) {
    return input;
  }

  return null;
}
