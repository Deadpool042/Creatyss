import { centsToMoneyString, moneyStringToCents } from "@/lib/money";
import { mapPrismaCartLine } from "./mappers";

import type { GuestCart, GuestCheckoutIssueCode } from "../../guest-cart.types";

export function buildGuestCart(
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

export function getGuestCheckoutIssues(cart: GuestCart | null): GuestCheckoutIssueCode[] {
  if (cart === null || cart.lines.length === 0) {
    return ["empty_cart"];
  }

  if (cart.lines.some((line) => !line.isAvailable)) {
    return ["cart_unavailable"];
  }

  return [];
}
