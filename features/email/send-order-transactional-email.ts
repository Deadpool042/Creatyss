"use server";

import {
  createOrderEmailEventIfAbsent,
  markOrderEmailEventFailed,
  markOrderEmailEventSent,
  type OrderEmailEventType,
} from "@/db/repositories/order-email.repository";
import { findOrderEmailContextById } from "@/db/repositories/order.repository";
import { buildOrderEmailTemplate } from "@/features/email/order-email-templates";
import { sendEmail } from "@/lib/email";
import { env } from "@/lib/env";

function formatEmailError(error: unknown): string {
  if (error instanceof Error) {
    return error.message.slice(0, 500);
  }

  return "Unexpected email error.";
}

export async function sendOrderTransactionalEmail(input: {
  orderId: string;
  eventType: OrderEmailEventType;
}): Promise<void> {
  try {
    const order = await findOrderEmailContextById(input.orderId);

    if (order === null) {
      return;
    }

    const emailEvent = await createOrderEmailEventIfAbsent({
      orderId: order.id,
      eventType: input.eventType,
      recipientEmail: order.customerEmail,
    });

    if (emailEvent === null) {
      return;
    }

    const orderUrl = new URL(`/checkout/confirmation/${order.reference}`, env.appUrl).toString();
    const template = buildOrderEmailTemplate({
      eventType: input.eventType,
      customerFirstName: order.customerFirstName,
      reference: order.reference,
      totalAmount: order.totalAmount,
      orderUrl,
      trackingReference: order.trackingReference,
    });

    try {
      const providerMessageId = await sendEmail({
        to: order.customerEmail,
        subject: template.subject,
        text: template.text,
        html: template.html,
      });

      await markOrderEmailEventSent({
        id: emailEvent.id,
        providerMessageId,
      });
    } catch (error) {
      console.error(error);
      await markOrderEmailEventFailed({
        id: emailEvent.id,
        lastError: formatEmailError(error),
      });
    }
  } catch (error) {
    console.error(error);
  }
}
