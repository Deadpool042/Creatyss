import { z } from "zod";
import { CartRepositoryError } from "@db-cart/core/types/cart.types";

const idSchema = z.string().trim().min(1);
const quantitySchema = z.number().int().min(1).max(999);

export const cartLineInputSchema = z.object({
  productId: idSchema,
  productVariantId: idSchema.nullable().optional(),
  quantity: quantitySchema,
});

export type CartLineInput = z.infer<typeof cartLineInputSchema>;

export function assertValidCartId(cartId: string): void {
  const result = idSchema.safeParse(cartId);

  if (!result.success) {
    throw new CartRepositoryError("cart_not_found", "Panier introuvable.");
  }
}

export function parseCartLineInput(input: unknown): CartLineInput {
  const result = cartLineInputSchema.safeParse(input);

  if (!result.success) {
    const issue = result.error.issues[0];

    switch (issue?.path[0]) {
      case "productId":
        throw new CartRepositoryError("cart_product_invalid", "Le produit du panier est invalide.");
      case "productVariantId":
        throw new CartRepositoryError(
          "cart_variant_invalid",
          "La variante du panier est invalide."
        );
      case "quantity":
        throw new CartRepositoryError(
          "cart_line_quantity_invalid",
          "La quantité du panier est invalide."
        );
      default:
        throw new CartRepositoryError("cart_unavailable", "Les données du panier sont invalides.");
    }
  }

  return result.data;
}
