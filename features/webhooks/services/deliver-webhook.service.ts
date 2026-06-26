import "server-only";
import { createHmac } from "node:crypto";

export type WebhookDeliveryPayload = {
  endpointId: string;
  targetUrl: string;
  secret: string | null; // secretHash du WebhookEndpoint (stocké en clair V1)
  timeoutMs: number;
  eventType: string;
  body: Record<string, unknown>;
};

export type WebhookDeliveryOutcome = {
  ok: boolean;
  statusCode: number | null;
  responseBody: string | null;
  errorCode: string | null;
  errorMessage: string | null;
};

export async function deliverWebhook(
  payload: WebhookDeliveryPayload
): Promise<WebhookDeliveryOutcome> {
  const bodyJson = JSON.stringify(payload.body);
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Webhook-Event": payload.eventType,
  };

  if (payload.secret) {
    const sig = createHmac("sha256", payload.secret).update(bodyJson).digest("hex");
    headers["X-Webhook-Signature"] = `sha256=${sig}`;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), payload.timeoutMs);

    let res: Response;
    try {
      res = await fetch(payload.targetUrl, {
        method: "POST",
        headers,
        body: bodyJson,
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    const responseBody = await res.text().catch(() => null);
    return {
      ok: res.ok,
      statusCode: res.status,
      responseBody: responseBody?.slice(0, 2000) ?? null,
      errorCode: res.ok ? null : "HTTP_ERROR",
      errorMessage: res.ok ? null : `HTTP ${res.status}`,
    };
  } catch (err) {
    const isTimeout = err instanceof Error && err.name === "AbortError";
    return {
      ok: false,
      statusCode: null,
      responseBody: null,
      errorCode: isTimeout ? "TIMEOUT" : "NETWORK_ERROR",
      errorMessage: err instanceof Error ? err.message : String(err),
    };
  }
}
