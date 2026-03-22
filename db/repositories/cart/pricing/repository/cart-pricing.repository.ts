import type { CartPricingSummary } from "@db-cart/pricing/types/cart-pricing.types";

export async function buildCartPricingSummary(input: {
  currencyCode: string;
  subtotalCents: number;
  discountCents: number;
  estimatedShippingCents: number | null;
  estimatedTaxCents: number | null;
  estimatedExciseCents: number | null;
}): Promise<CartPricingSummary> {
  const discountedSubtotalCents = Math.max(0, input.subtotalCents - input.discountCents);

  const shippingCents = input.estimatedShippingCents ?? 0;
  const taxCents = input.estimatedTaxCents ?? 0;
  const exciseCents = input.estimatedExciseCents ?? 0;

  return {
    currencyCode: input.currencyCode,
    subtotalCents: input.subtotalCents,
    discountCents: input.discountCents,
    discountedSubtotalCents,
    estimatedShippingCents: input.estimatedShippingCents,
    estimatedTaxCents: input.estimatedTaxCents,
    estimatedExciseCents: input.estimatedExciseCents,
    estimatedTotalCents: discountedSubtotalCents + shippingCents + taxCents + exciseCents,
  };
}
