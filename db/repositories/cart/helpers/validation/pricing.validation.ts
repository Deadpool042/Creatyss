import { z } from "zod";
import { CartRepositoryError } from "@db-cart/core/types/cart.types";

const currencyCodeSchema = z
  .string()
  .trim()
  .length(3)
  .transform((value) => value.toUpperCase());

const amountSchema = z.number().int().min(0);

const cartPricingInputSchema = z.object({
  currencyCode: currencyCodeSchema,
  subtotalCents: amountSchema,
  discountCents: amountSchema,
  estimatedShippingCents: amountSchema.nullable(),
  estimatedTaxCents: amountSchema.nullable(),
  estimatedExciseCents: amountSchema.nullable(),
});

export type CartPricingInput = z.infer<typeof cartPricingInputSchema>;

export function parseCartPricingInput(input: unknown): CartPricingInput {
  const result = cartPricingInputSchema.safeParse(input);

  if (!result.success) {
    throw new CartRepositoryError(
      "cart_unavailable",
      "Les données de pricing du panier sont invalides."
    );
  }

  return result.data;
}
