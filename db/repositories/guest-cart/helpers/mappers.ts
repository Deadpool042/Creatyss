import type { Prisma } from "@prisma/client";
import { centsToMoneyString, moneyStringToCents, normalizeMoneyString } from "@/lib/money";
import { isGuestCartLineAvailable, isGuestCartVariantAvailable } from "./availability";

import type {
  GuestCartLine,
  GuestCartVariant,
  GuestCheckoutDetails,
} from "../../guest-cart.types";

export type PrismaGuestCartVariantRow = {
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
};

export type PrismaGuestCartLineRow = {
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
};

export type PrismaGuestCheckoutDetailsRow = {
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
};

export function mapPrismaVariant(row: PrismaGuestCartVariantRow): GuestCartVariant {
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

export function mapPrismaCartLine(item: PrismaGuestCartLineRow): GuestCartLine {
  const variant = item.product_variants;
  const unitPrice = normalizeMoneyString(variant.price.toString());
  const lineTotal = centsToMoneyString(moneyStringToCents(unitPrice) * item.quantity);

  return {
    id: item.id.toString(),
    variantId: item.product_variant_id.toString(),
    quantity: item.quantity,
    productId: variant.products.id.toString(),
    productSlug: variant.products.slug,
    productName: variant.products.name,
    variantName: variant.name,
    colorName: variant.color_name,
    colorHex: variant.color_hex,
    sku: variant.sku,
    unitPrice,
    lineTotal,
    isAvailable: isGuestCartLineAvailable({
      status: variant.status,
      stock_quantity: variant.stock_quantity,
      products: variant.products,
      quantity: item.quantity,
    }),
    createdAt: item.created_at.toISOString(),
    updatedAt: item.updated_at.toISOString(),
  };
}

export function mapPrismaCheckoutDetails(
  row: PrismaGuestCheckoutDetailsRow
): GuestCheckoutDetails {
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
