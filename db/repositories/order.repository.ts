import { Prisma } from "@prisma/client";
import { prisma } from "@/db/prisma-client";
import { normalizeMoneyString, moneyStringToCents, centsToMoneyString } from "@/lib/money";
import { listOrderEmailEventsByOrderId } from "@/db/repositories/order-email.repository";
import { createOrderReference } from "@/entities/order/order-reference";
import { resolveOrderStatusTransition } from "@/entities/order/order-status-transition";
import {
  OrderRepositoryError,
  type CreateOrderFromGuestCartResult,
  type OrderStatus,
  type PaymentStatus,
  type PaymentProvider,
  type PaymentMethod,
  type OrderLine,
  type OrderPayment,
  type PublicOrderConfirmation,
  type AdminOrderSummary,
  type OrderEmailContext,
  type AdminOrderDetail,
  type ShipOrderInput,
  type UpdateOrderStatusInput,
} from "./order.types";

// --- Internal types ---

type TxClient = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];

type CheckoutDraftFields = {
  customer_email: string | null;
  customer_first_name: string | null;
  customer_last_name: string | null;
  customer_phone: string | null;
  shipping_address_line_1: string | null;
  shipping_address_line_2: string | null;
  shipping_postal_code: string | null;
  shipping_city: string | null;
  shipping_country_code: string | null;
  billing_same_as_shipping: boolean;
  billing_first_name: string | null;
  billing_last_name: string | null;
  billing_phone: string | null;
  billing_address_line_1: string | null;
  billing_address_line_2: string | null;
  billing_postal_code: string | null;
  billing_city: string | null;
  billing_country_code: string | null;
};

// Required fields after validation — billing fields remain nullable (valid when billingSameAsShipping)
type CompleteCheckoutDraft = CheckoutDraftFields & {
  customer_email: string;
  customer_first_name: string;
  customer_last_name: string;
  shipping_address_line_1: string;
  shipping_postal_code: string;
  shipping_city: string;
  shipping_country_code: "FR";
};

type CartLineData = {
  id: bigint;
  product_variant_id: bigint;
  quantity: number;
  product_variants: {
    name: string;
    color_name: string;
    color_hex: string | null;
    sku: string;
    price: Prisma.Decimal;
    stock_quantity: number;
    status: string;
    products: { name: string; status: string };
  };
};

// --- Validation helpers ---

function isValidNumericId(value: string): boolean {
  return /^[0-9]+$/.test(value);
}

function isValidOrderReference(value: string): boolean {
  return /^CRY-[A-Z0-9]{10}$/.test(value);
}

function checkoutDraftIsComplete(
  draft: CheckoutDraftFields | null
): draft is CompleteCheckoutDraft {
  if (draft === null) {
    return false;
  }

  if (
    draft.customer_email === null ||
    draft.customer_first_name === null ||
    draft.customer_last_name === null ||
    draft.shipping_address_line_1 === null ||
    draft.shipping_postal_code === null ||
    draft.shipping_city === null ||
    draft.shipping_country_code !== "FR"
  ) {
    return false;
  }

  if (draft.billing_same_as_shipping) {
    return true;
  }

  return (
    draft.billing_first_name !== null &&
    draft.billing_last_name !== null &&
    draft.billing_address_line_1 !== null &&
    draft.billing_postal_code !== null &&
    draft.billing_city !== null &&
    draft.billing_country_code === "FR"
  );
}

function assertCompleteCheckoutDraft(
  draft: CheckoutDraftFields | null
): asserts draft is CompleteCheckoutDraft {
  if (!checkoutDraftIsComplete(draft)) {
    throw new OrderRepositoryError("missing_checkout", "Checkout draft is missing.");
  }
}

function sourceLineIsAvailable(line: CartLineData): boolean {
  return (
    line.product_variants.products.status === "published" &&
    line.product_variants.status === "published" &&
    line.product_variants.stock_quantity >= line.quantity &&
    line.product_variants.stock_quantity > 0
  );
}

function assertOrderSourceLinesCanBeOrdered(lines: readonly CartLineData[]): void {
  if (lines.length === 0) {
    throw new OrderRepositoryError("empty_cart", "Guest cart is empty.");
  }

  if (lines.some((line) => !sourceLineIsAvailable(line))) {
    throw new OrderRepositoryError("cart_unavailable", "Guest cart is no longer available.");
  }
}

