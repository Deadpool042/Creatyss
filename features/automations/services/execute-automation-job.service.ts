import "server-only";

import { serverEnv } from "@/core/config/env/server";
import { db } from "@/core/db";
import { brandConfig } from "@/core/config/brand";
import {
  buildAutomationEmailTemplate,
  isSupportedAutomationEmailTemplateCode,
} from "@/features/email/automation/automation-email-templates";
import {
  createAutomationEmailIfAbsent,
  markAutomationEmailFailed,
  markAutomationEmailSent,
} from "@/features/email/automation/automation-email.repository";
import { resolveEmailProvider } from "@/features/email/providers/resolve-email-provider";
import { AUTOMATION_NEWSLETTER_SUBSCRIBED_JOB_TYPE } from "@/features/automations/shared/automation-job.constants";

type ExecuteAutomationJobInput = {
  jobId: string;
  storeId: string;
};

type AutomationJobPayload = {
  automationId?: unknown;
  automationCode?: unknown;
  triggerType?: unknown;
  actionType?: unknown;
  templateCode?: unknown;
  newsletterSubscriberId?: unknown;
};

export class ExecuteAutomationJobError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "ExecuteAutomationJobError";
    this.code = code;
  }
}

function formatAutomationError(error: unknown): string {
  if (error instanceof ExecuteAutomationJobError) {
    return error.message.slice(0, 500);
  }

  if (error instanceof Error) {
    return error.message.slice(0, 500);
  }

  return "Erreur inattendue d'exécution.";
}

function parseAutomationJobPayload(payloadJson: string | null): {
  automationId: string;
  actionType: string;
  templateCode: string | null;
  newsletterSubscriberId: string;
} {
  if (!payloadJson) {
    throw new ExecuteAutomationJobError(
      "missing_payload",
      "Payload d'automation manquant."
    );
  }

  let payload: AutomationJobPayload;

  try {
    payload = JSON.parse(payloadJson) as AutomationJobPayload;
  } catch {
    throw new ExecuteAutomationJobError(
      "invalid_payload",
      "Payload d'automation invalide."
    );
  }

  if (typeof payload.automationId !== "string" || payload.automationId.length === 0) {
    throw new ExecuteAutomationJobError(
      "missing_automation",
      "Automation source introuvable dans le payload."
    );
  }

  if (typeof payload.actionType !== "string" || payload.actionType.length === 0) {
    throw new ExecuteAutomationJobError(
      "missing_action_type",
      "Action d'automation absente du payload."
    );
  }

  if (
    typeof payload.newsletterSubscriberId !== "string" ||
    payload.newsletterSubscriberId.length === 0
  ) {
    throw new ExecuteAutomationJobError(
      "missing_subscriber",
      "Abonné newsletter absent du payload."
    );
  }

  return {
    automationId: payload.automationId,
    actionType: payload.actionType,
    templateCode:
      typeof payload.templateCode === "string" && payload.templateCode.length > 0
        ? payload.templateCode
        : null,
    newsletterSubscriberId: payload.newsletterSubscriberId,
  };
}

