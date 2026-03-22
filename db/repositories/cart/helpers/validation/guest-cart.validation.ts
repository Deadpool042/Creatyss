import { z } from "zod";
import { GuestCartRepositoryError } from "@db-cart/guest/types/guest-cart.types";

const guestTokenSchema = z.string().trim().min(32).max(512);

export function parseGuestCartToken(input: unknown): string {
  const result = guestTokenSchema.safeParse(input);

  if (!result.success) {
    throw new GuestCartRepositoryError(
      "guest_cart_token_invalid",
      "Le token de panier invité est invalide."
    );
  }

  return result.data;
}
