import { db } from "@/core/db";
import { normalizeMoneyString } from "@/core/money";
import { createOrderReference, isValidOrderReference } from "@/entities/order/order-reference";
import {
  toAppOrderStatus,
  toAppPaymentStatus,
  type PrismaOrderStatus,
  type PrismaPaymentStatus,
} from "@/entities/order/order-status";
import {
  mapCheckoutPaymentMethodToPrisma,
  type CheckoutPaymentMethod,
} from "@/features/commerce/checkout/types/checkout-payment-method.types";
import {
  OrderRepositoryError,
  type PaymentStatus,
  type PaymentProvider,
  type PaymentMethod,
  type OrderLine,
  type OrderPayment,
  type PublicOrderConfirmation,
  type OrderEmailContext,
} from "./order.types";
export {
  OrderRepositoryError,
  type PaymentStatus,
  type PaymentProvider,
  type PaymentMethod,
  type OrderLine,
  type OrderPayment,
  type PublicOrderConfirmation,
  type OrderEmailContext,
};

type CreatedOrderRow = { id: string; reference: string };
type PostgreSqlErrorLike = Error & { code: string; constraint?: string };


function isPostgreSqlErrorLike(error: unknown): error is PostgreSqlErrorLike {
  if (!(error instanceof Error)) return false;
  return typeof (error as PostgreSqlErrorLike).code === "string";
}

function mapPaymentMethod(methodType: string | null): PaymentMethod {
  switch (methodType) {
    case "CARD": return "card";
    case "BANK_TRANSFER": return "bank_transfer";
    case "CASH_ON_DELIVERY": return "cash_on_delivery";
    default: return "other";
  }
}

function mapPaymentProvider(provider: string | null): PaymentProvider {
  if (provider === "stripe") return "stripe";
  return provider ? "manual" : null;
}

function mapPublicOrderPayment(input: {
  paymentStatus: PrismaPaymentStatus | null;
  provider: string | null;
  methodType: string | null;
  amountCaptured: string | null;
  totalAmount: string;
  providerReference: string | null;
}): OrderPayment {
  return {
    status: input.paymentStatus ? toAppPaymentStatus(input.paymentStatus) : "pending",
    provider: mapPaymentProvider(input.provider),
    method: mapPaymentMethod(input.methodType),
    amount: normalizeMoneyString(input.amountCaptured ?? input.totalAmount),
    currency: "eur",
  };
}

function mapPublicOrderLine(input: {
  id: string;
  variantId: string | null;
  productName: string;
  variantName: string | null;
  sku: string | null;
  unitPriceAmount: string;
  quantity: number;
  lineTotalAmount: string;
  createdAt: Date;
}): OrderLine {
  return {
    id: input.id,
    sourceProductVariantId: input.variantId,
    productName: input.productName,
    variantName: input.variantName,
    colorName: null,
    colorHex: null,
    sku: input.sku,
    unitPrice: normalizeMoneyString(input.unitPriceAmount),
    quantity: input.quantity,
    lineTotal: normalizeMoneyString(input.lineTotalAmount),
    createdAt: input.createdAt.toISOString(),
  };
}

function mapPublicOrderConfirmation(input: {
  id: string;
  reference: string;
  status: PrismaOrderStatus;
  customerEmail: string;
  customerFirstName: string;
  customerLastName: string;
  customerPhone: string | null;
  shippingAddressLine1: string;
  shippingAddressLine2: string | null;
  shippingPostalCode: string;
  shippingCity: string;
  shippingCountryCode: "FR";
  billingSameAsShipping: boolean;
  billingFirstName: string | null;
  billingLastName: string | null;
  billingPhone: string | null;
  billingAddressLine1: string | null;
  billingAddressLine2: string | null;
  billingPostalCode: string | null;
  billingCity: string | null;
  billingCountryCode: "FR" | null;
  shippedAt: Date | null;
  trackingReference: string | null;
  subtotalAmount: string;
  shippingAmount: string;
  totalAmount: string;
  payment: OrderPayment;
  createdAt: Date;
  updatedAt: Date;
  lines: OrderLine[];
}): PublicOrderConfirmation {
  return {
    id: input.id,
    reference: input.reference,
    status: toAppOrderStatus(input.status),
    customerEmail: input.customerEmail,
    customerFirstName: input.customerFirstName,
    customerLastName: input.customerLastName,
    customerPhone: input.customerPhone,
    shippingAddressLine1: input.shippingAddressLine1,
    shippingAddressLine2: input.shippingAddressLine2,
    shippingPostalCode: input.shippingPostalCode,
    shippingCity: input.shippingCity,
    shippingCountryCode: input.shippingCountryCode,
    billingSameAsShipping: input.billingSameAsShipping,
    billingFirstName: input.billingFirstName,
    billingLastName: input.billingLastName,
    billingPhone: input.billingPhone,
    billingAddressLine1: input.billingAddressLine1,
    billingAddressLine2: input.billingAddressLine2,
    billingPostalCode: input.billingPostalCode,
    billingCity: input.billingCity,
    billingCountryCode: input.billingCountryCode,
    shippedAt: input.shippedAt ? input.shippedAt.toISOString() : null,
    trackingReference: input.trackingReference,
    subtotalAmount: normalizeMoneyString(input.subtotalAmount),
    shippingAmount: normalizeMoneyString(input.shippingAmount),
    totalAmount: normalizeMoneyString(input.totalAmount),
    payment: input.payment,
    createdAt: input.createdAt.toISOString(),
    updatedAt: input.updatedAt.toISOString(),
    lines: input.lines,
  };
}

