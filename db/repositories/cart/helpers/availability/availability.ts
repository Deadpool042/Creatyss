import type { CartLine, CartLineIssue, CartLineValidity } from "@db-cart/core/types/cart.types";

type ResolveCartLineAvailabilityInput = {
  productExists: boolean;
  productPublished: boolean;
  variantRequired: boolean;
  variantExists: boolean;
  variantPublished: boolean;
  requestedQuantity: number;
  availableQuantity: number | null;
  trackInventory: boolean;
  allowBackorders: boolean;
  unitPriceCents: number | null;
};

function resolveIssues(input: ResolveCartLineAvailabilityInput): CartLineIssue[] {
  const issues: CartLineIssue[] = [];

  if (!input.productExists) {
    issues.push({
      code: "product_not_found",
      message: "Le produit n'existe plus.",
    });
    return issues;
  }

  if (!input.productPublished) {
    issues.push({
      code: "product_unavailable",
      message: "Le produit n'est plus disponible à la vente.",
    });
  }

  if (input.variantRequired && !input.variantExists) {
    issues.push({
      code: "variant_not_found",
      message: "La variante n'existe plus.",
    });
    return issues;
  }

  if (input.variantExists && !input.variantPublished) {
    issues.push({
      code: "variant_unavailable",
      message: "La variante n'est plus disponible à la vente.",
    });
  }

  if (input.unitPriceCents === null) {
    issues.push({
      code: "price_changed",
      message: "Le prix de cette ligne n'est plus disponible.",
    });
  }

  if (
    input.trackInventory &&
    !input.allowBackorders &&
    input.availableQuantity !== null &&
    input.requestedQuantity > input.availableQuantity
  ) {
    issues.push({
      code: "stock_reduced",
      message: "La quantité demandée n'est plus disponible.",
    });
  }

  return issues;
}

function resolveValidity(issues: readonly CartLineIssue[]): CartLineValidity {
  if (issues.length === 0) {
    return "valid";
  }

  if (issues.every((issue) => issue.code === "stock_reduced")) {
    return "warning";
  }

  return "blocking";
}

export function resolveCartLineAvailability(
  line: CartLine,
  input: ResolveCartLineAvailabilityInput
): CartLine {
  const issues = resolveIssues(input);
  const validity = resolveValidity(issues);

  return {
    ...line,
    validity,
    issues,
  };
}