function calculateOrderTotalAmount(lines: readonly CartLineData[]): string {
  const totalCents = lines.reduce((sum, line) => {
    const unitPrice = normalizeMoneyString(line.product_variants.price.toString());
    return sum + moneyStringToCents(unitPrice) * line.quantity;
  }, 0);

  return centsToMoneyString(totalCents);
}

// --- Transaction helpers ---

async function restockOrderItemsInTx(tx: TxClient, orderId: bigint): Promise<void> {
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

function getOrderStatusTransitionOrThrow(currentStatus: OrderStatus, nextStatus: OrderStatus) {
  const transition = resolveOrderStatusTransition({ currentStatus, nextStatus });

  if (!transition.ok) {
    throw new OrderRepositoryError(
      "invalid_status_transition",
      "Order status transition is invalid."
    );
  }

  return transition;
}

// --- Internal mappers ---

function mapPrismaOrderLine(oi: {
  id: bigint;
  source_product_variant_id: bigint | null;
  product_name: string;
  variant_name: string;
  color_name: string;
  color_hex: string | null;
  sku: string;
  unit_price: Prisma.Decimal;
  quantity: number;
  line_total: Prisma.Decimal;
  created_at: Date;
}): OrderLine {
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

function mapPrismaOrderPayment(payment: {
  status: string;
  provider: string;
  method: string;
  amount: Prisma.Decimal;
  currency: string;
  stripe_checkout_session_id: string | null;
  stripe_payment_intent_id: string | null;
}): OrderPayment {
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

type OrderWithPaymentAndItems = {
  id: bigint;
  reference: string;
  status: string;
  customer_email: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_phone: string | null;
  shipping_address_line_1: string;
  shipping_address_line_2: string | null;
  shipping_postal_code: string;
  shipping_city: string;
  shipping_country_code: string;
  billing_same_as_shipping: boolean;
  billing_first_name: string | null;
  billing_last_name: string | null;
  billing_phone: string | null;
  billing_address_line_1: string | null;
  billing_address_line_2: string | null;
  billing_postal_code: string | null;
  billing_city: string | null;
  billing_country_code: string | null;
  shipped_at: Date | null;
  tracking_reference: string | null;
  total_amount: Prisma.Decimal;
  created_at: Date;
  updated_at: Date;
  payments: {
    status: string;
    provider: string;
    method: string;
    amount: Prisma.Decimal;
    currency: string;
    stripe_checkout_session_id: string | null;
    stripe_payment_intent_id: string | null;
  } | null;
  order_items: Parameters<typeof mapPrismaOrderLine>[0][];
};

function mapPrismaOrder(row: OrderWithPaymentAndItems): PublicOrderConfirmation {
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

// --- Order reads ---

const ORDER_SELECT = {
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
    orderBy: { id: "asc" as const },
  },
} as const;

export async function findPublicOrderByReference(
  reference: string
): Promise<PublicOrderConfirmation | null> {
  if (!isValidOrderReference(reference)) {
    return null;
  }

  const row = await prisma.orders.findUnique({
    where: { reference },
    select: ORDER_SELECT,
  });

  return row !== null ? mapPrismaOrder(row) : null;
}

export async function findOrderEmailContextById(id: string): Promise<OrderEmailContext | null> {
  if (!isValidNumericId(id)) {
    return null;
  }

  const row = await prisma.orders.findUnique({
    where: { id: BigInt(id) },
    select: {
      id: true,
      reference: true,
      customer_email: true,
      customer_first_name: true,
      total_amount: true,
      tracking_reference: true,
    },
  });

  if (row === null) {
    return null;
  }

  return {
    id: row.id.toString(),
    reference: row.reference,
    customerEmail: row.customer_email,
    customerFirstName: row.customer_first_name,
    totalAmount: normalizeMoneyString(row.total_amount.toString()),
    trackingReference: row.tracking_reference,
  };
}

export async function listAdminOrders(): Promise<AdminOrderSummary[]> {
  const rows = await prisma.orders.findMany({
    orderBy: [{ created_at: "desc" }, { id: "desc" }],
    select: {
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
    },
  });

  return rows.map((row) => ({
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
  }));
}

export async function findAdminOrderById(id: string): Promise<AdminOrderDetail | null> {
  if (!isValidNumericId(id)) {
    return null;
  }

  const row = await prisma.orders.findUnique({
    where: { id: BigInt(id) },
    select: ORDER_SELECT,
  });

  if (row === null) {
    return null;
  }

  const emailEvents = await listOrderEmailEventsByOrderId(id);

  return {
    ...mapPrismaOrder(row),
    emailEvents,
  };
}

// --- Order mutations ---

// Serializable isolation reproduces the SELECT FOR UPDATE semantics of the original SQL:
// - Prevents concurrent checkouts from the same cart from over-decrementing stock.
// - Ensures cart existence check and deletion are atomic.
// The retry loop for reference uniqueness is OUTSIDE the transaction since a failed
// Prisma operation inside a transaction causes an automatic rollback.
export async function createOrderFromGuestCartToken(
  token: string
): Promise<CreateOrderFromGuestCartResult> {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const reference = createOrderReference();

    try {
      return await prisma.$transaction(
        async (tx) => {
          // 1. Find cart
          const cartRow = await tx.carts.findUnique({
            where: { token },
            select: { id: true },
          });

          if (cartRow === null) {
            throw new OrderRepositoryError("missing_cart", "Guest cart is missing.");
          }

          // 2. Find checkout draft
          const draftRow = await tx.cart_checkout_details.findUnique({
            where: { cart_id: cartRow.id },
          });

          assertCompleteCheckoutDraft(draftRow);

          // 3. Read cart items with variant + product info (locked via Serializable)
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

          // 4. Validate
          assertOrderSourceLinesCanBeOrdered(cartItems);

          // 5. Calculate total
          const totalAmount = calculateOrderTotalAmount(cartItems);

          // 6. Create order (with the pre-generated reference from the outer loop)
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

          // 7. Create pending payment
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

          // 8. Create order items
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

          // 9. Decrement stock (atomic per variant via { decrement })
          for (const line of cartItems) {
            await tx.product_variants.update({
              where: { id: line.product_variant_id },
              data: { stock_quantity: { decrement: line.quantity } },
            });
          }

          // 10. Delete cart (cascades to cart_items and cart_checkout_details)
          await tx.carts.delete({ where: { id: cartRow.id } });

          return { id: createdOrder.id.toString(), reference: createdOrder.reference };
        },
        { isolationLevel: "Serializable" }
      );
    } catch (error) {
      // Retry on reference uniqueness collision only
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        const target = (error.meta as { target?: string[] } | undefined)?.target;
        if (Array.isArray(target) && target.includes("reference")) {
          continue;
        }
      }

      if (error instanceof OrderRepositoryError) {
        throw error;
      }

      throw error;
    }
  }

  throw new OrderRepositoryError("create_failed", "Order reference generation failed.");
}

export async function updateOrderStatus(
  input: UpdateOrderStatusInput
): Promise<OrderStatus | null> {
  if (!isValidNumericId(input.id)) {
    return null;
  }

  const orderId = BigInt(input.id);

  // Serializable isolation reproduces SELECT FOR UPDATE semantics.
  return prisma
    .$transaction(
      async (tx) => {
        const row = await tx.orders.findUnique({
          where: { id: orderId },
          select: { status: true },
        });

        if (row === null) {
          throw new OrderRepositoryError("missing_order", "Order is missing.");
        }

        const transition = getOrderStatusTransitionOrThrow(
          row.status as OrderStatus,
          input.nextStatus
        );

        if (transition.shouldRestock) {
          await restockOrderItemsInTx(tx, orderId);
        }

        await tx.orders.update({
          where: { id: orderId },
          data: { status: input.nextStatus },
        });

        return input.nextStatus;
      },
      { isolationLevel: "Serializable" }
    )
    .catch((error) => {
      if (error instanceof OrderRepositoryError) throw error;
      throw error;
    });
}

export async function shipOrder(input: ShipOrderInput): Promise<OrderStatus | null> {
  if (!isValidNumericId(input.id)) {
    return null;
  }

  const orderId = BigInt(input.id);

  // Serializable isolation reproduces SELECT FOR UPDATE semantics.
  return prisma
    .$transaction(
      async (tx) => {
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
            tracking_reference: input.trackingReference,
          },
        });

        return "shipped" as OrderStatus;
      },
      { isolationLevel: "Serializable" }
    )
    .catch((error) => {
      if (error instanceof OrderRepositoryError) throw error;
      throw error;
    });
}