export async function createOrderFromGuestCartToken(
  cartToken: string,
  paymentMethod: CheckoutPaymentMethod
): Promise<CreatedOrderRow> {
  return db.$transaction(async (tx) => {
    const cart = await tx.cart.findUnique({
      where: { id: cartToken },
      include: {
        lines: {
          include: {
            product: { select: { slug: true } },
            variant: { select: { slug: true } },
          },
        },
      },
    });
    if (!cart || cart.status !== "ACTIVE" || cart.lines.length === 0) {
      throw new OrderRepositoryError("empty_cart", "Cart is empty or not found.");
    }

    const checkout = await tx.checkout.findFirst({
      where: {
        cartId: cartToken,
        storeId: cart.storeId,
        status: { in: ["OPEN", "READY"] },
      },
      include: { addresses: true, shippingSelection: true },
      orderBy: { createdAt: "desc" },
    });
    if (!checkout) {
      throw new OrderRepositoryError("missing_checkout", "Checkout not found.");
    }

    if (!checkout.shippingSelection) {
      throw new OrderRepositoryError(
        "missing_shipping_selection",
        "No shipping method selected."
      );
    }

    const shippingMethodId = checkout.shippingSelection.shippingMethodId;
    const shippingMethod = shippingMethodId
      ? await tx.shippingMethod.findUnique({ where: { id: shippingMethodId } })
      : await tx.shippingMethod.findUnique({
          where: { storeId_code: { storeId: cart.storeId, code: checkout.shippingSelection.methodCode } },
        });

    if (!shippingMethod) {
      throw new OrderRepositoryError(
        "shipping_method_unavailable",
        "Shipping method no longer exists."
      );
    }

    if (shippingMethod.status !== "ACTIVE") {
      throw new OrderRepositoryError(
        "shipping_method_unavailable",
        "Shipping method is no longer active."
      );
    }

    if (shippingMethod.storeId !== cart.storeId) {
      throw new OrderRepositoryError(
        "shipping_method_unavailable",
        "Shipping method does not belong to this store."
      );
    }

    // Stock validation — Step A: load InventoryItems for all variants in cart
    const variantIds = cart.lines.map((l) => l.variantId).filter(Boolean);
    const inventoryItems = await tx.inventoryItem.findMany({
      where: { storeId: cart.storeId, variantId: { in: variantIds } },
      select: { id: true, variantId: true, onHandQuantity: true, reservedQuantity: true },
    });
    const inventoryMap = new Map(inventoryItems.map((i) => [i.variantId, i]));

    // Stock validation — Step B: check availability per line
    for (const line of cart.lines) {
      if (!line.variantId) continue;
      const inv = inventoryMap.get(line.variantId);
      if (!inv) {
        throw new OrderRepositoryError(
          "insufficient_stock",
          "Stock insuffisant pour un article du panier."
        );
      }
      if (inv.onHandQuantity - inv.reservedQuantity < line.quantity) {
        throw new OrderRepositoryError(
          "insufficient_stock",
          "Stock insuffisant pour un article du panier."
        );
      }
    }

    const subtotalCents = cart.lines.reduce(
      (sum, line) =>
        sum + Math.round(Number(line.unitPriceAmount) * line.quantity * 100),
      0
    );

    if (
      shippingMethod.minSubtotalAmount !== null &&
      subtotalCents < Math.round(Number(shippingMethod.minSubtotalAmount) * 100)
    ) {
      throw new OrderRepositoryError(
        "shipping_method_unavailable",
        "Cart subtotal is below the minimum for this shipping method."
      );
    }

    if (
      shippingMethod.maxSubtotalAmount !== null &&
      subtotalCents > Math.round(Number(shippingMethod.maxSubtotalAmount) * 100)
    ) {
      throw new OrderRepositoryError(
        "shipping_method_unavailable",
        "Cart subtotal exceeds the maximum for this shipping method."
      );
    }

    const shippingCents = Math.round(Number(shippingMethod.amount) * 100);
    const totalCents = subtotalCents + shippingCents;

    const shippingAddress = checkout.addresses.find((a) => a.type === "SHIPPING") ?? null;

    const storeSettings = await tx.store.findUnique({
      where: { id: cart.storeId },
      select: { orderNumberPrefix: true },
    });
    const orderPrefix = storeSettings?.orderNumberPrefix ?? undefined;

    let createdOrder: CreatedOrderRow | undefined;
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const orderNumber = createOrderReference(orderPrefix);
      try {
        const order = await tx.order.create({
          data: {
            storeId: cart.storeId,
            customerId: checkout.customerId ?? cart.customerId,
            cartId: cart.id,
            checkoutId: checkout.id,
            orderNumber,
            status: "PENDING",
            currencyCode: cart.currencyCode,
            subtotalAmount: subtotalCents / 100,
            shippingAmount: shippingCents / 100,
            discountAmount: 0,
            taxAmount: 0,
            totalAmount: totalCents / 100,
            customerEmail: checkout.email,
            customerFirstName: shippingAddress?.firstName ?? null,
            customerLastName: shippingAddress?.lastName ?? null,
            placedAt: new Date(),
            lines: {
              create: cart.lines.map((line) => {
                const lineTotalAmount =
                  Math.round(Number(line.unitPriceAmount) * line.quantity * 100) / 100;
                return {
                  productId: line.productId,
                  variantId: line.variantId,
                  quantity: line.quantity,
                  unitPriceAmount: line.unitPriceAmount,
                  compareAtAmount: line.compareAtAmount,
                  lineSubtotalAmount: lineTotalAmount,
                  lineDiscountAmount: 0,
                  lineTaxAmount: 0,
                  lineTotalAmount,
                  productName: line.productName,
                  variantName: line.variantName ?? null,
                  sku: line.sku ?? null,
                  productSlug: line.product.slug,
                  variantSlug: line.variant.slug ?? null,
                };
              }),
            },
            addresses: {
              create: checkout.addresses.map((addr) => ({
                type: addr.type as "BILLING" | "SHIPPING",
                firstName: addr.firstName,
                lastName: addr.lastName,
                company: addr.company,
                line1: addr.line1,
                line2: addr.line2,
                postalCode: addr.postalCode,
                city: addr.city,
                region: addr.region,
                countryCode: addr.countryCode,
                phone: addr.phone,
              })),
            },
            shippingSelection: {
              create: {
                shippingMethodId: shippingMethod.id,
                methodCode: shippingMethod.code,
                methodName: shippingMethod.name,
                amount: shippingMethod.amount,
                currencyCode: shippingMethod.currencyCode,
              },
            },
          },
          select: { id: true, orderNumber: true },
        });
        createdOrder = { id: order.id, reference: order.orderNumber };
        break;
      } catch (error) {
        if (
          isPostgreSqlErrorLike(error) &&
          error.code === "23505" &&
          error.constraint === "orders_store_id_order_number_key"
        ) {
          continue;
        }
        throw error;
      }
    }

    if (!createdOrder) {
      throw new OrderRepositoryError("create_failed", "Order reference generation failed.");
    }

    // Stock decrement — Step C: update onHandQuantity and create InventoryMovement per line
    for (const line of cart.lines) {
      if (!line.variantId) continue;
      const inv = inventoryMap.get(line.variantId);
      if (!inv) continue;
      await tx.inventoryItem.update({
        where: { id: inv.id },
        data: { onHandQuantity: { decrement: line.quantity } },
      });
      await tx.inventoryMovement.create({
        data: {
          inventoryItemId: inv.id,
          type: "CONSUMPTION",
          quantityDelta: -line.quantity,
          referenceType: "order",
          referenceId: createdOrder.id,
        },
      });
    }

    // Create Payment in the same transaction — atomicity guaranteed
    await tx.payment.create({
      data: {
        orderId: createdOrder.id,
        storeId: cart.storeId,
        currencyCode: cart.currencyCode,
        amountAuthorized: totalCents / 100,
        status: "PENDING",
        methodType: mapCheckoutPaymentMethodToPrisma(paymentMethod),
        provider: null,
        providerReference: null,
        providerPaymentId: null,
      },
    });

    // Mark cart CONVERTED and checkout COMPLETED
    await Promise.all([
      tx.cart.update({
        where: { id: cart.id },
        data: { status: "CONVERTED", convertedAt: new Date() },
      }),
      tx.checkout.update({
        where: { id: checkout.id },
        data: { status: "COMPLETED", completedAt: new Date() },
      }),
    ]);

    return createdOrder;
  });
}

