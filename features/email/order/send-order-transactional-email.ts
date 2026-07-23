"use server";

import {
  createOrderEmailEventIfAbsent,
  markOrderEmailEventFailed,
  markOrderEmailEventSent,
} from "@/features/email/order/order-email.repository";
import { db } from "@/core/db";
import { serverEnv } from "@/core/config/env/server";
import { resolveStoreExecutionPolicy } from "@/core/runtime/resolve-store-execution-policy";
import { resolveEmailProvider } from "@/features/email/providers/resolve-email-provider";
import { findOrderEmailContextById } from "@/features/commerce/orders/lib/order.repository";
import {
  buildOrderEmailTemplate,
  type OrderEmailCopyOverrides,
} from "@/features/email/order/order-email-templates";
import { resolveLocalizedOrderEmailCopy } from "@/features/email/order/resolve-localized-order-email-copy";

import type { OrderEmailEventType } from "./order-email.types";

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

    const store = await db.store.findFirst({
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        replyToEmail: true,
        emailConfirmationEnabled: true,
        emailShippingEnabled: true,
        isProduction: true,
        defaultLocaleCode: true,
      },
    });
    const replyTo = store?.replyToEmail ?? null;

    const policy = resolveStoreExecutionPolicy({ isProduction: store?.isProduction ?? false });
    const { kind: emailProviderKind, provider: emailProvider } = resolveEmailProvider(policy);

    const emailEnabled =
      input.eventType === "order_created"
        ? (store?.emailConfirmationEnabled ?? true)
        : input.eventType === "order_shipped"
          ? (store?.emailShippingEnabled ?? true)
          : true;

    if (!emailEnabled) {
      return;
    }

    const emailEvent = await createOrderEmailEventIfAbsent({
      orderId: order.id,
      eventType: input.eventType,
      recipientEmail: order.customerEmail,
      provider: emailProviderKind,
    });

    if (emailEvent === null) {
      return;
    }

    const orderUrl = new URL(
      `/checkout/confirmation/${order.reference}`,
      serverEnv.appUrl
    ).toString();

    let copyOverrides: OrderEmailCopyOverrides = {};

    if (store?.id) {
      const effectiveLocaleCode = order.localeCode ?? store.defaultLocaleCode;

      copyOverrides = await resolveLocalizedOrderEmailCopy({
        storeId: store.id,
        eventType: input.eventType,
        localeCode: effectiveLocaleCode,
      });
    }

    const template = buildOrderEmailTemplate({
      eventType: input.eventType,
      customerFirstName: order.customerFirstName,
      reference: order.reference,
      totalAmount: order.totalAmount,
      orderUrl,
      trackingReference: order.trackingReference,
      paymentMethod: order.paymentMethod,
      copyOverrides,
    });

    try {
      const result = await emailProvider.sendTransactionalEmail({
        to: order.customerEmail,
        subject: template.subject,
        text: template.text,
        html: template.html,
        replyTo,
      });

      await markOrderEmailEventSent({
        id: emailEvent.id,
        providerMessageId: result.providerMessageId,
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
