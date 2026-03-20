import { centsToMoneyString, moneyStringToCents, normalizeMoneyString } from "@/lib/money";
import { resolveOrderStatusTransition } from "@/entities/order/order-status-transition";

import { OrderRepositoryError, type OrderStatus } from "../types/public";

import type {
  CartLineData,
  CheckoutDraftFields,
  CompleteCheckoutDraft,
} from "../types/internal";

export function isValidNumericId(value: string): boolean {
  return /^[0-9]+$/.test(value);
}

export function isValidOrderReference(value: string): boolean {
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

export function assertCompleteCheckoutDraft(
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

export function assertOrderSourceLinesCanBeOrdered(lines: readonly CartLineData[]): void {
  if (lines.length === 0) {
    throw new OrderRepositoryError("empty_cart", "Guest cart is empty.");
  }

  if (lines.some((line) => !sourceLineIsAvailable(line))) {
    throw new OrderRepositoryError("cart_unavailable", "Guest cart is no longer available.");
  }
}

export function calculateOrderTotalAmount(lines: readonly CartLineData[]): string {
  const totalCents = lines.reduce((sum, line) => {
    const unitPrice = normalizeMoneyString(line.product_variants.price.toString());
    return sum + moneyStringToCents(unitPrice) * line.quantity;
  }, 0);

  return centsToMoneyString(totalCents);
}

export function getOrderStatusTransitionOrThrow(currentStatus: OrderStatus, nextStatus: OrderStatus) {
  const transition = resolveOrderStatusTransition({ currentStatus, nextStatus });

  if (!transition.ok) {
    throw new OrderRepositoryError(
      "invalid_status_transition",
      "Order status transition is invalid."
    );
  }

  return transition;
}
