import type { ExecutionPolicy } from "@/core/runtime/execution-policy.types";

import { BrevoEmailProvider } from "./brevo-email-provider";
import { MailpitEmailProvider } from "./mailpit-email-provider";
import { SimulatedEmailProvider } from "./simulated-email-provider";
import type { EmailProviderKind, TransactionalEmailProvider } from "./email-provider.types";

const brevoEmailProvider = new BrevoEmailProvider();
const mailpitEmailProvider = new MailpitEmailProvider();
const simulatedEmailProvider = new SimulatedEmailProvider();

export type ResolvedEmailProvider = {
  kind: EmailProviderKind;
  provider: TransactionalEmailProvider;
};

/**
 * Sélectionne le provider email à partir de la politique d'exécution déjà
 * résolue (cf. core/runtime/resolve-store-execution-policy). En LIVE, seul
 * Brevo peut être utilisé. Hors LIVE, Mailpit reste réservé à l'environnement
 * local — seul environnement où Mailpit est disponible ; toute autre
 * combinaison utilise le provider simulé, qui ne produit aucun trafic
 * réseau.
 */
export function resolveEmailProvider(policy: ExecutionPolicy): ResolvedEmailProvider {
  if (policy.mode === "LIVE") {
    return { kind: "brevo", provider: brevoEmailProvider };
  }

  if (policy.environment === "local") {
    return { kind: "mailpit", provider: mailpitEmailProvider };
  }

  return { kind: "simulated", provider: simulatedEmailProvider };
}
