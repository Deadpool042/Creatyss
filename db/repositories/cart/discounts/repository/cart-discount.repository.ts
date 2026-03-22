import type {
  AppliedCartDiscount,
  CartDiscountRule,
} from "@db-cart/discounts/types/cart-discount.types";
import type { CartCustomerKind } from "@db-cart/types/ownership";

function isRuleActiveAt(rule: CartDiscountRule, now: Date): boolean {
  if (!rule.isActive) {
    return false;
  }

  if (rule.startsAt !== null && rule.startsAt > now) {
    return false;
  }

  if (rule.endsAt !== null && rule.endsAt < now) {
    return false;
  }

  return true;
}

function doesRuleMatchCustomer(
  rule: CartDiscountRule,
  input: {
    customerId: string | null;
    customerKind: CartCustomerKind | null;
  }
): boolean {
  switch (rule.target) {
    case "all_customers":
      return true;
    case "individual_customers":
      return input.customerKind === "individual";
    case "professional_customers":
      return input.customerKind === "professional";
    case "specific_customer":
      return input.customerId !== null && rule.customerId === input.customerId;
    default:
      return false;
  }
}

function doesRuleMatchThresholds(
  rule: CartDiscountRule,
  input: {
    distinctProductsCount: number;
    cartQuantity: number;
    subtotalCents: number;
  }
): boolean {
  if (
    rule.minimumDistinctProducts !== null &&
    input.distinctProductsCount < rule.minimumDistinctProducts
  ) {
    return false;
  }

  if (rule.minimumCartQuantity !== null && input.cartQuantity < rule.minimumCartQuantity) {
    return false;
  }

  if (rule.minimumSubtotalCents !== null && input.subtotalCents < rule.minimumSubtotalCents) {
    return false;
  }

  return true;
}

function computeDiscountAmountCents(rule: CartDiscountRule, subtotalCents: number): number {
  if (rule.kind === "fixed_amount") {
    return Math.max(0, Math.min(subtotalCents, rule.fixedAmountCents ?? 0));
  }

  if (rule.kind === "percentage") {
    const percentageOff = rule.percentageOff ?? 0;
    return Math.max(0, Math.floor((subtotalCents * percentageOff) / 100));
  }

  return 0;
}

export async function resolveAppliedCartDiscounts(input: {
  now: Date;
  rules: CartDiscountRule[];
  customerId: string | null;
  customerKind: CartCustomerKind | null;
  distinctProductsCount: number;
  cartQuantity: number;
  subtotalCents: number;
}): Promise<AppliedCartDiscount[]> {
  const applicableRules = input.rules
    .filter((rule) => isRuleActiveAt(rule, input.now))
    .filter((rule) =>
      doesRuleMatchCustomer(rule, {
        customerId: input.customerId,
        customerKind: input.customerKind,
      })
    )
    .filter((rule) =>
      doesRuleMatchThresholds(rule, {
        distinctProductsCount: input.distinctProductsCount,
        cartQuantity: input.cartQuantity,
        subtotalCents: input.subtotalCents,
      })
    )
    .sort((left, right) => left.priority - right.priority);

  const appliedDiscounts: AppliedCartDiscount[] = [];
  let nonCombinableAlreadyApplied = false;

  for (const rule of applicableRules) {
    if (nonCombinableAlreadyApplied) {
      break;
    }

    const amountCents = computeDiscountAmountCents(rule, input.subtotalCents);

    if (amountCents <= 0) {
      continue;
    }

    appliedDiscounts.push({
      ruleId: rule.id,
      code: rule.code,
      label: rule.label,
      amountCents,
      scope: rule.scope,
      lineId: null,
    });

    if (!rule.isCombinable) {
      nonCombinableAlreadyApplied = true;
    }
  }

  return appliedDiscounts;
}
