import type { CustomerCart } from "@db-cart/customer/types/customer-cart.types";

export function mapCustomerCart(cart: CustomerCart): CustomerCart {
  return {
    ...cart,
    lines: cart.lines.map((line) => ({
      ...line,
      issues: [...line.issues],
    })),
    appliedDiscounts: [...cart.appliedDiscounts],
  };
}
