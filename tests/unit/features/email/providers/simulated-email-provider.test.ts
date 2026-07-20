import { describe, expect, it } from "vitest";

import { SimulatedEmailProvider } from "@/features/email/providers/simulated-email-provider";

const PAYLOAD = {
  to: "client@example.com",
  subject: "Sujet",
  text: "Texte",
  html: "<p>Texte</p>",
};

describe("SimulatedEmailProvider", () => {
  it("retourne le kind 'simulated' et un providerMessageId préfixé", async () => {
    const provider = new SimulatedEmailProvider();
    const result = await provider.sendTransactionalEmail(PAYLOAD);

    expect(result.provider).toBe("simulated");
    expect(result.providerMessageId).toMatch(/^simulated-[0-9a-f]{16}$/);
  });

  it("est déterministe : même payload → même providerMessageId", async () => {
    const provider = new SimulatedEmailProvider();
    const first = await provider.sendTransactionalEmail(PAYLOAD);
    const second = await provider.sendTransactionalEmail(PAYLOAD);

    expect(first.providerMessageId).toBe(second.providerMessageId);
  });

  it("produit un identifiant différent pour un contenu différent", async () => {
    const provider = new SimulatedEmailProvider();
    const first = await provider.sendTransactionalEmail(PAYLOAD);
    const second = await provider.sendTransactionalEmail({ ...PAYLOAD, subject: "Autre sujet" });

    expect(first.providerMessageId).not.toBe(second.providerMessageId);
  });

  it("ne dépend d'aucune configuration serveur (aucun accès à serverEnv)", async () => {
    // Le provider simulé n'importe que node:crypto — vérifié par lecture du
    // fichier source. Ce test confirme qu'il fonctionne sans variable
    // d'environnement email/Brevo/Mailpit configurée.
    const provider = new SimulatedEmailProvider();

    await expect(provider.sendTransactionalEmail(PAYLOAD)).resolves.toMatchObject({
      provider: "simulated",
    });
  });
});
