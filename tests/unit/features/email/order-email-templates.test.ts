import { describe, expect, it } from "vitest";
// Import direct (pas le barrel) : l'index de la feature exporte aussi l'action
// serveur (core/db est gardé par "server-only"), inimportable ici.
import { buildOrderEmailTemplate } from "@/features/email/order/order-email-templates";

describe("buildOrderEmailTemplate — payment_succeeded", () => {
  const base = {
    eventType: "payment_succeeded" as const,
    customerFirstName: "Alice",
    reference: "CRY-ABCDEFGH2",
    totalAmount: "129.00",
    orderUrl: "https://example.test/checkout/confirmation/CRY-ABCDEFGH2",
  };

  it("le sujet contient la référence commande", () => {
    const template = buildOrderEmailTemplate(base);
    expect(template.subject).toContain("CRY-ABCDEFGH2");
  });

  it("le corps texte contient le montant en EUR", () => {
    const template = buildOrderEmailTemplate(base);
    expect(template.text).toContain("129.00 EUR");
  });

  it("le HTML contient le lien de confirmation orderUrl", () => {
    const template = buildOrderEmailTemplate(base);
    expect(template.html).toContain("https://example.test/checkout/confirmation/CRY-ABCDEFGH2");
  });

  it("utilise 'cliente' par défaut quand customerFirstName est vide", () => {
    const template = buildOrderEmailTemplate({ ...base, customerFirstName: "" });
    expect(template.text).toContain("cliente");
  });
});

describe("buildOrderEmailTemplate", () => {
  it("construit un email de commande creee lisible", () => {
    const template = buildOrderEmailTemplate({
      eventType: "order_created",
      customerFirstName: "Alice",
      reference: "CRY-ABCDEFGH2",
      totalAmount: "129.00",
      orderUrl: "https://example.test/checkout/confirmation/CRY-ABCDEFGH2",
    });

    expect(template.subject).toContain("Commande creee");
    expect(template.text).toContain("CRY-ABCDEFGH2");
    expect(template.text).toContain("129.00 EUR");
    expect(template.html).toContain("https://example.test/checkout/confirmation/CRY-ABCDEFGH2");
  });

  it("inclut la reference de suivi seulement pour la commande expediee", () => {
    const withTracking = buildOrderEmailTemplate({
      eventType: "order_shipped",
      customerFirstName: "Claire",
      reference: "CRY-ABCDEFGH2",
      totalAmount: "129.00",
      orderUrl: "https://example.test/checkout/confirmation/CRY-ABCDEFGH2",
      trackingReference: "COL-123456",
    });

    const withoutTracking = buildOrderEmailTemplate({
      eventType: "order_shipped",
      customerFirstName: "Claire",
      reference: "CRY-ABCDEFGH2",
      totalAmount: "129.00",
      orderUrl: "https://example.test/checkout/confirmation/CRY-ABCDEFGH2",
      trackingReference: null,
    });

    expect(withTracking.text).toContain("COL-123456");
    expect(withoutTracking.text).not.toContain("COL-123456");
  });
});
