import { Prisma } from "@prisma/client";
import { prisma } from "@/db/prisma-client";

export const orderSelect = Prisma.validator<Prisma.ordersSelect>()({
  id: true,
  reference: true,
  status: true,
  customer_email: true,
  customer_first_name: true,
  customer_last_name: true,
  customer_phone: true,
  shipping_address_line_1: true,
  shipping_address_line_2: true,
  shipping_postal_code: true,
  shipping_city: true,
  shipping_country_code: true,
  billing_same_as_shipping: true,
  billing_first_name: true,
  billing_last_name: true,
  billing_phone: true,
  billing_address_line_1: true,
  billing_address_line_2: true,
  billing_postal_code: true,
  billing_city: true,
  billing_country_code: true,
  shipped_at: true,
  tracking_reference: true,
  total_amount: true,
  created_at: true,
  updated_at: true,
  payments: {
    select: {
      status: true,
      provider: true,
      method: true,
      amount: true,
      currency: true,
      stripe_checkout_session_id: true,
      stripe_payment_intent_id: true,
    },
  },
  order_items: {
    select: {
      id: true,
      source_product_variant_id: true,
      product_name: true,
      variant_name: true,
      color_name: true,
      color_hex: true,
      sku: true,
      unit_price: true,
      quantity: true,
      line_total: true,
      created_at: true,
    },
    orderBy: { id: "asc" },
  },
});

export type OrderWithPaymentAndItemsRow = Prisma.ordersGetPayload<{
  select: typeof orderSelect;
}>;

const adminOrderSummarySelect = Prisma.validator<Prisma.ordersSelect>()({
  id: true,
  reference: true,
  status: true,
  customer_email: true,
  customer_first_name: true,
  customer_last_name: true,
  total_amount: true,
  created_at: true,
  updated_at: true,
  payments: { select: { status: true } },
  _count: { select: { order_items: true } },
});

export type AdminOrderSummaryRow = Prisma.ordersGetPayload<{
  select: typeof adminOrderSummarySelect;
}>;

const orderEmailContextSelect = Prisma.validator<Prisma.ordersSelect>()({
  id: true,
  reference: true,
  customer_email: true,
  customer_first_name: true,
  total_amount: true,
  tracking_reference: true,
});

export type OrderEmailContextRow = Prisma.ordersGetPayload<{
  select: typeof orderEmailContextSelect;
}>;

export async function findPublicOrderRowByReference(reference: string) {
  return prisma.orders.findUnique({
    where: { reference },
    select: orderSelect,
  });
}

export async function findOrderEmailContextRowById(orderId: bigint) {
  return prisma.orders.findUnique({
    where: { id: orderId },
    select: orderEmailContextSelect,
  });
}

export async function listAdminOrderRows() {
  return prisma.orders.findMany({
    orderBy: [{ created_at: "desc" }, { id: "desc" }],
    select: adminOrderSummarySelect,
  });
}

export async function findAdminOrderRowById(orderId: bigint) {
  return prisma.orders.findUnique({
    where: { id: orderId },
    select: orderSelect,
  });
}
