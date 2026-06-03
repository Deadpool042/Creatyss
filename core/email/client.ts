import { resolveEmailProvider } from "@/features/email/providers/resolve-email-provider";

type SendEmailInput = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

export async function sendEmail(input: SendEmailInput): Promise<string | null> {
  const provider = resolveEmailProvider();
  const result = await provider.sendTransactionalEmail(input);

  return result.providerMessageId;
}
