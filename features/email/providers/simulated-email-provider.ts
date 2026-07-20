import { createHash } from "node:crypto";

import type {
  TransactionalEmailPayload,
  TransactionalEmailProvider,
  TransactionalEmailResult,
} from "./email-provider.types";

/**
 * Provider email neutralisé : ne produit aucun trafic réseau. Utilisé quand
 * la politique d'exécution résout en TEST hors environnement local (pas de
 * Mailpit disponible sur ces instances). Déterministe : l'identifiant simulé
 * dérive uniquement du contenu du message, jamais d'un tirage aléatoire ni
 * de l'horloge.
 */
export class SimulatedEmailProvider implements TransactionalEmailProvider {
  sendTransactionalEmail(payload: TransactionalEmailPayload): Promise<TransactionalEmailResult> {
    const fingerprint = createHash("sha256")
      .update(`${payload.to}|${payload.subject}|${payload.text}|${payload.html}`)
      .digest("hex")
      .slice(0, 16);

    return Promise.resolve({
      provider: "simulated",
      providerMessageId: `simulated-${fingerprint}`,
    });
  }
}
