export type AdminAutomationJobStatus = "PENDING" | "RUNNING" | "SUCCEEDED" | "FAILED" | "CANCELLED";

export type AdminAutomationJobSummary = {
  id: string;
  automationId: string | null;
  automationCode: string | null;
  triggerType: string | null;
  actionType: string | null;
  subjectType: string | null;
  subjectId: string | null;
  status: AdminAutomationJobStatus;
  scheduledAt: string | null;
  createdAt: string;
  startedAt: string | null;
  finishedAt: string | null;
  errorMessage: string | null;
  emailMessageId: string | null;
  emailRecipient: string | null;
  emailStatus: "pending" | "sent" | "failed" | null;
  emailProvider: string | null;
  emailProviderMessageId: string | null;
  emailSentAt: string | null;
  emailLastError: string | null;
};

export type AdminArchivedAutomationJobSummary = AdminAutomationJobSummary & {
  archivedAt: string;
  errorCode: string | null;
};

export type AdminAutomationJobsStats = {
  pending: number;
  running: number;
  failed: number;
  succeeded: number;
  cancelled: number;
  total: number;
};
