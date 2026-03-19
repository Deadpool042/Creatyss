//lib/email.ts
import { getBrevoApiKey, getEmailFrom } from "@/lib/env";
import { parseEmailFrom } from "@/lib/email-from";

type SendEmailInput = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

type BrevoEmailResponse = {
  messageId?: string;
};

export async function sendEmail(input: SendEmailInput): Promise<string | null> {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": getBrevoApiKey(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: parseEmailFrom(getEmailFrom()),
      to: [{ email: input.to }],
      subject: input.subject,
      textContent: input.text,
      htmlContent: input.html,
    }),
  });

  if (!response.ok) {
    const body = await response.text();

    throw new Error(`Brevo request failed with status ${response.status}: ${body}`);
  }

  const payload = (await response.json()) as BrevoEmailResponse;

  return typeof payload.messageId === "string" ? payload.messageId : null;
}