export async function executeAutomationJob(
  input: ExecuteAutomationJobInput
): Promise<void> {
  const job = await db.job.findFirst({
    where: {
      id: input.jobId,
      storeId: input.storeId,
      typeCode: AUTOMATION_NEWSLETTER_SUBSCRIBED_JOB_TYPE,
      archivedAt: null,
    },
    select: {
      id: true,
      status: true,
      scheduledAt: true,
      payloadJson: true,
    },
  });

  if (!job) {
    throw new ExecuteAutomationJobError("job_not_found", "Job introuvable.");
  }

  if (job.status !== "PENDING") {
    throw new ExecuteAutomationJobError(
      "job_not_pending",
      "Seuls les jobs en attente peuvent être exécutés."
    );
  }

  if (job.scheduledAt && job.scheduledAt.getTime() > Date.now()) {
    throw new ExecuteAutomationJobError(
      "job_not_due",
      "Ce job n'est pas encore exécutable."
    );
  }

  const claimed = await db.job.updateMany({
    where: {
      id: input.jobId,
      storeId: input.storeId,
      status: "PENDING",
      archivedAt: null,
    },
    data: {
      status: "RUNNING",
      startedAt: new Date(),
      errorCode: null,
      errorMessage: null,
      attemptCount: { increment: 1 },
    },
  });

  if (claimed.count !== 1) {
    throw new ExecuteAutomationJobError(
      "job_already_claimed",
      "Le job n'est plus disponible pour exécution."
    );
  }

  let emailEventId: string | null = null;

  try {
    const payload = parseAutomationJobPayload(job.payloadJson);

    if (payload.actionType !== "EMAIL_MESSAGE") {
      throw new ExecuteAutomationJobError(
        "unsupported_action_type",
        "Seule l'action EMAIL_MESSAGE est supportée dans ce lot."
      );
    }

    if (!isSupportedAutomationEmailTemplateCode(payload.templateCode)) {
      throw new ExecuteAutomationJobError(
        "unsupported_template_code",
        "Le template demandé n'est pas supporté dans ce lot."
      );
    }

    const [automation, subscriber, store] = await Promise.all([
      db.automation.findFirst({
        where: {
          id: payload.automationId,
          storeId: input.storeId,
          status: "ACTIVE",
          archivedAt: null,
        },
        select: {
          id: true,
          templateCode: true,
          actionType: true,
        },
      }),
      db.newsletterSubscriber.findFirst({
        where: {
          id: payload.newsletterSubscriberId,
          storeId: input.storeId,
          archivedAt: null,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          status: true,
        },
      }),
      db.store.findFirst({
        where: { id: input.storeId },
        select: {
          name: true,
          supportEmail: true,
          replyToEmail: true,
        },
      }),
    ]);

    if (!automation) {
      throw new ExecuteAutomationJobError(
        "automation_not_found",
        "Automation source introuvable ou inactive."
      );
    }

    if (automation.actionType !== "EMAIL_MESSAGE") {
      throw new ExecuteAutomationJobError(
        "automation_action_mismatch",
        "L'automation source n'est plus de type EMAIL_MESSAGE."
      );
    }

    if (!subscriber) {
      throw new ExecuteAutomationJobError(
        "subscriber_not_found",
        "Abonné newsletter introuvable."
      );
    }

    if (subscriber.status !== "SUBSCRIBED") {
      throw new ExecuteAutomationJobError(
        "subscriber_not_subscribed",
        "L'abonné newsletter n'est plus actif."
      );
    }

    const boutiqueUrl = new URL("/", serverEnv.appUrl).toString();
    const storeName = store?.name ?? brandConfig.name;
    const replyTo = store?.replyToEmail ?? store?.supportEmail ?? null;
    const template = buildAutomationEmailTemplate({
      storeName,
      recipientFirstName: subscriber.firstName ?? null,
      templateCode: automation.templateCode ?? payload.templateCode,
      boutiqueUrl,
    });

    const emailProvider = resolveEmailProvider();
    const emailEvent = await createAutomationEmailIfAbsent({
      storeId: input.storeId,
      jobId: input.jobId,
      recipientEmail: subscriber.email,
      subjectLine: template.subject,
      bodyText: template.text,
      bodyHtml: template.html,
      provider: serverEnv.emailProvider,
    });

    emailEventId = emailEvent.id;

    const result = await emailProvider.sendTransactionalEmail({
      to: subscriber.email,
      subject: template.subject,
      text: template.text,
      html: template.html,
      replyTo,
    });

    await Promise.all([
      markAutomationEmailSent({
        id: emailEvent.id,
        providerMessageId: result.providerMessageId,
      }),
      db.job.update({
        where: { id: input.jobId },
        data: {
          status: "SUCCEEDED",
          finishedAt: new Date(),
          errorCode: null,
          errorMessage: null,
          resultJson: JSON.stringify({
            schema: "creatyss.automation.execution-result.v1",
            emailMessageId: emailEvent.id,
            provider: result.provider,
            providerMessageId: result.providerMessageId,
          }),
        },
      }),
    ]);
  } catch (error) {
    const formattedError = formatAutomationError(error);

    await Promise.all([
      emailEventId
        ? markAutomationEmailFailed({
            id: emailEventId,
            lastError: formattedError,
          })
        : Promise.resolve(),
      db.job.update({
        where: { id: input.jobId },
        data: {
          status: "FAILED",
          finishedAt: new Date(),
          errorCode: error instanceof ExecuteAutomationJobError ? error.code : "execution_failed",
          errorMessage: formattedError,
        },
      }),
    ]);

    throw error;
  }
}
