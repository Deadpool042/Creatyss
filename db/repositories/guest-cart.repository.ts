import { prisma } from "@/db/prisma-client";
import { buildGuestCart, getGuestCheckoutIssues } from "./guest-cart/helpers/cart-builder";
import {
  mapPrismaCheckoutDetails,
  mapPrismaVariant,
} from "./guest-cart/helpers/mappers";

import type {
  AddGuestCartItemQuantityInput,
  GuestCart,
  GuestCartVariant,
  GuestCartItemReference,
  GuestCheckoutDetails,
  GuestCheckoutContext,
  RemoveGuestCartItemInput,
  UpdateGuestCartItemQuantityInput,
  UpsertGuestCheckoutDetailsInput,
} from "./guest-cart.types";

function isValidNumericId(value: string): boolean {
  return /^[0-9]+$/.test(value);
}

// --- Public functions ---

export async function findGuestCartIdByToken(token: string): Promise<string | null> {
  const row = await prisma.carts.findUnique({
    where: { token },
    select: { id: true },
  });

  return row?.id.toString() ?? null;
}

export async function createGuestCart(token: string): Promise<string> {
  const row = await prisma.carts.create({
    data: { token },
    select: { id: true },
  });

  return row.id.toString();
}

export async function findGuestCartVariantById(
  variantId: string
): Promise<GuestCartVariant | null> {
  if (!isValidNumericId(variantId)) {
    return null;
  }

  const row = await prisma.product_variants.findUnique({
    where: { id: BigInt(variantId) },
    select: {
      id: true,
      product_id: true,
      name: true,
      color_name: true,
      color_hex: true,
      sku: true,
      price: true,
      stock_quantity: true,
      status: true,
      products: { select: { slug: true, name: true, status: true } },
    },
  });

  return row ? mapPrismaVariant(row) : null;
}

export async function findGuestCartItemByVariant(
  cartId: string,
  variantId: string
): Promise<GuestCartItemReference | null> {
  if (!isValidNumericId(cartId) || !isValidNumericId(variantId)) {
    return null;
  }

  const row = await prisma.cart_items.findUnique({
    where: {
      cart_id_product_variant_id: {
        cart_id: BigInt(cartId),
        product_variant_id: BigInt(variantId),
      },
    },
    select: { id: true, product_variant_id: true, quantity: true },
  });

  if (row === null) return null;

  return {
    id: row.id.toString(),
    variantId: row.product_variant_id.toString(),
    quantity: row.quantity,
  };
}

export async function findGuestCartItemById(
  cartId: string,
  itemId: string
): Promise<GuestCartItemReference | null> {
  if (!isValidNumericId(cartId) || !isValidNumericId(itemId)) {
    return null;
  }

  const row = await prisma.cart_items.findFirst({
    where: { id: BigInt(itemId), cart_id: BigInt(cartId) },
    select: { id: true, product_variant_id: true, quantity: true },
  });

  if (row === null) return null;

  return {
    id: row.id.toString(),
    variantId: row.product_variant_id.toString(),
    quantity: row.quantity,
  };
}

export async function addGuestCartItemQuantity(
  input: AddGuestCartItemQuantityInput
): Promise<void> {
  // Prisma atomic increment on conflict — equivalent to:
  // INSERT ... ON CONFLICT DO UPDATE SET quantity = quantity + excluded.quantity
  await prisma.cart_items.upsert({
    where: {
      cart_id_product_variant_id: {
        cart_id: BigInt(input.cartId),
        product_variant_id: BigInt(input.variantId),
      },
    },
    create: {
      cart_id: BigInt(input.cartId),
      product_variant_id: BigInt(input.variantId),
      quantity: input.quantity,
    },
    update: { quantity: { increment: input.quantity } },
  });
}

export async function updateGuestCartItemQuantity(
  input: UpdateGuestCartItemQuantityInput
): Promise<boolean> {
  if (!isValidNumericId(input.cartId) || !isValidNumericId(input.itemId)) {
    return false;
  }

  const result = await prisma.cart_items.updateMany({
    where: { id: BigInt(input.itemId), cart_id: BigInt(input.cartId) },
    data: { quantity: input.quantity },
  });

  return result.count > 0;
}

export async function removeGuestCartItem(input: RemoveGuestCartItemInput): Promise<boolean> {
  if (!isValidNumericId(input.cartId) || !isValidNumericId(input.itemId)) {
    return false;
  }

  const result = await prisma.cart_items.deleteMany({
    where: { id: BigInt(input.itemId), cart_id: BigInt(input.cartId) },
  });

  return result.count > 0;
}

export async function readGuestCartByToken(token: string): Promise<GuestCart | null> {
  const cartRow = await prisma.carts.findUnique({
    where: { token },
    select: {
      id: true,
      cart_items: {
        select: {
          id: true,
          product_variant_id: true,
          quantity: true,
          created_at: true,
          updated_at: true,
          product_variants: {
            select: {
              product_id: true,
              name: true,
              color_name: true,
              color_hex: true,
              sku: true,
              price: true,
              stock_quantity: true,
              status: true,
              products: { select: { id: true, slug: true, name: true, status: true } },
            },
          },
        },
        orderBy: [{ created_at: "asc" }, { id: "asc" }],
      },
    },
  });

  if (cartRow === null || cartRow.cart_items.length === 0) {
    return null;
  }

  return buildGuestCart(cartRow.id.toString(), cartRow.cart_items);
}

export async function readGuestCheckoutDetailsByCartId(
  cartId: string
): Promise<GuestCheckoutDetails | null> {
  if (!isValidNumericId(cartId)) {
    return null;
  }

  const row = await prisma.cart_checkout_details.findUnique({
    where: { cart_id: BigInt(cartId) },
  });

  return row !== null ? mapPrismaCheckoutDetails(row) : null;
}

export async function upsertGuestCheckoutDetails(
  input: UpsertGuestCheckoutDetailsInput
): Promise<GuestCheckoutDetails> {
  const data = {
    customer_email: input.customerEmail,
    customer_first_name: input.customerFirstName,
    customer_last_name: input.customerLastName,
    customer_phone: input.customerPhone,
    shipping_address_line_1: input.shippingAddressLine1,
    shipping_address_line_2: input.shippingAddressLine2,
    shipping_postal_code: input.shippingPostalCode,
    shipping_city: input.shippingCity,
    shipping_country_code: input.shippingCountryCode,
    billing_same_as_shipping: input.billingSameAsShipping,
    billing_first_name: input.billingFirstName,
    billing_last_name: input.billingLastName,
    billing_phone: input.billingPhone,
    billing_address_line_1: input.billingAddressLine1,
    billing_address_line_2: input.billingAddressLine2,
    billing_postal_code: input.billingPostalCode,
    billing_city: input.billingCity,
    billing_country_code: input.billingCountryCode,
  };

  const row = await prisma.cart_checkout_details.upsert({
    where: { cart_id: BigInt(input.cartId) },
    create: { cart_id: BigInt(input.cartId), ...data },
    update: data,
  });

  return mapPrismaCheckoutDetails(row);
}

export async function readGuestCheckoutContextByToken(
  token: string
): Promise<GuestCheckoutContext | null> {
  const cartId = await findGuestCartIdByToken(token);

  if (cartId === null) {
    return null;
  }

  const [cart, draft] = await Promise.all([
    readGuestCartByToken(token),
    readGuestCheckoutDetailsByCartId(cartId),
  ]);

  return {
    cart,
    draft,
    issues: getGuestCheckoutIssues(cart),
  };
}
