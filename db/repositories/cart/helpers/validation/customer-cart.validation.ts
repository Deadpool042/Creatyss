import { z } from "zod";
import { CustomerCartRepositoryError } from "@db-cart/customer/types/customer-cart.types";

const customerIdSchema = z.string().trim().min(1);

export function parseCustomerCartCustomerId(input: unknown): string {
  const result = customerIdSchema.safeParse(input);

  if (!result.success) {
    throw new CustomerCartRepositoryError(
      "customer_cart_customer_invalid",
      "Le client du panier est invalide."
    );
  }

  return result.data;
}