export async function findPublicOrderByReference(reference: string): Promise<PublicOrderConfirmation | null> {
  if (!isValidOrderReference(reference)) return null;

  const order = await db.order.findFirst({
    where: { orderNumber: reference },
    include: {
      addresses: true,
      lines: { orderBy: { createdAt: "asc" } },
      payments: {
        take: 1,
        orderBy: { createdAt: "desc" },
        select: {
          status: true,
          provider: true,
          methodType: true,
          amountCaptured: true,
          providerReference: true,
        },
      },
      shipments: {
        take: 1,
        orderBy: [{ shippedAt: "desc" }, { createdAt: "desc" }],
        select: { shippedAt: true, trackingNumber: true },
      },
    },
  });
  if (!order) return null;

  const shippingAddress = order.addresses.find((address) => address.type === "SHIPPING");
  if (!shippingAddress || !order.customerEmail || !order.customerFirstName || !order.customerLastName) {
    return null;
  }

  const billingAddress = order.addresses.find((address) => address.type === "BILLING") ?? null;
  const latestPayment = order.payments[0] ?? null;
  const latestShipment = order.shipments[0] ?? null;
  const lines = order.lines.map((line) =>
    mapPublicOrderLine({
      id: line.id,
      variantId: line.variantId,
      productName: line.productName,
      variantName: line.variantName,
      sku: line.sku,
      unitPriceAmount: String(line.unitPriceAmount),
      quantity: line.quantity,
      lineTotalAmount: String(line.lineTotalAmount),
      createdAt: line.createdAt,
    })
  );

  return mapPublicOrderConfirmation({
    id: order.id,
    reference: order.orderNumber,
    status: order.status as PrismaOrderStatus,
    customerEmail: order.customerEmail,
    customerFirstName: order.customerFirstName,
    customerLastName: order.customerLastName,
    customerPhone: shippingAddress.phone,
    shippingAddressLine1: shippingAddress.line1,
    shippingAddressLine2: shippingAddress.line2,
    shippingPostalCode: shippingAddress.postalCode,
    shippingCity: shippingAddress.city,
    shippingCountryCode: shippingAddress.countryCode === "FR" ? "FR" : "FR",
    billingSameAsShipping: billingAddress === null,
    billingFirstName: billingAddress?.firstName ?? null,
    billingLastName: billingAddress?.lastName ?? null,
    billingPhone: billingAddress?.phone ?? null,
    billingAddressLine1: billingAddress?.line1 ?? null,
    billingAddressLine2: billingAddress?.line2 ?? null,
    billingPostalCode: billingAddress?.postalCode ?? null,
    billingCity: billingAddress?.city ?? null,
    billingCountryCode: billingAddress?.countryCode === "FR" ? "FR" : null,
    shippedAt: latestShipment?.shippedAt ?? null,
    trackingReference: latestShipment?.trackingNumber ?? null,
    subtotalAmount: String(order.subtotalAmount ?? 0),
    shippingAmount: String(order.shippingAmount ?? 0),
    totalAmount: String(order.totalAmount),
    payment: mapPublicOrderPayment({
      paymentStatus: (latestPayment?.status as PrismaPaymentStatus | undefined) ?? null,
      provider: latestPayment?.provider ?? null,
      methodType: latestPayment?.methodType ?? null,
      amountCaptured: latestPayment?.amountCaptured ? String(latestPayment.amountCaptured) : null,
      totalAmount: String(order.totalAmount),
      providerReference: latestPayment?.providerReference ?? null,
    }),
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    lines,
  });
}

export async function findOrderEmailContextById(id: string): Promise<OrderEmailContext | null> {
  if (!id || id.trim().length === 0) return null;

  const order = await db.order.findUnique({
    where: { id },
    select: {
      id: true,
      orderNumber: true,
      customerEmail: true,
      customerFirstName: true,
      totalAmount: true,
      shipments: {
        take: 1,
        orderBy: [{ shippedAt: "desc" }, { createdAt: "desc" }],
        select: { trackingNumber: true },
      },
      payments: {
        take: 1,
        orderBy: { createdAt: "desc" },
        select: { methodType: true },
      },
    },
  });
  if (!order || !order.customerEmail || !order.customerFirstName) return null;

  return {
    id: order.id,
    reference: order.orderNumber,
    customerEmail: order.customerEmail,
    customerFirstName: order.customerFirstName,
    totalAmount: normalizeMoneyString(String(order.totalAmount)),
    trackingReference: order.shipments[0]?.trackingNumber ?? null,
    paymentMethod: mapPaymentMethod(order.payments[0]?.methodType ?? null),
  };
}
