import { db } from "@/core/db";
import type { EmailMessage, EmailRecipient } from "@/prisma-generated/client";

type EmailMessageWithRecipients = EmailMessage & { recipients: EmailRecipient[] };

type CreateAutomationEmailIfAbsentInput = {
  storeId: string;
  jobId: string;
  recipientEmail: string;
  subjectLine: string;
  bodyText: string;
  bodyHtml: string;
  provider: string;
};

type MarkAutomationEmailSentInput = {
  id: string;
  providerMessageId: string | null;
};

type MarkAutomationEmailFailedInput = {
  id: string;
  lastError: string;
};

export type AutomationEmailEvent = {
  id: string;
  recipientEmail: string;
  status: "pending" | "sent" | "failed";
  provider: string | null;
  providerMessageId: string | null;
  lastError: string | null;
};

function mapEmailMessage(message: EmailMessageWithRecipients): AutomationEmailEvent {
  const toRecipient = message.recipients.find((recipient) => recipient.type === "TO");

  return {
    id: message.id,
    recipientEmail: toRecipient?.email ?? "",
    status:
      message.status === "SENT"
        ? "sent"
        : message.status === "FAILED" || message.status === "CANCELLED"
          ? "failed"
          : "pending",
    provider: message.provider ?? null,
    providerMessageId: message.providerReference ?? null,
    lastError: message.errorMessage ?? null,
  };
}

export async function createAutomationEmailIfAbsent(
  input: CreateAutomationEmailIfAbsentInput
): Promise<AutomationEmailEvent> {
  const existing = await db.emailMessage.findFirst({
    where: {
      storeId: input.storeId,
      subjectType: "automation_job",
      subjectId: input.jobId,
    },
    include: { recipients: true },
  });

  if (existing) {
    return mapEmailMessage(existing);
  }

  const created = await db.emailMessage.create({
    data: {
      storeId: input.storeId,
      subjectType: "automation_job",
      subjectId: input.jobId,
      category: "MARKETING",
      status: "PREPARED",
      subjectLine: input.subjectLine,
      bodyText: input.bodyText,
      bodyHtml: input.bodyHtml,
      provider: input.provider,
      preparedAt: new Date(),
      recipients: {
        create: {
          type: "TO",
          email: input.recipientEmail,
        },
      },
    },
    include: { recipients: true },
  });

  return mapEmailMessage(created);
}

export async function markAutomationEmailSent(
  input: MarkAutomationEmailSentInput
): Promise<void> {
  await db.emailMessage.update({
    where: { id: input.id },
    data: {
      status: "SENT",
      providerReference: input.providerMessageId,
      sentAt: new Date(),
      errorMessage: null,
      errorCode: null,
    },
  });
}

export async function markAutomationEmailFailed(
  input: MarkAutomationEmailFailedInput
): Promise<void> {
  await db.emailMessage.update({
    where: { id: input.id },
    data: {
      status: "FAILED",
      failedAt: new Date(),
      errorMessage: input.lastError,
    },
  });
}
