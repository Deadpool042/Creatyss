export type EmailProviderKind = "mailpit" | "brevo" | "simulated";

export type TransactionalEmailPayload = {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string | null;
};

export type TransactionalEmailResult = {
  provider: EmailProviderKind;
  providerMessageId: string | null;
};

export interface TransactionalEmailProvider {
  sendTransactionalEmail(payload: TransactionalEmailPayload): Promise<TransactionalEmailResult>;
}
