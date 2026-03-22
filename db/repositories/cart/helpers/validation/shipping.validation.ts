import { z } from "zod";
import { CartRepositoryError } from "@db-cart/core/types/cart.types";
import type {
  CartShippingContext,
  CartShippingSelection,
} from "@db-cart/shipping/types/cart-shipping.types";

const countryCodeSchema = z
  .string()
  .trim()
  .length(2)
  .transform((value) => value.toUpperCase());

const postalCodeSchema = z.string().trim().min(1).max(32);

const cartShippingContextSchema = z.object({
  countryCode: countryCodeSchema.nullable(),
  postalCode: postalCodeSchema.nullable(),
});

const cartShippingSelectionSchema = z.object({
  methodCode: z.string().trim().min(1),
  pickupPointId: z.string().trim().min(1).nullable(),
});

export function parseCartShippingContext(input: unknown): CartShippingContext {
  const result = cartShippingContextSchema.safeParse(input);

  if (!result.success) {
    throw new CartRepositoryError(
      "cart_unavailable",
      "Le contexte de livraison du panier est invalide."
    );
  }

  return result.data;
}

export function parseCartShippingSelection(input: unknown): CartShippingSelection {
  const result = cartShippingSelectionSchema.safeParse(input);

  if (!result.success) {
    throw new CartRepositoryError(
      "cart_unavailable",
      "La sélection de livraison du panier est invalide."
    );
  }

  return result.data;
}
