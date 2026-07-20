import { describe, expect, it } from "vitest";

import { simulateWebhookDelivery } from "@/features/webhooks/services/simulate-webhook-delivery.service";
import type { WebhookDeliveryPayload } from "@/features/webhooks/services/deliver-webhook.service";

const PAYLOAD: WebhookDeliveryPayload = {
  endpointId: "we_1",
  targetUrl: "https://example.test/webhook",
  secret: "whs_secret",
  timeoutMs: 5000,
  eventType: "order.created",
  body: { orderId: "order_1" },
};

describe("simulateWebhookDelivery", () => {
  it("retourne ok: true et statusCode: null, sans errorCode ni errorMessage", async () => {
    const outcome = await simulateWebhookDelivery(PAYLOAD);

    expect(outcome.ok).toBe(true);
    expect(outcome.statusCode).toBeNull();
    expect(outcome.errorCode).toBeNull();
    expect(outcome.errorMessage).toBeNull();
  });

  it("indique explicitement la simulation dans responseBody", async () => {
    const outcome = await simulateWebhookDelivery(PAYLOAD);

    expect(outcome.responseBody).toMatch(/simulée/);
    expect(outcome.responseBody).toMatch(/fingerprint=[0-9a-f]{16}/);
  });

  it("est déterministe : même payload → même responseBody", async () => {
    const first = await simulateWebhookDelivery(PAYLOAD);
    const second = await simulateWebhookDelivery(PAYLOAD);

    expect(first.responseBody).toBe(second.responseBody);
  });

  it("produit une empreinte différente pour un contenu différent", async () => {
    const first = await simulateWebhookDelivery(PAYLOAD);
    const second = await simulateWebhookDelivery({
      ...PAYLOAD,
      body: { orderId: "order_2" },
    });

    expect(first.responseBody).not.toBe(second.responseBody);
  });

  it("ne lève jamais d'exception, même avec un body vide", async () => {
    await expect(simulateWebhookDelivery({ ...PAYLOAD, body: {} })).resolves.toMatchObject({
      ok: true,
    });
  });
});
