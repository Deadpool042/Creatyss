import {
  CurrencyCode,
  OrderStatus,
  PaymentMethodType,
  PaymentStatus,
} from "../../../src/generated/prisma/client";
import { normalizeMoneyToDecimalString } from "../normalizers/money";
import { toNullableText } from "../normalizers/text";
import type { WooAddress, WooOrder, WooOrderLineItem } from "../schemas";
import { logWarn } from "../shared/logging";
import type {
  ImportedOrderAddressInput,
  ImportedOrderInput,
  ImportedOrderLineInput,
} from "./order.types";

// Table de correspondance statut WooCommerce -> OrderStatus Creatyss.
// `OrderStatus` n'a pas d'équivalent "REFUNDED" : choix assumé de mapper
// "refunded" vers COMPLETED plutôt que de perdre l'information, avec une
// trace explicite ajoutée dans `Order.notes` (voir buildOrderNotes).
// Tout statut WooCommerce non listé retombe sur PENDING avec un avertissement
// journalisé — jamais de throw pour un statut imprévu, ce qui stopperait
// l'import de toutes les autres commandes.
export function mapWooOrderStatusToOrderStatus(wooStatus: string): OrderStatus {
  switch (wooStatus) {
    case "completed":
      return OrderStatus.COMPLETED;
    case "processing":
      return OrderStatus.PROCESSING;
    case "pending":
    case "on-hold":
      return OrderStatus.PENDING;
    case "cancelled":
    case "failed":
    case "trash":
      return OrderStatus.CANCELLED;
    case "refunded":
      return OrderStatus.COMPLETED;
    default:
      logWarn(`Statut de commande WooCommerce inconnu: "${wooStatus}" — fallback vers PENDING.`);
      return OrderStatus.PENDING;
  }
}

const KNOWN_CURRENCY_CODES = new Set<string>(Object.values(CurrencyCode));

// `Order.currencyCode` est un enum fermé (EUR/USD/GBP/CHF/CAD) alors que
// WooCommerce renvoie une chaîne libre. La boutique Creatyss n'adresse que la
// France (cf. `entities/checkout/guest-checkout-input.ts`, pays "FR" en dur),
// donc EUR est le fallback par défaut plutôt que de faire échouer tout
// l'import d'une commande sur une devise imprévue.
function mapWooCurrency(currency: string): CurrencyCode {
  const normalized = currency.trim().toUpperCase();

  if (KNOWN_CURRENCY_CODES.has(normalized)) {
    return normalized as CurrencyCode;
  }

  logWarn(`Devise WooCommerce inconnue: "${currency}" — fallback vers EUR.`);
  return CurrencyCode.EUR;
}

function toRequiredDecimalString(value: string | null | undefined): string {
  return normalizeMoneyToDecimalString(value) ?? "0.00";
}

function mapWooAddress(
  address: WooAddress,
  phone: string | null
): ImportedOrderAddressInput | null {
  const line1 = address.address_1.trim();

  if (line1.length === 0) {
    return null;
  }

  return {
    firstName: toNullableText(address.first_name),
    lastName: toNullableText(address.last_name),
    company: toNullableText(address.company),
    line1,
    line2: toNullableText(address.address_2),
    postalCode: address.postcode.trim(),
    city: address.city.trim(),
    region: toNullableText(address.state),
    countryCode: address.country.trim() || "FR",
    phone,
  };
}

function mapPaymentMethodType(wooPaymentMethod: string): PaymentMethodType {
  if (wooPaymentMethod === "bacs") {
    return PaymentMethodType.BANK_TRANSFER;
  }

  if (wooPaymentMethod === "cod") {
    return PaymentMethodType.CASH_ON_DELIVERY;
  }

  return PaymentMethodType.OTHER;
}

// `PaymentStatus` n'a pas de valeur générique "PAID" : CAPTURED est la valeur
// la plus proche d'un paiement effectivement encaissé côté WooCommerce. On la
// retient pour les commandes COMPLETED/PROCESSING ; PENDING (défaut Prisma)
// pour tout le reste, plutôt que d'inventer une valeur non prévue par l'enum.
function mapPaymentStatus(orderStatus: OrderStatus): PaymentStatus {
  if (orderStatus === OrderStatus.COMPLETED || orderStatus === OrderStatus.PROCESSING) {
    return PaymentStatus.CAPTURED;
  }

  return PaymentStatus.PENDING;
}

