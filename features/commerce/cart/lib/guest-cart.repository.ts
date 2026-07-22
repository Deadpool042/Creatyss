import { db } from "@/core/db";
import { normalizeMoneyString, moneyStringToCents, centsToMoneyString } from "@/core/money";
import type { AvailabilityStatus, CurrencyCode } from "@/prisma-generated/client";
import type {
  GuestCartVariant,
  GuestCartItemReference,
  GuestCartLine,
  GuestCart,
  GuestCheckoutDetails,
  GuestCheckoutShippingSelection,
  GuestCheckoutIssueCode,
  GuestCheckoutContext,
} from "./guest-cart.types";
export type {
  GuestCartVariant,
  GuestCartItemReference,
  GuestCartLine,
  GuestCart,
  GuestCheckoutDetails,
  GuestCheckoutShippingSelection,
  GuestCheckoutIssueCode,
  GuestCheckoutContext,
};

// ---------------------------------------------------------------------------
// Vendabilité (doctrine : `availability` porte la disponibilité vendable,
// `inventory` la vérité de quantité — cf. AGENTS.md, points stabilisés).
// Sans enregistrement de disponibilité, fallback héritage : la vendabilité
// est dérivée des statuts + stock, comme au catalogue
// (catalog-availability.ts).
// ---------------------------------------------------------------------------

const SELLABLE_AVAILABILITY_STATUSES: readonly AvailabilityStatus[] = [
  "AVAILABLE",
  "PREORDER",
  "BACKORDER",
];

