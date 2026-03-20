import type { Prisma } from "@prisma/client";

export type TxClient = Prisma.TransactionClient;

export type CheckoutDraftFields = {
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

export type CompleteCheckoutDraft = CheckoutDraftFields & {
  customer_email: string;
  customer_first_name: string;
  customer_last_name: string;
  shipping_address_line_1: string;
  shipping_postal_code: string;
  shipping_city: string;
  shipping_country_code: "FR";
};

export type CartLineData = {
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
