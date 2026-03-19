import type { Prisma } from "@prisma/client";
import { prisma } from "@/db/prisma-client";
import { normalizeMoneyString, moneyStringToCents, centsToMoneyString } from "@/lib/money";

import type {
  GuestCartVariant,
  GuestCartItemReference,
  GuestCartLine,
  GuestCart,
  GuestCheckoutDetails,
  GuestCheckoutIssueCode,
  GuestCheckoutContext,
} from "./guest-cart.types";
export type {
  GuestCartVariant,
  GuestCartItemReference,
  GuestCartLine,
  GuestCart,
  GuestCheckoutDetails,
  GuestCheckoutIssueCode,
  GuestCheckoutContext,
};

function isValidNumericId(value: string): boolean {
  return /^[0-9]+$/.test(value);
}

// --- Internal availability helpers ---

function isGuestCartVariantAvailable(v: {
  status: string;
  stock_quantity: number;
  products: { status: string };
}): boolean {
  return v.products.status === "published" && v.status === "published" && v.stock_quantity > 0;
}

function isGuestCartLineAvailable(v: {
  status: string;
  stock_quantity: number;
  products: { status: string };
  quantity: number;
}): boolean {
  return (
    v.products.status === "published" &&
    v.status === "published" &&
    v.stock_quantity >= v.quantity &&
    v.stock_quantity > 0
  );
}

// --- Internal mappers ---

function mapPrismaVariant(row: {
  id: bigint;
  product_id: bigint;
  name: string;
  color_name: string;
  color_hex: string | null;
  sku: string;
  price: Prisma.Decimal;
  stock_quantity: number;
  status: string;
  products: { slug: string; name: string; status: string };
}): GuestCartVariant {
  return {
    id: row.id.toString(),
    productId: row.product_id.toString(),
    productSlug: row.products.slug,
    productName: row.products.name,
    productStatus: row.products.status as GuestCartVariant["productStatus"],
    name: row.name,
    colorName: row.color_name,
    colorHex: row.color_hex,
    sku: row.sku,
    price: normalizeMoneyString(row.price.toString()),
    stockQuantity: row.stock_quantity,
    status: row.status as GuestCartVariant["status"],
    isAvailable: isGuestCartVariantAvailable({ ...row, products: row.products }),
  };
}

function mapPrismaCartLine(item: {
  id: bigint;
  product_variant_id: bigint;
  quantity: number;
  created_at: Date;
  updated_at: Date;
  product_variants: {
    product_id: bigint;
    name: string;
    color_name: string;
    color_hex: string | null;
    sku: string;
    price: Prisma.Decimal;
    stock_quantity: number;
    status: string;
    products: { id: bigint; slug: string; name: string; status: string };
  };
}): GuestCartLine {
  const pv = item.product_variants;
  const unitPrice = normalizeMoneyString(pv.price.toString());
  const lineTotal = centsToMoneyString(moneyStringToCents(unitPrice) * item.quantity);

  return {
    id: item.id.toString(),
    variantId: item.product_variant_id.toString(),
    quantity: item.quantity,
    productId: pv.products.id.toString(),
    productSlug: pv.products.slug,
    productName: pv.products.name,
    variantName: pv.name,
    colorName: pv.color_name,
    colorHex: pv.color_hex,
    sku: pv.sku,
    unitPrice,
    lineTotal,
    isAvailable: isGuestCartLineAvailable({
      status: pv.status,
      stock_quantity: pv.stock_quantity,
      products: pv.products,
      quantity: item.quantity,
    }),
    createdAt: item.created_at.toISOString(),
    updatedAt: item.updated_at.toISOString(),
  };
}

function mapPrismaCheckoutDetails(row: {
  id: bigint;
  cart_id: bigint;
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
  created_at: Date;
  updated_at: Date;
}): GuestCheckoutDetails {
  return {
    id: row.id.toString(),
    cartId: row.cart_id.toString(),
    customerEmail: row.customer_email,
    customerFirstName: row.customer_first_name,
    customerLastName: row.customer_last_name,
    customerPhone: row.customer_phone,
    shippingAddressLine1: row.shipping_address_line_1,
    shippingAddressLine2: row.shipping_address_line_2,
    shippingPostalCode: row.shipping_postal_code,
    shippingCity: row.shipping_city,
    shippingCountryCode: row.shipping_country_code as "FR" | null,
    billingSameAsShipping: row.billing_same_as_shipping,
    billingFirstName: row.billing_first_name,
    billingLastName: row.billing_last_name,
    billingPhone: row.billing_phone,
    billingAddressLine1: row.billing_address_line_1,
    billingAddressLine2: row.billing_address_line_2,
    billingPostalCode: row.billing_postal_code,
    billingCity: row.billing_city,
    billingCountryCode: row.billing_country_code as "FR" | null,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

function buildGuestCart(
  cartId: string,
  items: Parameters<typeof mapPrismaCartLine>[0][]
): GuestCart {
  const lines = items.map(mapPrismaCartLine);
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);
  const subtotalCents = lines.reduce((sum, line) => sum + moneyStringToCents(line.lineTotal), 0);

  return {
    id: cartId,
    itemCount,
    subtotal: centsToMoneyString(subtotalCents),
    lines,
  };
}

function getGuestCheckoutIssues(cart: GuestCart | null): GuestCheckoutIssueCode[] {
  if (cart === null || cart.lines.length === 0) {
    return ["empty_cart"];
  }

  if (cart.lines.some((line) => !line.isAvailable)) {
    return ["cart_unavailable"];
  }

  return [];
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

export async function addGuestCartItemQuantity(input: {
  cartId: string;
  variantId: string;
  quantity: number;
}): Promise<void> {
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

export async function updateGuestCartItemQuantity(input: {
  cartId: string;
  itemId: string;
  quantity: number;
}): Promise<boolean> {
  if (!isValidNumericId(input.cartId) || !isValidNumericId(input.itemId)) {
    return false;
  }

  const result = await prisma.cart_items.updateMany({
    where: { id: BigInt(input.itemId), cart_id: BigInt(input.cartId) },
    data: { quantity: input.quantity },
  });

  return result.count > 0;
}

export async function removeGuestCartItem(input: {
  cartId: string;
  itemId: string;
}): Promise<boolean> {
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
