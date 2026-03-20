import { normalizeMoneyString } from "@/lib/money";

import type {
  AdminOrderSummary,
  OrderEmailContext,
  OrderLine,
  OrderPayment,
  OrderStatus,
  PaymentMethod,
  PaymentProvider,
  PaymentStatus,
  PublicOrderConfirmation,
} from "../types/public";
import type {
  AdminOrderSummaryRow,
  OrderEmailContextRow,
  OrderWithPaymentAndItemsRow,
} from "../queries/order-reads.queries";

function mapPrismaOrderLine(
  oi: OrderWithPaymentAndItemsRow["order_items"][number]
): OrderLine {
  return {
    id: oi.id.toString(),
    sourceProductVariantId: oi.source_product_variant_id?.toString() ?? null,
    productName: oi.product_name,
    variantName: oi.variant_name,
    colorName: oi.color_name,
    colorHex: oi.color_hex,
    sku: oi.sku,
    unitPrice: normalizeMoneyString(oi.unit_price.toString()),
    quantity: oi.quantity,
    lineTotal: normalizeMoneyString(oi.line_total.toString()),
    createdAt: oi.created_at.toISOString(),
  };
}

function mapPrismaOrderPayment(
  payment: NonNullable<OrderWithPaymentAndItemsRow["payments"]>
): OrderPayment {
  return {
    status: payment.status as PaymentStatus,
    provider: payment.provider as PaymentProvider,
    method: payment.method as PaymentMethod,
    amount: normalizeMoneyString(payment.amount.toString()),
    currency: payment.currency as "eur",
    stripeCheckoutSessionId: payment.stripe_checkout_session_id,
    stripePaymentIntentId: payment.stripe_payment_intent_id,
  };
}

export function mapPrismaOrder(row: OrderWithPaymentAndItemsRow): PublicOrderConfirmation {
  const payment: OrderPayment = row.payments
    ? mapPrismaOrderPayment(row.payments)
    : {
        status: "pending",
        provider: "stripe",
        method: "card",
        amount: normalizeMoneyString(row.total_amount.toString()),
        currency: "eur",
        stripeCheckoutSessionId: null,
        stripePaymentIntentId: null,
      };

  return {
    id: row.id.toString(),
    reference: row.reference,
    status: row.status as OrderStatus,
    customerEmail: row.customer_email,
    customerFirstName: row.customer_first_name,
    customerLastName: row.customer_last_name,
    customerPhone: row.customer_phone,
    shippingAddressLine1: row.shipping_address_line_1,
    shippingAddressLine2: row.shipping_address_line_2,
    shippingPostalCode: row.shipping_postal_code,
    shippingCity: row.shipping_city,
    shippingCountryCode: row.shipping_country_code as "FR",
    billingSameAsShipping: row.billing_same_as_shipping,
    billingFirstName: row.billing_first_name,
    billingLastName: row.billing_last_name,
    billingPhone: row.billing_phone,
    billingAddressLine1: row.billing_address_line_1,
    billingAddressLine2: row.billing_address_line_2,
    billingPostalCode: row.billing_postal_code,
    billingCity: row.billing_city,
    billingCountryCode: row.billing_country_code as "FR" | null,
    shippedAt: row.shipped_at?.toISOString() ?? null,
    trackingReference: row.tracking_reference,
    totalAmount: normalizeMoneyString(row.total_amount.toString()),
    payment,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
    lines: row.order_items.map(mapPrismaOrderLine),
  };
}

export function mapAdminOrderSummaryRow(row: AdminOrderSummaryRow): AdminOrderSummary {
  return {
    id: row.id.toString(),
    reference: row.reference,
    status: row.status as OrderStatus,
    paymentStatus: (row.payments?.status ?? "pending") as PaymentStatus,
    customerEmail: row.customer_email,
    customerFirstName: row.customer_first_name,
    customerLastName: row.customer_last_name,
    totalAmount: normalizeMoneyString(row.total_amount.toString()),
    lineCount: row._count.order_items,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

export function mapOrderEmailContextRow(row: OrderEmailContextRow): OrderEmailContext {
  return {
    id: row.id.toString(),
    reference: row.reference,
    customerEmail: row.customer_email,
    customerFirstName: row.customer_first_name,
    totalAmount: normalizeMoneyString(row.total_amount.toString()),
    trackingReference: row.tracking_reference,
  };
}
