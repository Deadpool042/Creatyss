import { prisma } from "@/db/prisma-client";
import { createCart } from "@db-cart/core";
import { mapCustomerCart } from "@db-cart/helpers/mappers";
import { findActiveCustomerCartRowByCustomerId } from "@db-cart/queries/cart.queries";
import type {
  CreateCustomerCartInput,
  CustomerCart,
} from "@db-cart/customer/types/customer-cart.types";

async function ensureCustomerExists(customerId: string): Promise<void> {
  const customer = await prisma.customer.findUnique({
    where: {
      id: customerId,
    },
    select: {
      id: true,
    },
  });

  if (!customer) {
    throw new Error("Customer not found.");
  }
}

export async function findActiveCustomerCartByCustomerId(
  customerId: string
): Promise<CustomerCart | null> {
  const row = await findActiveCustomerCartRowByCustomerId(customerId.trim());
  return row ? mapCustomerCart(row) : null;
}

export async function createCustomerCart(
  input: CreateCustomerCartInput
): Promise<CustomerCart> {
  await ensureCustomerExists(input.customerId);
  const cart = await createCart(input);
  return cart as CustomerCart;
}
