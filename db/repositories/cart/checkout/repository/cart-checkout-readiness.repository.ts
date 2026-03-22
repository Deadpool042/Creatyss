import type { Cart } from "@db-cart/core/types/cart.types";
import type {
  CartBlockingIssue,
  CartCheckoutReadiness,
} from "@db-cart/checkout/types/cart-checkout-readiness.types";

function hasBlockingLine(cart: Cart): boolean {
  return cart.lines.some((line) => line.validity === "blocking");
}

function buildBlockingIssues(cart: Cart): CartBlockingIssue[] {
  const issues: CartBlockingIssue[] = [];

  if (cart.lines.length === 0) {
    issues.push({
      code: "empty_cart",
      message: "Le panier est vide.",
    });
  }

  if (hasBlockingLine(cart)) {
    issues.push({
      code: "invalid_line",
      message: "Une ou plusieurs lignes du panier sont invalides.",
    });
  }

  return issues;
}

export async function resolveCartCheckoutReadiness(cart: Cart): Promise<CartCheckoutReadiness> {
  const blockingIssues = buildBlockingIssues(cart);

  return {
    isCheckoutReady: blockingIssues.length === 0,
    blockingIssues,
    warnings: [],
  };
}
