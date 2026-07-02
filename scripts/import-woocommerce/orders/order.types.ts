import {
  type CurrencyCode,
  type OrderStatus,
  type PaymentMethodType,
  type PaymentStatus,
} from "../../../src/generated/prisma/client";

export type ImportedOrderAddressInput = {
  firstName: string | null;
  lastName: string | null;
  company: string | null;
  line1: string;
  line2: string | null;
  postalCode: string;
  city: string;
  region: string | null;
  countryCode: string;
  phone: string | null;
};

export type ImportedOrderLineInput = {
  productId: string | null;
  variantId: string | null;
  quantity: number;
  unitPriceAmount: string;
  lineSubtotalAmount: string;
  lineDiscountAmount: string;
  lineTaxAmount: string;
  lineTotalAmount: string;
  productName: string;
  sku: string | null;
};

export type ImportedOrderInput = {
  externalId: string;
  sourceId: string;
  orderNumber: string;
  status: OrderStatus;
  currencyCode: CurrencyCode;
  subtotalAmount: string;
  shippingAmount: string;
  discountAmount: string;
  taxAmount: string;
  totalAmount: string;
  customerId: string | null;
  customerEmail: string | null;
  customerFirstName: string | null;
  customerLastName: string | null;
  notes: string | null;
  billingAddress: ImportedOrderAddressInput | null;
  shippingAddress: ImportedOrderAddressInput | null;
  lines: ImportedOrderLineInput[];
  paymentMethodType: PaymentMethodType;
  paymentStatus: PaymentStatus;
  placedAt: Date | null;
  /**
   * Renseigné uniquement quand `status === COMPLETED` et que WooCommerce
   * fournit `date_completed`. Sert à créer un Shipment minimal cohérent avec
   * le libellé "Expédiée" affiché en admin pour ce statut — jamais fabriqué,
   * `null` si WooCommerce ne fournit pas la date.
   */
  shippedAt: Date | null;
};

export type ImportOrdersResult = {
  imported: number;
  updated: number;
};