function isVariantSellable(
  availabilityRecords: readonly { isSellable: boolean; status: AvailabilityStatus }[]
): boolean {
  const record = availabilityRecords[0];

  if (record === undefined) {
    return true;
  }

  return record.isSellable && SELLABLE_AVAILABILITY_STATUSES.includes(record.status);
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

type CheckoutWithAddresses = {
  id: string;
  cartId: string | null;
  email: string | null;
  createdAt: Date;
  updatedAt: Date;
  addresses: Array<{
    type: string;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    line1: string;
    line2: string | null;
    postalCode: string;
    city: string;
    countryCode: string;
  }>;
  shippingSelection: {
    methodCode: string;
    methodName: string;
    amount: { toNumber: () => number };
    currencyCode: string;
  } | null;
};

function mapGuestCheckoutDetails(checkout: CheckoutWithAddresses): GuestCheckoutDetails {
  const shipping = checkout.addresses.find((a) => a.type === "SHIPPING") ?? null;
  const billing = checkout.addresses.find((a) => a.type === "BILLING") ?? null;
  return {
    id: checkout.id,
    cartId: checkout.cartId ?? "",
    customerEmail: checkout.email,
    customerFirstName: shipping?.firstName ?? null,
    customerLastName: shipping?.lastName ?? null,
    customerPhone: shipping?.phone ?? null,
    shippingAddressLine1: shipping?.line1 ?? null,
    shippingAddressLine2: shipping?.line2 ?? null,
    shippingPostalCode: shipping?.postalCode ?? null,
    shippingCity: shipping?.city ?? null,
    shippingCountryCode: (shipping?.countryCode as "FR") ?? null,
    billingSameAsShipping: billing === null,
    billingFirstName: billing?.firstName ?? null,
    billingLastName: billing?.lastName ?? null,
    billingPhone: billing?.phone ?? null,
    billingAddressLine1: billing?.line1 ?? null,
    billingAddressLine2: billing?.line2 ?? null,
    billingPostalCode: billing?.postalCode ?? null,
    billingCity: billing?.city ?? null,
    billingCountryCode: (billing?.countryCode as "FR") ?? null,
    shippingSelection: checkout.shippingSelection
      ? {
          methodCode: checkout.shippingSelection.methodCode,
          methodName: checkout.shippingSelection.methodName,
          amountCents: Math.round(checkout.shippingSelection.amount.toNumber() * 100),
          currencyCode: checkout.shippingSelection.currencyCode,
        }
      : null,
    createdAt: checkout.createdAt.toISOString(),
    updatedAt: checkout.updatedAt.toISOString(),
  };
}

function getGuestCheckoutIssues(cart: GuestCart | null): GuestCheckoutIssueCode[] {
  if (cart === null || cart.lines.length === 0) return ["empty_cart"];
  if (cart.lines.some((line) => !line.isAvailable)) return ["cart_unavailable"];
  return [];
}

// ---------------------------------------------------------------------------
// Cart lookup / creation
// ---------------------------------------------------------------------------

export async function findGuestCartById(cartId: string): Promise<string | null> {
  if (!cartId || cartId.trim().length === 0) return null;
  await reactivateAbandonedCart(cartId);
  const cart = await db.cart.findUnique({
    where: { id: cartId },
    select: { id: true, status: true },
  });
  return cart?.status === "ACTIVE" ? cart.id : null;
}

// Alias for backward compatibility with callers that still use the token name
export const findGuestCartIdByToken = findGuestCartById;

/**
 * Réactivation d'un panier `ABANDONED` — soit explicite (lien de reprise
 * email, lot 7), soit transparente à la lecture (`findGuestCartById`,
 * `readGuestCartById` : un client qui revient seul sur un panier scanné
 * `ABANDONED` par le cron ne doit pas se voir attribuer un panier neuf —
 * cf. `docs/roadmap/analyses-cockpit-analytique/lot-7-panier-abandonne-effet-bord-cadrage.md`,
 * option A retenue le 2026-07-22). Ne réactive que si le panier est bien
 * `ABANDONED` : un panier déjà `ACTIVE`/`CONVERTED`/`EXPIRED`/`ARCHIVED`
 * n'est pas touché.
 */
export async function reactivateAbandonedCart(cartId: string): Promise<boolean> {
  if (!cartId || cartId.trim().length === 0) return false;

  const { count } = await db.cart.updateMany({
    where: { id: cartId, status: "ABANDONED", archivedAt: null },
    data: { status: "ACTIVE", abandonedAt: null },
  });

  return count === 1;
}

export async function createGuestCart(): Promise<string> {
  const store = await db.store.findFirst({
    where: { archivedAt: null },
    orderBy: { createdAt: "asc" },
    select: { id: true, defaultCurrency: true },
  });
  if (!store) throw new Error("Store not found");

  const cart = await db.cart.create({
    data: {
      storeId: store.id,
      currencyCode: store.defaultCurrency ?? "EUR",
      status: "ACTIVE",
    },
    select: { id: true },
  });
  return cart.id;
}

// ---------------------------------------------------------------------------
// Variant lookup
// ---------------------------------------------------------------------------

export async function findGuestCartVariantById(
  variantId: string
): Promise<GuestCartVariant | null> {
  if (!variantId || variantId.trim().length === 0) return null;
  const variant = await db.productVariant.findUnique({
    where: { id: variantId },
    select: {
      id: true,
      sku: true,
      name: true,
      status: true,
      product: {
        select: {
          id: true,
          slug: true,
          name: true,
          status: true,
          catalogPriceCents: true,
        },
      },
      inventoryItems: {
        select: { onHandQuantity: true, reservedQuantity: true },
        take: 1,
      },
      availabilityRecords: {
        select: { isSellable: true, status: true },
        take: 1,
      },
    },
  });
  if (!variant) return null;
  if (!variant.product.catalogPriceCents) return null;

  const inv = variant.inventoryItems[0];
  const stockQuantity = Math.max(0, (inv?.onHandQuantity ?? 0) - (inv?.reservedQuantity ?? 0));
  const isSellable = isVariantSellable(variant.availabilityRecords);
  const isAvailable =
    variant.product.status === "ACTIVE" &&
    variant.status === "ACTIVE" &&
    isSellable &&
    stockQuantity > 0;

  return {
    id: variant.id,
    productId: variant.product.id,
    productSlug: variant.product.slug,
    productName: variant.product.name,
    productStatus: variant.product.status as GuestCartVariant["productStatus"],
    name: variant.name ?? null,
    sku: variant.sku,
    unitPriceAmount: centsToMoneyString(variant.product.catalogPriceCents),
    stockQuantity,
    status: variant.status as GuestCartVariant["status"],
    isSellable,
    isAvailable,
  };
}

// ---------------------------------------------------------------------------
// Cart line lookups
// ---------------------------------------------------------------------------

export async function findGuestCartItemByVariant(
  cartId: string,
  variantId: string
): Promise<GuestCartItemReference | null> {
  if (!cartId || !variantId) return null;
  const line = await db.cartLine.findUnique({
    where: { cartId_variantId: { cartId, variantId } },
    select: { id: true, variantId: true, quantity: true },
  });
  return line ? { id: line.id, variantId: line.variantId, quantity: line.quantity } : null;
}

export async function findGuestCartItemById(
  cartId: string,
  itemId: string
): Promise<GuestCartItemReference | null> {
  if (!cartId || !itemId) return null;
  const line = await db.cartLine.findFirst({
    where: { id: itemId, cartId },
    select: { id: true, variantId: true, quantity: true },
  });
  return line ? { id: line.id, variantId: line.variantId, quantity: line.quantity } : null;
}

// ---------------------------------------------------------------------------
// Cart line mutations
// ---------------------------------------------------------------------------

export async function addGuestCartItemQuantity(input: {
  cartId: string;
  variantId: string;
  productId: string;
  productName: string;
  variantName: string | null;
  sku: string | null;
  unitPriceAmount: string;
  quantity: number;
}): Promise<void> {
  const existing = await db.cartLine.findUnique({
    where: { cartId_variantId: { cartId: input.cartId, variantId: input.variantId } },
    select: { id: true, quantity: true },
  });

  if (existing) {
    await db.cartLine.update({
      where: { id: existing.id },
      data: { quantity: { increment: input.quantity } },
    });
  } else {
    await db.cartLine.create({
      data: {
        cartId: input.cartId,
        productId: input.productId,
        variantId: input.variantId,
        quantity: input.quantity,
        unitPriceAmount: input.unitPriceAmount,
        productName: input.productName,
        variantName: input.variantName,
        sku: input.sku,
      },
    });
  }
}

export async function updateGuestCartItemQuantity(input: {
  cartId: string;
  itemId: string;
  quantity: number;
}): Promise<boolean> {
  try {
    await db.cartLine.update({
      where: { id: input.itemId, cartId: input.cartId },
      data: { quantity: input.quantity },
    });
    return true;
  } catch {
    return false;
  }
}

export async function removeGuestCartItem(input: {
  cartId: string;
  itemId: string;
}): Promise<boolean> {
  try {
    await db.cartLine.delete({
      where: { id: input.itemId, cartId: input.cartId },
    });
    return true;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Full cart read
// ---------------------------------------------------------------------------

export async function readGuestCartById(cartId: string): Promise<GuestCart | null> {
  if (!cartId || cartId.trim().length === 0) return null;
  await reactivateAbandonedCart(cartId);
  const cart = await db.cart.findUnique({
    where: { id: cartId, status: "ACTIVE" },
    include: {
      lines: {
        include: {
          product: {
            select: { id: true, slug: true, name: true, status: true },
          },
          variant: {
            select: {
              id: true,
              sku: true,
              name: true,
              status: true,
              inventoryItems: {
                select: { onHandQuantity: true, reservedQuantity: true },
                take: 1,
              },
              availabilityRecords: {
                select: { isSellable: true, status: true },
                take: 1,
              },
            },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!cart) return null;

  const lines: GuestCartLine[] = cart.lines.map((line) => {
    const inv = line.variant.inventoryItems[0];
    const availableQty = Math.max(0, (inv?.onHandQuantity ?? 0) - (inv?.reservedQuantity ?? 0));
    const isAvailable =
      line.product.status === "ACTIVE" &&
      line.variant.status === "ACTIVE" &&
      isVariantSellable(line.variant.availabilityRecords) &&
      availableQty >= line.quantity;
    const unitPriceStr = normalizeMoneyString(String(line.unitPriceAmount));
    const lineTotalStr = centsToMoneyString(moneyStringToCents(unitPriceStr) * line.quantity);
    return {
      id: line.id,
      variantId: line.variantId,
      quantity: line.quantity,
      productId: line.product.id,
      productSlug: line.product.slug,
      productName: line.productName,
      variantName: line.variantName ?? null,
      sku: line.sku ?? null,
      unitPriceAmount: unitPriceStr,
      lineTotalAmount: lineTotalStr,
      isAvailable,
      createdAt: line.createdAt.toISOString(),
      updatedAt: line.updatedAt.toISOString(),
    };
  });

  const itemCount = lines.reduce((sum, l) => sum + l.quantity, 0);
  const subtotalCents = lines.reduce((sum, l) => sum + moneyStringToCents(l.lineTotalAmount), 0);
  return {
    id: cart.id,
    itemCount,
    subtotal: centsToMoneyString(subtotalCents),
    lines,
  };
}

// Alias for backward compatibility
export const readGuestCartByToken = readGuestCartById;

// ---------------------------------------------------------------------------
// Checkout details read
// ---------------------------------------------------------------------------

export async function readGuestCheckoutDetailsByCartId(
  cartId: string
): Promise<GuestCheckoutDetails | null> {
  if (!cartId || cartId.trim().length === 0) return null;
  const checkout = await db.checkout.findFirst({
    where: { cartId, status: { in: ["OPEN", "READY"] } },
    include: {
      addresses: true,
      shippingSelection: {
        select: {
          methodCode: true,
          methodName: true,
          amount: true,
          currencyCode: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  if (!checkout) return null;
  return mapGuestCheckoutDetails(checkout);
}

// ---------------------------------------------------------------------------
// Checkout details upsert
// ---------------------------------------------------------------------------

export async function upsertGuestCheckoutDetails(input: {
  cartId: string;
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
}): Promise<GuestCheckoutDetails> {
  const store = await db.store.findFirst({
    where: { archivedAt: null },
    orderBy: { createdAt: "asc" },
    select: { id: true, defaultCurrency: true },
  });
  if (!store) throw new Error("Store not found");

  let checkout = await db.checkout.findFirst({
    where: { cartId: input.cartId, status: { in: ["OPEN", "READY"] } },
    include: { addresses: true },
    orderBy: { createdAt: "desc" },
  });

  if (!checkout) {
    checkout = await db.checkout.create({
      data: {
        storeId: store.id,
        cartId: input.cartId,
        email: input.customerEmail,
        currencyCode: store.defaultCurrency ?? "EUR",
        status: "OPEN",
      },
      include: { addresses: true },
    });
  } else {
    await db.checkout.update({
      where: { id: checkout.id },
      data: { email: input.customerEmail },
    });
  }

  const checkoutId = checkout.id;

  await db.checkoutAddress.upsert({
    where: { checkoutId_type: { checkoutId, type: "SHIPPING" } },
    create: {
      checkoutId,
      type: "SHIPPING",
      firstName: input.customerFirstName,
      lastName: input.customerLastName,
      phone: input.customerPhone,
      line1: input.shippingAddressLine1,
      line2: input.shippingAddressLine2,
      postalCode: input.shippingPostalCode,
      city: input.shippingCity,
      countryCode: input.shippingCountryCode,
    },
    update: {
      firstName: input.customerFirstName,
      lastName: input.customerLastName,
      phone: input.customerPhone,
      line1: input.shippingAddressLine1,
      line2: input.shippingAddressLine2,
      postalCode: input.shippingPostalCode,
      city: input.shippingCity,
      countryCode: input.shippingCountryCode,
    },
  });

  if (!input.billingSameAsShipping && input.billingAddressLine1) {
    await db.checkoutAddress.upsert({
      where: { checkoutId_type: { checkoutId, type: "BILLING" } },
      create: {
        checkoutId,
        type: "BILLING",
        firstName: input.billingFirstName,
        lastName: input.billingLastName,
        phone: input.billingPhone,
        line1: input.billingAddressLine1,
        line2: input.billingAddressLine2 ?? null,
        postalCode: input.billingPostalCode ?? "",
        city: input.billingCity ?? "",
        countryCode: input.billingCountryCode ?? "FR",
      },
      update: {
        firstName: input.billingFirstName,
        lastName: input.billingLastName,
        phone: input.billingPhone,
        line1: input.billingAddressLine1,
        line2: input.billingAddressLine2 ?? null,
        postalCode: input.billingPostalCode ?? "",
        city: input.billingCity ?? "",
        countryCode: input.billingCountryCode ?? "FR",
      },
    });
  } else {
    await db.checkoutAddress.deleteMany({
      where: { checkoutId, type: "BILLING" },
    });
  }

  const updated = await db.checkout.findUnique({
    where: { id: checkoutId },
    include: {
      addresses: true,
      shippingSelection: {
        select: {
          methodCode: true,
          methodName: true,
          amount: true,
          currencyCode: true,
        },
      },
    },
  });
  if (!updated) throw new Error("Checkout save failed");
  return mapGuestCheckoutDetails(updated);
}

// ---------------------------------------------------------------------------
// Checkout shipping selection upsert
// ---------------------------------------------------------------------------

export async function upsertCheckoutShippingSelection(input: {
  checkoutId: string;
  shippingMethodId: string;
  methodCode: string;
  methodName: string;
  amountCents: number;
  currencyCode: CurrencyCode;
}): Promise<void> {
  await db.checkoutShippingSelection.upsert({
    where: { checkoutId: input.checkoutId },
    create: {
      checkoutId: input.checkoutId,
      shippingMethodId: input.shippingMethodId,
      methodCode: input.methodCode,
      methodName: input.methodName,
      amount: input.amountCents / 100,
      currencyCode: input.currencyCode,
    },
    update: {
      shippingMethodId: input.shippingMethodId,
      methodCode: input.methodCode,
      methodName: input.methodName,
      amount: input.amountCents / 100,
      currencyCode: input.currencyCode,
    },
  });
}

// ---------------------------------------------------------------------------
// Full checkout context
// ---------------------------------------------------------------------------

export async function readGuestCheckoutContextByCartId(
  cartId: string
): Promise<GuestCheckoutContext | null> {
  if (!cartId || cartId.trim().length === 0) return null;
  const [cart, draft] = await Promise.all([
    readGuestCartById(cartId),
    readGuestCheckoutDetailsByCartId(cartId),
  ]);
  if (!cart && !draft) return null;
  return { cart, draft, issues: getGuestCheckoutIssues(cart) };
}

// Alias for backward compatibility
export const readGuestCheckoutContextByToken = readGuestCheckoutContextByCartId;
