import { createHmac } from "node:crypto";

import { afterEach, describe, expect, it, vi } from "vitest";

import {
  buildWebhookHeaders,
  buildWebhookSignature,
  deliverWebhook,
} from "@/features/webhooks/services/deliver-webhook.service";

const BODY = JSON.stringify({ event: "creatyss.order.created.v1", orderId: "ord_1" });
const SECRET = "whs_test_secret";

describe("buildWebhookSignature", () => {
  it("produit une signature au format sha256=<hex>", () => {
    const signature = buildWebhookSignature(SECRET, BODY);

    expect(signature).toMatch(/^sha256=[0-9a-f]{64}$/);
  });

  it("correspond au HMAC-SHA256 du body avec le secret", () => {
    const expected = createHmac("sha256", SECRET).update(BODY).digest("hex");

    expect(buildWebhookSignature(SECRET, BODY)).toBe(`sha256=${expected}`);
  });

  it("change avec le body et avec le secret", () => {
    const base = buildWebhookSignature(SECRET, BODY);

    expect(buildWebhookSignature(SECRET, `${BODY} `)).not.toBe(base);
    expect(buildWebhookSignature("autre-secret", BODY)).not.toBe(base);
  });
});

describe("buildWebhookHeaders", () => {
  it("pose Content-Type et X-Webhook-Event", () => {
    const headers = buildWebhookHeaders("order.created", null, BODY);

    expect(headers["Content-Type"]).toBe("application/json");
    expect(headers["X-Webhook-Event"]).toBe("order.created");
  });

  it("omet la signature sans secret", () => {
    const headers = buildWebhookHeaders("order.created", null, BODY);

    expect(headers["X-Webhook-Signature"]).toBeUndefined();
  });

  it("signe avec le secret fourni", () => {
    const headers = buildWebhookHeaders("order.created", SECRET, BODY);

    expect(headers["X-Webhook-Signature"]).toBe(buildWebhookSignature(SECRET, BODY));
  });
});

describe("deliverWebhook", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  function makePayload() {
    return {
      endpointId: "we_1",
      targetUrl: "https://example.test/webhook",
      secret: SECRET,
      timeoutMs: 5000,
      eventType: "order.created",
      body: { event: "creatyss.order.created.v1", orderId: "ord_1" },
    };
  }

  it("retourne ok avec le statut et le body de réponse en succès", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("accepted", { status: 200 }))
    );

    const outcome = await deliverWebhook(makePayload());

    expect(outcome).toEqual({
      ok: true,
      statusCode: 200,
      responseBody: "accepted",
      errorCode: null,
      errorMessage: null,
    });
  });

  it("envoie le POST signé vers l'URL cible", async () => {
    const fetchMock = vi.fn(async () => new Response("", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await deliverWebhook(makePayload());

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    const headers = init.headers as Record<string, string>;
    expect(url).toBe("https://example.test/webhook");
    expect(init.method).toBe("POST");
    expect(headers["X-Webhook-Event"]).toBe("order.created");
    expect(headers["X-Webhook-Signature"]).toBe(buildWebhookSignature(SECRET, init.body as string));
  });

  it("retourne HTTP_ERROR sur une réponse non-2xx", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("boom", { status: 500 }))
    );

    const outcome = await deliverWebhook(makePayload());

    expect(outcome.ok).toBe(false);
    expect(outcome.statusCode).toBe(500);
    expect(outcome.errorCode).toBe("HTTP_ERROR");
    expect(outcome.errorMessage).toBe("HTTP 500");
  });

  it("tronque le body de réponse à 2000 caractères", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("x".repeat(5000), { status: 200 }))
    );

    const outcome = await deliverWebhook(makePayload());

    expect(outcome.responseBody).toHaveLength(2000);
  });

  it("retourne TIMEOUT quand la requête est avortée", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (_url: string, init?: RequestInit) => {
        return new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () => {
            const abortError = new Error("The operation was aborted.");
            abortError.name = "AbortError";
            reject(abortError);
          });
        });
      })
    );

    const outcome = await deliverWebhook({ ...makePayload(), timeoutMs: 5 });

    expect(outcome.ok).toBe(false);
    expect(outcome.statusCode).toBeNull();
    expect(outcome.errorCode).toBe("TIMEOUT");
  });

  it("retourne NETWORK_ERROR sur une erreur fetch", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("ECONNREFUSED");
      })
    );

    const outcome = await deliverWebhook(makePayload());

    expect(outcome.ok).toBe(false);
    expect(outcome.errorCode).toBe("NETWORK_ERROR");
    expect(outcome.errorMessage).toBe("ECONNREFUSED");
  });
});
