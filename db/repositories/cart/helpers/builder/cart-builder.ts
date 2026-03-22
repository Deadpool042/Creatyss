import type {
  AppliedCartDiscount,
  Cart,
  CartLine,
  CartTotals,
} from "@db-cart/core/types/cart.types";
import type { CartCustomerKind, CartOwnerKind } from "@db-cart/types/ownership";

type BuildCartInput = {
  id: string;
  ownerKind: CartOwnerKind;
  customerId: string | null;
  guestToken: string | null;
  customerKind: CartCustomerKind | null;
  lines: CartLine[];
  appliedDiscounts: AppliedCartDiscount[];
  totals: CartTotals;
  createdAt: Date;
  updatedAt: Date;
};

function resolveContainsPhysicalItems(lines: readonly CartLine[]): boolean {
  return lines.some((line) => line.snapshot.productKind !== "digital");
}

function resolveContainsDigitalItems(lines: readonly CartLine[]): boolean {
  return lines.some((line) => line.snapshot.productKind !== "physical");
}

function resolveShippingRequired(lines: readonly CartLine[]): boolean {
  return resolveContainsPhysicalItems(lines);
}

export function buildCart(input: BuildCartInput): Cart {
  const containsPhysicalItems = resolveContainsPhysicalItems(input.lines);
  const containsDigitalItems = resolveContainsDigitalItems(input.lines);

  return {
    id: input.id,
    ownerKind: input.ownerKind,
    customerId: input.customerId,
    guestToken: input.guestToken,
    customerKind: input.customerKind,
    shippingRequired: resolveShippingRequired(input.lines),
    containsPhysicalItems,
    containsDigitalItems,
    lines: [...input.lines],
    appliedDiscounts: [...input.appliedDiscounts],
    totals: input.totals,
    createdAt: input.createdAt,
    updatedAt: input.updatedAt,
  };
}
