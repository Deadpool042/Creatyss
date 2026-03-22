import { mapCartRowToCart } from "@db-cart/helpers/mappers/cart.mapper";
import { mapCustomerCart } from "@db-cart/helpers/mappers/customer-cart.mapper";
import { parseCustomerCartCustomerId } from "@db-cart/helpers/validation/customer-cart.validation";
import {
  CustomerCartRepositoryError,
  type CustomerCart,
} from "@db-cart/customer/types/customer-cart.types";
import { findCustomerCartRowByCustomerId } from "@db-cart/queries/customer/customer-cart.queries";

export async function findCustomerCartByCustomerId(
  customerId: string
): Promise<CustomerCart | null> {
  const normalizedCustomerId = parseCustomerCartCustomerId(customerId);
  const row = await findCustomerCartRowByCustomerId(normalizedCustomerId);

  if (row === null) {
    return null;
  }

  if (row.userId === null) {
    return null;
  }

  return mapCustomerCart(mapCartRowToCart(row) as CustomerCart);
}

export async function requireCustomerCartByCustomerId(customerId: string): Promise<CustomerCart> {
  const cart = await findCustomerCartByCustomerId(customerId);

  if (cart === null) {
    throw new CustomerCartRepositoryError(
      "customer_cart_not_found",
      "Le panier client est introuvable."
    );
  }

  return cart;
}
