import type { GuestCart } from "@db-cart/guest/types/guest-cart.types";

export function mapGuestCart(cart: GuestCart): GuestCart {
  return {
    ...cart,
    lines: cart.lines.map((line) => ({
      ...line,
      issues: [...line.issues],
    })),
    appliedDiscounts: [...cart.appliedDiscounts],
  };
}
