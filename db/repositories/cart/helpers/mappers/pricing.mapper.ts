import type { CartPricingSummary } from "@db-cart/pricing/types/cart-pricing.types";

export function mapCartPricingSummary(pricing: CartPricingSummary): CartPricingSummary {
  return { ...pricing };
}