// Best-effort : subtotal (avant remise) / total (après remise, hors taxe) /
// total_tax fournis par WooCommerce. La remise de ligne est déduite comme
// `subtotal - total` (jamais négative). Le prix unitaire est déduit de
// `subtotal / quantity` faute de champ WooCommerce fiable et systématique
// pour le prix unitaire hors remise.
function computeLineAmounts(item: WooOrderLineItem): {
  unitPriceAmount: string;
  lineSubtotalAmount: string;
  lineDiscountAmount: string;
  lineTaxAmount: string;
  lineTotalAmount: string;
} {
  const subtotal = Number(normalizeMoneyToDecimalString(item.subtotal) ?? "0");
  const total = Number(normalizeMoneyToDecimalString(item.total) ?? "0");
  const totalTax = Number(normalizeMoneyToDecimalString(item.total_tax) ?? "0");
  const quantity = item.quantity > 0 ? item.quantity : 1;
  const discount = Math.max(0, subtotal - total);
  const unitPrice = subtotal / quantity;

  return {
    unitPriceAmount: unitPrice.toFixed(2),
    lineSubtotalAmount: subtotal.toFixed(2),
    lineDiscountAmount: discount.toFixed(2),
    lineTaxAmount: totalTax.toFixed(2),
    lineTotalAmount: total.toFixed(2),
  };
}

function buildOrderNotes(wooOrder: WooOrder): string | null {
  const parts: string[] = [];

  if (wooOrder.status === "refunded") {
    parts.push("[WooCommerce] statut original: refunded");
  }

  const customerNote = toNullableText(wooOrder.customer_note);

  if (customerNote) {
    parts.push(customerNote);
  }

  return parts.length > 0 ? parts.join(" | ") : null;
}

export function mapWooOrderToImportedOrder(
  wooOrder: WooOrder,
  customerIdByExternalId: ReadonlyMap<string, string>,
  productIdByExternalId: ReadonlyMap<string, string>,
  variantIdByExternalId: ReadonlyMap<string, string>
): ImportedOrderInput {
  const status = mapWooOrderStatusToOrderStatus(wooOrder.status);
  const currencyCode = mapWooCurrency(wooOrder.currency);

  // `customer_id` WooCommerce à 0 signifie une commande passée en invité côté
  // WooCommerce ; un id non résolu (client jamais importé/skippé) ne doit pas
  // bloquer l'import de la commande : `customerId` reste `null`, le snapshot
  // `customerEmail`/`customerFirstName`/`customerLastName` est toujours rempli.
  const customerId =
    wooOrder.customer_id > 0
      ? (customerIdByExternalId.get(`woo_customer:${wooOrder.customer_id}`) ?? null)
      : null;

  const lines: ImportedOrderLineInput[] = wooOrder.line_items.map((item) => {
    const amounts = computeLineAmounts(item);

    return {
      productId: productIdByExternalId.get(`woo_product:${item.product_id}`) ?? null,
      variantId:
        item.variation_id > 0
          ? (variantIdByExternalId.get(`woo_variation:${item.variation_id}`) ?? null)
          : null,
      quantity: item.quantity,
      productName: item.name.trim(),
      sku: toNullableText(item.sku),
      ...amounts,
    };
  });

  const subtotalAmount =
    lines.length > 0
      ? lines.reduce((sum, line) => sum + Number(line.lineSubtotalAmount), 0).toFixed(2)
      : toRequiredDecimalString(wooOrder.total);

  return {
    externalId: `woo_order:${wooOrder.id}`,
    sourceId: String(wooOrder.id),
    orderNumber: `WOO-${wooOrder.number}`,
    status,
    currencyCode,
    subtotalAmount,
    shippingAmount: toRequiredDecimalString(wooOrder.shipping_total),
    discountAmount: toRequiredDecimalString(wooOrder.discount_total),
    taxAmount: toRequiredDecimalString(wooOrder.total_tax),
    totalAmount: toRequiredDecimalString(wooOrder.total),
    customerId,
    customerEmail: toNullableText(wooOrder.billing.email),
    customerFirstName: toNullableText(wooOrder.billing.first_name),
    customerLastName: toNullableText(wooOrder.billing.last_name),
    notes: buildOrderNotes(wooOrder),
    billingAddress: mapWooAddress(wooOrder.billing, toNullableText(wooOrder.billing.phone)),
    shippingAddress: mapWooAddress(wooOrder.shipping, null),
    lines,
    paymentMethodType: mapPaymentMethodType(wooOrder.payment_method),
    paymentStatus: mapPaymentStatus(status),
    placedAt: wooOrder.date_created ? new Date(wooOrder.date_created) : null,
  };
}
