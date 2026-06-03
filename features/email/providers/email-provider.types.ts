export type EmailProviderKind = "mailpit" | "brevo";

export type TransactionalEmailPayload = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

export type TransactionalEmailResult = {
  provider: EmailProviderKind;
  providerMessageId: string | null;
};

export interface TransactionalEmailProvider {
  sendTransactionalEmail(
    payload: TransactionalEmailPayload
  ): Promise<TransactionalEmailResult>;
}
