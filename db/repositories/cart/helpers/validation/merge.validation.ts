import { z } from "zod";
import {
  CartMergeRepositoryError,
  type MergeGuestCartIntoCustomerCartInput,
} from "@db-cart/merge/types/cart-merge.types";

const mergeGuestCartIntoCustomerCartInputSchema = z.object({
  guestToken: z.string().trim().min(32).max(512),
  customerId: z.string().trim().min(1),
});

export function parseMergeGuestCartIntoCustomerCartInput(
  input: unknown
): MergeGuestCartIntoCustomerCartInput {
  const result = mergeGuestCartIntoCustomerCartInputSchema.safeParse(input);

  if (!result.success) {
    const issue = result.error.issues[0];

    switch (issue?.path[0]) {
      case "guestToken":
        throw new CartMergeRepositoryError(
          "cart_merge_guest_not_found",
          "Le panier invité à fusionner est introuvable."
        );
      case "customerId":
        throw new CartMergeRepositoryError(
          "cart_merge_customer_invalid",
          "Le client cible de la fusion est invalide."
        );
      default:
        throw new CartMergeRepositoryError(
          "cart_merge_conflict",
          "Les données de fusion du panier sont invalides."
        );
    }
  }

  return result.data;
}
