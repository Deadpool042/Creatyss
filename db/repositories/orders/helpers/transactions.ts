import { centsToMoneyString, moneyStringToCents, normalizeMoneyString } from "@/lib/money";

import {
  OrderRepositoryError,
  type CreateOrderFromGuestCartResult,
  type OrderStatus,
} from "../types/public";
import type { TxClient } from "../types/internal";
import {
  assertCompleteCheckoutDraft,
  assertOrderSourceLinesCanBeOrdered,
  calculateOrderTotalAmount,
  getOrderStatusTransitionOrThrow,
} from "./validation";

export async function restockOrderItemsInTx(tx: TxClient, orderId: bigint): Promise<void> {
  const groups = await tx.order_items.groupBy({
    by: ["source_product_variant_id"],
    where: {
      order_id: orderId,
      source_product_variant_id: { not: null },
    },
    _sum: { quantity: true },
  });

  for (const group of groups) {
    if (group.source_product_variant_id === null) {
      continue;
    }

    await tx.product_variants.update({
      where: { id: group.source_product_variant_id },
      data: { stock_quantity: { increment: group._sum.quantity ?? 0 } },
    });
  }
}

export async function createOrderFromGuestCartInTx(
  tx: TxClient,
  token: string,
  reference: string
): Promise<CreateOrderFromGuestCartResult> {
  const cartRow = await tx.carts.findUnique({
    where: { token },
    select: { id: true },
  });

  if (cartRow === null) {
    throw new OrderRepositoryError("missing_cart", "Guest cart is missing.");
  }

  const draftRow = await tx.cart_checkout_details.findUnique({
    where: { cart_id: cartRow.id },
  });

  assertCompleteCheckoutDraft(draftRow);

  const cartItems = await tx.cart_items.findMany({
    where: { cart_id: cartRow.id },
    orderBy: [{ created_at: "asc" }, { id: "asc" }],
    select: {
      id: true,
      product_variant_id: true,
      quantity: true,
      product_variants: {
        select: {
          name: true,
          color_name: true,
          color_hex: true,
          sku: true,
          price: true,
          stock_quantity: true,
          status: true,
          products: { select: { name: true, status: true } },
        },
      },
    },
  });

  assertOrderSourceLinesCanBeOrdered(cartItems);

  const totalAmount = calculateOrderTotalAmount(cartItems);

  const createdOrder = await tx.orders.create({
    data: {
      reference,
      status: "pending",
      customer_email: draftRow.customer_email,
      customer_first_name: draftRow.customer_first_name,
      customer_last_name: draftRow.customer_last_name,
      customer_phone: draftRow.customer_phone,
      shipping_address_line_1: draftRow.shipping_address_line_1,
      shipping_address_line_2: draftRow.shipping_address_line_2,
      shipping_postal_code: draftRow.shipping_postal_code,
      shipping_city: draftRow.shipping_city,
      shipping_country_code: draftRow.shipping_country_code,
      billing_same_as_shipping: draftRow.billing_same_as_shipping,
      billing_first_name: draftRow.billing_first_name,
      billing_last_name: draftRow.billing_last_name,
      billing_phone: draftRow.billing_phone,
      billing_address_line_1: draftRow.billing_address_line_1,
      billing_address_line_2: draftRow.billing_address_line_2,
      billing_postal_code: draftRow.billing_postal_code,
      billing_city: draftRow.billing_city,
      billing_country_code: draftRow.billing_country_code,
      total_amount: totalAmount,
    },
    select: { id: true, reference: true },
  });

  await tx.payments.create({
    data: {
      order_id: createdOrder.id,
      provider: "stripe",
      method: "card",
      status: "pending",
      amount: totalAmount,
      currency: "eur",
    },
  });

  await tx.order_items.createMany({
    data: cartItems.map((line) => {
      const unitPrice = normalizeMoneyString(line.product_variants.price.toString());
      const lineTotal = centsToMoneyString(moneyStringToCents(unitPrice) * line.quantity);

      return {
        order_id: createdOrder.id,
        source_product_variant_id: line.product_variant_id,
        product_name: line.product_variants.products.name,
        variant_name: line.product_variants.name,
        color_name: line.product_variants.color_name,
        color_hex: line.product_variants.color_hex,
        sku: line.product_variants.sku,
        unit_price: unitPrice,
        quantity: line.quantity,
        line_total: lineTotal,
      };
    }),
  });

  for (const line of cartItems) {
    await tx.product_variants.update({
      where: { id: line.product_variant_id },
      data: { stock_quantity: { decrement: line.quantity } },
    });
  }

  await tx.carts.delete({ where: { id: cartRow.id } });

  return { id: createdOrder.id.toString(), reference: createdOrder.reference };
}

export async function updateOrderStatusInTx(
  tx: TxClient,
  orderId: bigint,
  nextStatus: OrderStatus
): Promise<OrderStatus> {
  const row = await tx.orders.findUnique({
    where: { id: orderId },
    select: { status: true },
  });

  if (row === null) {
    throw new OrderRepositoryError("missing_order", "Order is missing.");
  }

  const transition = getOrderStatusTransitionOrThrow(row.status as OrderStatus, nextStatus);

  if (transition.shouldRestock) {
    await restockOrderItemsInTx(tx, orderId);
  }

  await tx.orders.update({
    where: { id: orderId },
    data: { status: nextStatus },
  });

  return nextStatus;
}

export async function shipOrderInTx(
  tx: TxClient,
  orderId: bigint,
  trackingReference: string | null
): Promise<OrderStatus> {
  const row = await tx.orders.findUnique({
    where: { id: orderId },
    select: { status: true },
  });

  if (row === null) {
    throw new OrderRepositoryError("missing_order", "Order is missing.");
  }

  getOrderStatusTransitionOrThrow(row.status as OrderStatus, "shipped");

  await tx.orders.update({
    where: { id: orderId },
    data: {
      status: "shipped",
      shipped_at: new Date(),
      tracking_reference: trackingReference,
    },
  });

  return "shipped";
}
