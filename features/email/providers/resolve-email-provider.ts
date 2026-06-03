import { serverEnv } from "@/core/config/env/server";

import { BrevoEmailProvider } from "./brevo-email-provider";
import { MailpitEmailProvider } from "./mailpit-email-provider";
import type { TransactionalEmailProvider } from "./email-provider.types";

const brevoEmailProvider = new BrevoEmailProvider();
const mailpitEmailProvider = new MailpitEmailProvider();

export function resolveEmailProvider(): TransactionalEmailProvider {
  if (serverEnv.emailProvider === "brevo") {
    return brevoEmailProvider;
  }

  return mailpitEmailProvider;
}
