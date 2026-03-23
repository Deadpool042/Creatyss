import { z } from "zod";
import { CartRepositoryError } from "@db-cart/core";
import type {
  AddCartLineInput,
  CreateCartInput,
  UpdateCartLineQuantityInput,
} from "@db-cart/core/types/cart.types";

const nonEmptyStringSchema = z.string().trim().min(1);
const positiveQuantitySchema = z.number().int().positive();
const optionalNullableTrimmedStringSchema = z
  .string()
  .trim()
  .nullish()
  .transform((value) => {
    if (value === undefined) {
      return undefined;
    }

    return value || null;
  });
const optionalNullableEmailSchema = z
  .string()
  .trim()
  .email()
  .nullish()
  .transform((value) => {
    if (value === undefined) {
      return undefined;
    }

    if (value === null) {
      return null;
    }

    return value.toLowerCase();
  });
const createCartInputSchema = z.object({
  storeId: nonEmptyStringSchema,
  currencyCode: nonEmptyStringSchema,
  customerId: optionalNullableTrimmedStringSchema,
  email: optionalNullableEmailSchema,
  expiresAt: z.date().nullable().optional(),
});
const addCartLineInputSchema = z.object({
  cartId: nonEmptyStringSchema,
  variantId: nonEmptyStringSchema,
  quantity: positiveQuantitySchema,
});
const updateCartLineQuantityInputSchema = z.object({
  cartId: nonEmptyStringSchema,
  lineId: nonEmptyStringSchema,
  quantity: positiveQuantitySchema,
});

export function parseCreateCartInput(input: CreateCartInput): CreateCartInput {
  const result = createCartInputSchema.safeParse(input);

  if (!result.success) {
    const issue = result.error.issues[0];

    switch (issue?.path[0]) {
      case "storeId":
        throw new CartRepositoryError("cart_store_invalid", "Boutique panier invalide.");
      case "currencyCode":
        throw new CartRepositoryError("cart_currency_invalid", "Devise panier invalide.");
      case "email":
        throw new CartRepositoryError("cart_email_invalid", "Email de panier invalide.");
      case "expiresAt":
        throw new CartRepositoryError(
          "cart_expires_at_invalid",
          "Date d'expiration du panier invalide."
        );
      default:
        throw new CartRepositoryError("cart_store_invalid", "Les données du panier sont invalides.");
    }
  }

  return {
    storeId: result.data.storeId,
    currencyCode: result.data.currencyCode,
    customerId: result.data.customerId ?? null,
    email: result.data.email ?? null,
    expiresAt: result.data.expiresAt ?? null,
  };
}

export function parseAddCartLineInput(input: AddCartLineInput): AddCartLineInput {
  const result = addCartLineInputSchema.safeParse(input);

  if (!result.success) {
    const issue = result.error.issues[0];

    switch (issue?.path[0]) {
      case "cartId":
        throw new CartRepositoryError("cart_id_invalid", "Panier invalide.");
      case "variantId":
        throw new CartRepositoryError("cart_variant_invalid", "Variante invalide.");
      case "quantity":
        throw new CartRepositoryError(
          "cart_quantity_invalid",
          "La quantité de ligne panier doit être un entier positif."
        );
      default:
        throw new CartRepositoryError(
          "cart_line_invalid",
          "Les données de ligne panier sont invalides."
        );
    }
  }

  return result.data;
}

export function parseUpdateCartLineQuantityInput(
  input: UpdateCartLineQuantityInput
): UpdateCartLineQuantityInput {
  const result = updateCartLineQuantityInputSchema.safeParse(input);

  if (!result.success) {
    const issue = result.error.issues[0];

    switch (issue?.path[0]) {
      case "cartId":
        throw new CartRepositoryError("cart_id_invalid", "Panier invalide.");
      case "lineId":
        throw new CartRepositoryError("cart_line_invalid", "Ligne panier invalide.");
      case "quantity":
        throw new CartRepositoryError(
          "cart_quantity_invalid",
          "La quantité de ligne panier doit être un entier positif."
        );
      default:
        throw new CartRepositoryError(
          "cart_line_invalid",
          "Les données de ligne panier sont invalides."
        );
    }
  }

  return result.data;
}
