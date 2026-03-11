import { describe, expect, it } from "vitest";
import { buildOrderEmailTemplate } from "@/features/email/order-email-templates";

describe("buildOrderEmailTemplate", () => {
  it("construit un email de commande creee lisible", () => {
    const template = buildOrderEmailTemplate({
      eventType: "order_created",
      customerFirstName: "Alice",
      reference: "CRY-ABCDEFGH2",
      totalAmount: "129.00",
      orderUrl: "https://example.test/checkout/confirmation/CRY-ABCDEFGH2"
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
      trackingReference: "COL-123456"
    });

    const withoutTracking = buildOrderEmailTemplate({
      eventType: "order_shipped",
      customerFirstName: "Claire",
      reference: "CRY-ABCDEFGH2",
      totalAmount: "129.00",
      orderUrl: "https://example.test/checkout/confirmation/CRY-ABCDEFGH2",
      trackingReference: null
    });

    expect(withTracking.text).toContain("COL-123456");
    expect(withoutTracking.text).not.toContain("COL-123456");
  });
});
