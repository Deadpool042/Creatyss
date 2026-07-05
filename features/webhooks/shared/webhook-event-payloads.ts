import {
  WEBHOOK_ORDER_CREATED_BODY_SCHEMA,
  WEBHOOK_ORDER_CREATED_EVENT_TYPE,
} from "./webhook-job.constants";

type OrderCreatedWebhookInput = {
  orderId: string;
  orderReference: string;
  storeId: string;
  occurredAt: Date;
};

export function buildOrderCreatedWebhookBody(
  input: OrderCreatedWebhookInput
): Record<string, unknown> {
  return {
    event: WEBHOOK_ORDER_CREATED_EVENT_TYPE,
    schema: WEBHOOK_ORDER_CREATED_BODY_SCHEMA,
    occurredAt: input.occurredAt.toISOString(),
    data: {
      orderId: input.orderId,
      orderReference: input.orderReference,
      storeId: input.storeId,
    },
  };
}
