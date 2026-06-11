import { serverEnv } from "@/core/config/env/server";
import { createEmailSender } from "@/core/email/from";

import type {
  TransactionalEmailPayload,
  TransactionalEmailProvider,
  TransactionalEmailResult,
} from "./email-provider.types";

type BrevoEmailResponse = {
  messageId?: string;
};

export class BrevoEmailProvider implements TransactionalEmailProvider {
  async sendTransactionalEmail(
    payload: TransactionalEmailPayload
  ): Promise<TransactionalEmailResult> {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": serverEnv.brevoApiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: createEmailSender(serverEnv.brevoFromAddress, serverEnv.brevoFromName),
        to: [{ email: payload.to }],
        subject: payload.subject,
        textContent: payload.text,
        htmlContent: payload.html,
        ...(payload.replyTo ? { replyTo: { email: payload.replyTo } } : {}),
      }),
    });

    if (!response.ok) {
      const body = await response.text();

      throw new Error(`Brevo request failed with status ${response.status}: ${body}`);
    }

    const responseBody = (await response.json()) as BrevoEmailResponse;

    return {
      provider: "brevo",
      providerMessageId:
        typeof responseBody.messageId === "string" ? responseBody.messageId : null,
    };
  }
}
